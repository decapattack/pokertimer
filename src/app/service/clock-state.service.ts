import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, interval, map, take } from 'rxjs';
import { BlindService, NivelDeBlind } from './blind.service';
import { AnteConfig } from '../pages/ante-modal/ante-modal.component';

// A Interface que define a forma do nosso estado
export interface ClockState {
  tempoRestante: string;
  tempoDeJogo: string;
  jogadoresAtuais: number;
  jogadoresTotais: number;
  chipcount: number;
  mediaDeFichas: number;
  smallBlind: number;
  bigBlind: number;
  ante: number | null;
  logoBase64: string | null;
  backgroundBase64: string | null;
  nivel: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClockStateService implements OnDestroy {
  private timerSubscription: Subscription | undefined;
  private blindsSubscription: Subscription | undefined;

  private tempoInicialEmSegundos = 15 * 1;

  private nivelAtual = 1;

  // Propriedades para controle do timer
  private tempoRestanteAoPausar: number = 0;
  private readonly _isPaused = new BehaviorSubject<boolean>(false);
  public readonly isPaused$ = this._isPaused.asObservable();

  // Propriedade para o tempo de jogo progressivo
  private tempoDeJogoEmSegundos = 0;

  // O estado inicial da aplicação
  private readonly _state = new BehaviorSubject<ClockState>({
    tempoRestante: '00:00',
    tempoDeJogo: '00:00:00',
    jogadoresAtuais: 9,
    jogadoresTotais: 100,
    chipcount: 0,
    mediaDeFichas: 0,
    smallBlind: 0,
    bigBlind: 0,
    ante: null,
    logoBase64: null,
    backgroundBase64: null,
    nivel: 1
  });

  // O Observable público que os componentes consomem
  public readonly state$ = this._state.asObservable();

  constructor(private blindService: BlindService) {}

  public init(): void {
    const initialState = {
      ...this._state.value,
      logoBase64: localStorage.getItem("pokerDashboardLogo"),
      backgroundBase64: localStorage.getItem("pokerDashboardBackground")
    };
    this._updateState(initialState);

    this.blindsSubscription = this.blindService.blindsAtuais$.subscribe(
      (nivel: NivelDeBlind) => {
        this._updateState({
          smallBlind: nivel.sb,
          bigBlind: nivel.bb,
          ante: nivel.ante,
        });
      }
    );

    this.iniciarTimer(this.tempoInicialEmSegundos);
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.blindsSubscription?.unsubscribe();
  }

  // --- MÉTODOS PÚBLICOS PARA CONTROLE DO TIMER ---

  public pausarTimer(): void {
    if (this._isPaused.value) return;
    this.timerSubscription?.unsubscribe();
    this._isPaused.next(true);
  }

  public retomarTimer(): void {
    if (!this._isPaused.value) return;
    this._isPaused.next(false);
    this.iniciarTimer(this.tempoRestanteAoPausar);
  }

  public resetarTimer(): void {
    this._isPaused.next(false);
    this.tempoDeJogoEmSegundos = 0;
    this.nivelAtual = 1;
    this.blindService.resetarNiveis(); // reseta blinds
    this.iniciarTimer(this.tempoInicialEmSegundos);
  }

  // --- OUTROS MÉTODOS PÚBLICOS (API do Serviço) ---

  public definirTempoDeJogo(segundos: number): void {
    this.tempoInicialEmSegundos = segundos;
    this.resetarTimer(); // Reseta para aplicar o novo tempo
  }

  public salvarConfiguracaoAnte(config: AnteConfig): void {
    this.blindService.configurarAnte(config);
  }

  public atualizarJogadores(novoValor: number): void {
    this._updateState({ jogadoresAtuais: novoValor });
  }

  public atualizarChipcount(novoValor: number): void {
    this._updateState({ chipcount: novoValor });
  }

  public salvarLogo(file: File): void {
    this._handleFile(file, (base64) => {
      localStorage.setItem("pokerDashboardLogo", base64);
      this._updateState({ logoBase64: base64 });
    });
  }

  public removerLogo(): void {
    localStorage.removeItem("pokerDashboardLogo");
    this._updateState({ logoBase64: null });
  }

  public salvarBackground(file: File): void {
    this._handleFile(file, (base64) => {
      localStorage.setItem("pokerDashboardBackground", base64);
      this._updateState({ backgroundBase64: base64 });
    });
  }

  public removerBackground(): void {
    localStorage.removeItem("pokerDashboardBackground");
    this._updateState({ backgroundBase64: null });
  }

  // --- MÉTODOS PRIVADOS (Lógica Interna) ---

  private iniciarTimer(duracaoEmSegundos: number): void {
    this.timerSubscription?.unsubscribe();
    this._isPaused.next(false);
    this.timerSubscription = interval(1000)
      .pipe(
        take(duracaoEmSegundos + 1),
        map((tick) => duracaoEmSegundos - tick)
      )
      .subscribe({
        next: (segundosRestantes) => {
          this.tempoRestanteAoPausar = segundosRestantes;
          if (segundosRestantes < duracaoEmSegundos) { // Não incrementa no primeiro segundo
             this.tempoDeJogoEmSegundos++;
          }

          this._updateState({
            tempoRestante: this._formatarTempo(segundosRestantes),
            tempoDeJogo: this._formatarTempoDeJogo(this.tempoDeJogoEmSegundos)
          });
        },
        complete: () => {
          this.blindService.avancarNivel();
          this.nivelAtual++;
          this.iniciarTimer(this.tempoInicialEmSegundos);
        },
      });
  }

  private _formatarTempo(totalSegundos: number): string {
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  }

  private _formatarTempoDeJogo(totalSegundos: number): string {
    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
  }

  private _handleFile(file: File, callback: (result: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  }

  private _updateState(newState: Partial<ClockState>): void {
    const currentState = this._state.value;
    const updatedState = { ...currentState, ...newState, nivel: this.nivelAtual };

    updatedState.mediaDeFichas = updatedState.jogadoresAtuais > 0
      ? updatedState.chipcount / updatedState.jogadoresAtuais
      : 0;

    this._state.next(updatedState);
  }

  public atualizarJogadoresTotais(novoValor: number): void {
  const estadoAtual = this._state.value;
  this._state.next({
    ...estadoAtual,
    jogadoresTotais: novoValor
  });
}
}

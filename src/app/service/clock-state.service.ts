import { Injectable, OnDestroy } from '@angular/core';
// A importação do 'map' está aqui, vinda diretamente do 'rxjs'
import { BehaviorSubject, Subscription, interval, map, take } from 'rxjs';
import { BlindService, NivelDeBlind } from './blind.service';
import { AnteConfig } from '../pages/ante-modal/ante-modal.component';

// 1. Interface que define a forma do nosso estado
export interface ClockState {
  tempoRestante: string;
  jogadoresAtuais: number;
  jogadoresTotais: number;
  chipcount: number;
  mediaDeFichas: number;
  smallBlind: number;
  bigBlind: number;
  ante: number | null;
  logoBase64: string | null;
  backgroundBase64: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ClockStateService implements OnDestroy {
  private timerSubscription: Subscription | undefined;
  private blindsSubscription: Subscription | undefined;

  // Propriedade interna que guarda a duração do nível
  private tempoInicialEmSegundos = 15 * 1;

  // 2. Um único BehaviorSubject para gerenciar todo o estado
  private readonly _state = new BehaviorSubject<ClockState>({
    tempoRestante: '00:00',
    jogadoresAtuais: 9,
    jogadoresTotais: 100,
    chipcount: 0,
    mediaDeFichas: 0,
    smallBlind: 0,
    bigBlind: 0,
    ante: null,
    logoBase64: null,
    backgroundBase64: null,
  });

  // 3. Um observable público para os componentes se inscreverem
  public readonly state$ = this._state.asObservable();

  constructor(private blindService: BlindService) {}

  // 4. Método de inicialização para ser chamado pelo componente principal
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

  // --- MÉTODOS PÚBLICOS (A API do nosso serviço) ---

  public definirTempoDeJogo(segundos: number): void {
    this.tempoInicialEmSegundos = segundos;
    this.iniciarTimer(segundos);
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

  // --- MÉTODOS PRIVADOS (Lógica interna) ---

  private iniciarTimer(duracaoEmSegundos: number): void {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = interval(1000)
      .pipe(
        take(duracaoEmSegundos),
        map((tick) => duracaoEmSegundos - (tick + 1))
      )
      .subscribe({
        next: (segundosRestantes) => {
          this._updateState({ tempoRestante: this._formatarTempo(segundosRestantes) });
        },
        complete: () => {
          this.blindService.avancarNivel();
          this.iniciarTimer(this.tempoInicialEmSegundos);
        },
      });
  }

  private _formatarTempo(totalSegundos: number): string {
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  }

  private _handleFile(file: File, callback: (result: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  }

  // 5. Método central para atualizar o estado e calcular a média
  private _updateState(newState: Partial<ClockState>): void {
    const currentState = this._state.value;
    const updatedState = { ...currentState, ...newState };

    // Recalcula a média sempre que o estado é atualizado
    updatedState.mediaDeFichas = updatedState.jogadoresAtuais > 0
      ? updatedState.chipcount / updatedState.jogadoresAtuais
      : 0;

    this._state.next(updatedState);
  }
}

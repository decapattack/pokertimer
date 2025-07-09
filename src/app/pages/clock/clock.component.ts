import { Component, OnInit, OnDestroy, SecurityContext } from "@angular/core";
import { Subscription, interval, map, take } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { JogadoresModalComponent } from "../jogadores-modal/jogadores-modal.component";
import { ChipcountModalComponent } from "../chipcount-modal/chipcount-modal.component";
import { OptionsModalComponent } from "../options-modal/options-modal.component";
import { BackgroundModalComponent } from "../background-modal/background-modal.component";
import { BlindService, NivelDeBlind } from "../../service/blind.service";

// ---> Importamos as ferramentas do Angular CDK para detectar o tamanho da tela
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

@Component({
  selector: "app-clock",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    JogadoresModalComponent,
    ChipcountModalComponent,
    OptionsModalComponent,
    BackgroundModalComponent,
  ],
  templateUrl: "./clock.component.html",
  styleUrls: ["./clock.component.css"],
})
export class ClockComponent implements OnInit, OnDestroy {
  // ---> Esta é a variável que controla qual layout (PC ou Mobile) é exibido no HTML.
  public isMobile: boolean = false;

  // --- Propriedades de estado da aplicação ---
  public isBackgroundModalOpen = false;
  public isOptionsModalOpen = false;
  public tempoRestante: string = "15:00";
  private readonly tempoInicialEmSegundos = 15 * 60; //15 * 60
  private timerSubscription: Subscription | undefined;
  public backgroundImageUrl: string | null = null;
  public isPlayersModalOpen = false;
  public jogadoresAtuais = 9;
  public jogadoresTotais = 100;
  public isChipcountModalOpen = false;
  public chipcount: number = 0;
  public smallBlind: number = 0;
  public bigBlind: number = 0;
  public ante: number | null = null;
  private blindsSubscription: Subscription | undefined;

  /**
   * ---> No construtor, injetamos o BreakpointObserver e nos inscrevemos para
   * ouvir as mudanças de tamanho da tela, atualizando a variável 'isMobile'.
   */
  constructor(
    private sanitizer: DomSanitizer,
    private blindService: BlindService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall, // Telas de celular em modo retrato
        Breakpoints.Small, // Telas de celular em modo paisagem ou tablets pequenos
      ])
      .subscribe((result) => {
        // 'result.matches' será TRUE se a tela corresponder a um dos tamanhos observados.
        this.isMobile = result.matches;
      });
  }

  /**
   * Ao iniciar, o componente carrega os dados iniciais e se inscreve
   * para receber as atualizações dos blinds do nosso serviço.
   */
  ngOnInit(): void {
    this.carregarImagemDeFundo();
    this.iniciarTimer();

    this.blindsSubscription = this.blindService.blindsAtuais$.subscribe(
      (nivel: NivelDeBlind) => {
        this.smallBlind = nivel.sb;
        this.bigBlind = nivel.bb;
        this.ante = nivel.ante;
      }
    );
  }

  /**
   * Ao destruir o componente, cancelamos todas as inscrições para evitar vazamentos de memória.
   */
  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.blindsSubscription) {
      this.blindsSubscription.unsubscribe();
    }
  }

  /**
   * Controla o ciclo do timer de 15 minutos e chama o serviço de blinds para avançar o nível.
   */
  private iniciarTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = interval(1000)
      .pipe(
        take(this.tempoInicialEmSegundos),
        map((tick) => this.tempoInicialEmSegundos - (tick + 1))
      )
      .subscribe({
        next: (segundosRestantes) => {
          this.tempoRestante = this.formatarTempo(segundosRestantes);
        },
        complete: () => {
          this.tempoRestante = "00:00";
          this.blindService.avancarNivel();
          this.iniciarTimer();
        },
      });
  }

  /**
   * Formata o tempo de segundos para o formato MM:SS.
   */
  private formatarTempo(totalSegundos: number): string {
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    const minutosFormatados = String(minutos).padStart(2, "0");
    const segundosFormatados = String(segundos).padStart(2, "0");
    return `${minutosFormatados}:${segundosFormatados}`;
  }

  // --- Métodos de interação com a UI (upload, modais, etc.) ---

  // ---> 4. MÉTODO ATUALIZADO PARA RECEBER UM ARQUIVO, NÃO UM EVENTO <---
  onFileSelected(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.salvarEAplicarImagem(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  private salvarEAplicarImagem(base64String: string): void {
    localStorage.setItem("pokerDashboardBackground", base64String);
    this.aplicarImagemDeFundo(base64String);
  }

  private carregarImagemDeFundo(): void {
    const imagemSalva = localStorage.getItem("pokerDashboardBackground");
    if (imagemSalva) {
      this.aplicarImagemDeFundo(imagemSalva);
    }
  }

  private aplicarImagemDeFundo(base64String: string): void {
    const urlSegura = this.sanitizer.bypassSecurityTrustUrl(base64String);
    this.backgroundImageUrl = `url(${this.sanitizer.sanitize(
      SecurityContext.URL,
      urlSegura
    )})`;
  }

  public removerImagem(): void {
    localStorage.removeItem("pokerDashboardBackground");
    this.backgroundImageUrl = null;
  }

  public atualizarJogadores(novoValor: number): void {
    this.jogadoresAtuais = novoValor;
  }
  public atualizarChipcount(novoValor: number): void {
    this.chipcount = novoValor;
  }

  public openBackgroundModal(): void {
    this.isOptionsModalOpen = false;
    this.isBackgroundModalOpen = true;
  }
}

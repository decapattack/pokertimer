import { Component, OnInit, OnDestroy, SecurityContext } from "@angular/core";
import { Subscription, interval, map, take } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { JogadoresModalComponent } from "../jogadores-modal/jogadores-modal.component";
import { ChipcountModalComponent } from "../chipcount-modal/chipcount-modal.component";
import { OptionsModalComponent } from "../options-modal/options-modal.component";
import { BackgroundModalComponent } from "../background-modal/background-modal.component";
import { GameTypeModalComponent } from "../game-type-modal/game-type-modal.component";
import { BlindService, NivelDeBlind } from "../../service/blind.service";
import { LogoModalComponent } from "../logo-modal/logo-modal.component";
import { AnteModalComponent, AnteConfig } from '../ante-modal/ante-modal.component'; // 1. Importe



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
    GameTypeModalComponent,
    LogoModalComponent,
    AnteModalComponent
  ],
  templateUrl: "./clock.component.html",
  styleUrls: ["./clock.component.css"],
})
export class ClockComponent implements OnInit, OnDestroy {
  // ---> Esta é a variável que controla qual layout (PC ou Mobile) é exibido no HTML.
  public isMobile: boolean = false;

  // --- Propriedades de estado da aplicação ---
   public isAnteModalOpen = false;
  public isGameTypeModalOpen = false;
  public isBackgroundModalOpen = false;
  public isOptionsModalOpen = false;
  public tempoRestante: string = "15:00";
  private tempoInicialEmSegundos = 1 * 1; //15 * 60
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
  public logoUrl: string | null = null;
  public isLogoModalOpen = false;

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
    this.carregarLogo();
    this.iniciarTimer(this.tempoInicialEmSegundos);

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
  private iniciarTimer(duracaoEmSegundos: number): void {
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
          this.iniciarTimer(this.tempoInicialEmSegundos);
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

  // ---> 6. CRIE OS MÉTODOS PARA CONTROLAR O NOVO FLUXO <---

  public openGameTypeModal(): void {
    this.isOptionsModalOpen = false;
    this.isGameTypeModalOpen = true;
  }

  public definirTempoDeJogo(segundos: number): void {
    // Atualiza o valor padrão para as próximas reinicializações automáticas
    this.tempoInicialEmSegundos = segundos;
    // Fecha o modal
    this.isGameTypeModalOpen = false;
    // Inicia o timer imediatamente com o novo valor
    this.iniciarTimer(this.tempoInicialEmSegundos);
  }

  // ---> 5. LÓGICA PARA A LOGO (copiada e adaptada da lógica do background) <---
  
  public openLogoModal(): void {
    this.isOptionsModalOpen = false;
    this.isLogoModalOpen = true;
  }

  onLogoFileSelected(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.salvarEAplicarLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  private salvarEAplicarLogo(base64String: string): void {
    localStorage.setItem("pokerDashboardLogo", base64String);
    this.aplicarLogo(base64String);
  }

  private carregarLogo(): void {
    const logoSalva = localStorage.getItem("pokerDashboardLogo");
    if (logoSalva) {
      this.aplicarLogo(logoSalva);
    }
  }

  private aplicarLogo(base64String: string): void {
    // Aqui não precisamos da "url()", pois vamos usar no [src] de uma <img>
    const urlSegura = this.sanitizer.bypassSecurityTrustUrl(base64String);
    this.logoUrl = this.sanitizer.sanitize(SecurityContext.URL, urlSegura);
  }

  public removerLogo(): void {
    localStorage.removeItem("pokerDashboardLogo");
    this.logoUrl = null;
  }

  public openAnteModal(): void {
    this.isOptionsModalOpen = false;
    this.isAnteModalOpen = true;
  }

  public salvarConfiguracaoAnte(config: AnteConfig): void {
    this.blindService.configurarAnte(config);
    this.isAnteModalOpen = false; // Fecha o modal após salvar
  }
}

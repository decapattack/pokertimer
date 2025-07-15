import { Component, OnInit, OnDestroy, SecurityContext } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Observable, map } from 'rxjs'; // ✅ Importa o 'map' aqui
import { BreakpointObserver, Breakpoints, BreakpointState } from "@angular/cdk/layout"; // ✅ Importa o 'BreakpointState' aqui

// Componentes de Modal
import { JogadoresModalComponent } from "../jogadores-modal/jogadores-modal.component";
import { ChipcountModalComponent } from "../chipcount-modal/chipcount-modal.component";
import { OptionsModalComponent } from "../options-modal/options-modal.component";
import { BackgroundModalComponent } from "../background-modal/background-modal.component";
import { GameTypeModalComponent } from "../game-type-modal/game-type-modal.component";
import { LogoModalComponent } from "../logo-modal/logo-modal.component";
import { AnteModalComponent, AnteConfig } from '../ante-modal/ante-modal.component';

// O Serviço de Estado
import { ClockState, ClockStateService } from "../../service/clock-state.service";

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
export class ClockComponent implements OnInit { // Removido OnDestroy, pois não é mais necessário
  public isMobile$: Observable<boolean>;
  public state$: Observable<ClockState>;

  // Flags para controlar a visibilidade dos modais
  public isOptionsModalOpen = false;
  public isPlayersModalOpen = false;
  public isChipcountModalOpen = false;
  public isBackgroundModalOpen = false;
  public isGameTypeModalOpen = false;
  public isLogoModalOpen = false;
  public isAnteModalOpen = false;

  constructor(
    private sanitizer: DomSanitizer,
    private clockStateService: ClockStateService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.state$ = this.clockStateService.state$;

    // ✅ LINHA CORRIGIDA ✅
    // Adicionamos o tipo 'BreakpointState' ao parâmetro 'result'.
    this.isMobile$ = this.breakpointObserver.observe([
      Breakpoints.XSmall, Breakpoints.Small
    ]).pipe(map((result: BreakpointState) => result.matches));
  }

  ngOnInit(): void {
    this.clockStateService.init();
  }

  // --- MÉTODOS DELEGAÇÃO ---
  public definirTempoDeJogo(segundos: number): void {
    this.clockStateService.definirTempoDeJogo(segundos);
    this.isGameTypeModalOpen = false;
  }

  public salvarConfiguracaoAnte(config: AnteConfig): void {
    this.clockStateService.salvarConfiguracaoAnte(config);
    this.isAnteModalOpen = false;
  }

  public atualizarJogadores(novoValor: number): void {
    this.clockStateService.atualizarJogadores(novoValor);
  }

  public atualizarChipcount(novoValor: number): void {
    this.clockStateService.atualizarChipcount(novoValor);
  }

  public onLogoFileSelected(file: File): void {
    this.clockStateService.salvarLogo(file);
  }

  public removerLogo(): void {
    this.clockStateService.removerLogo();
  }

  public onBackgroundFileSelected(file: File): void {
    this.clockStateService.salvarBackground(file);
  }

  public removerBackground(): void {
    this.clockStateService.removerBackground();
  }

  // --- MÉTODOS DE UI ---
  public openBackgroundModal(): void {
    this.isOptionsModalOpen = false;
    this.isBackgroundModalOpen = true;
  }

  public openLogoModal(): void {
    this.isOptionsModalOpen = false;
    this.isLogoModalOpen = true;
  }

  public openGameTypeModal(): void {
    this.isOptionsModalOpen = false;
    this.isGameTypeModalOpen = true;
  }

  public openAnteModal(): void {
    this.isOptionsModalOpen = false;
    this.isAnteModalOpen = true;
  }

  // --- MÉTODOS DE SANITIZAÇÃO ---
  public getSanitizedLogo(base64: string | null): SafeUrl | null {
    if (!base64) return null;
    return this.sanitizer.bypassSecurityTrustUrl(base64);
  }

  public getSanitizedBackground(base64: string | null): string | null {
    if (!base64) return null;
    const urlSegura = this.sanitizer.bypassSecurityTrustUrl(base64);
    return `url(${this.sanitizer.sanitize(SecurityContext.URL, urlSegura)})`;
  }
}

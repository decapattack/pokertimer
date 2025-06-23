import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Sanitizer, SecurityContext } from '@angular/core';
import { Subscription, interval, map, take } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit, OnDestroy {
  public tempoRestante: string = '15:00'; 
  private readonly tempoInicialEmSegundos = 15 * 60; 
  private timerSubscription: Subscription | undefined;
  public backgroundImageUrl: string | null = null;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.iniciarTimer();
    this.carregarImagemDeFundo();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private iniciarTimer(): void {
    // Cria um observable que emite um número a cada 1000 ms (1 segundo).
    const source = interval(1000);

    this.timerSubscription = source.pipe(
      // O operador `take` garante que o timer vai parar após emitir N vezes.
      // Neste caso, ele vai emitir 900 vezes (o total de segundos).
      take(this.tempoInicialEmSegundos),
      
      // O operador `map` transforma o valor emitido.
      // 'tick' começa em 0, 1, 2...
      // A cada tick, calculamos quantos segundos restam.
      map(tick => this.tempoInicialEmSegundos - (tick + 1))

    ).subscribe({
      // O 'next' é chamado a cada segundo com o novo valor (segundosRestantes).
      next: (segundosRestantes) => {
        this.tempoRestante = this.formatarTempo(segundosRestantes);
      },
      // O 'complete' é chamado quando o `take` finaliza a contagem.
      complete: () => {
        this.tempoRestante = '00:00';
        // Aqui você poderia adicionar uma lógica para o que acontece quando o tempo acaba.
        console.log('O tempo acabou!');
      }
    });
  }

  /**
   * Função auxiliar para formatar o tempo de segundos para MM:SS.
   * @param totalSegundos O número total de segundos a ser formatado.
   * @returns Uma string no formato "MM:SS".
   */
  private formatarTempo(totalSegundos: number): string {
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;

    // `padStart` garante que teremos sempre 2 dígitos (ex: '01' em vez de '1').
    const minutosFormatados = String(minutos).padStart(2, '0');
    const segundosFormatados = String(segundos).padStart(2, '0');

    return `${minutosFormatados}:${segundosFormatados}`;
  }

  /**
   * Chamado quando o usuário seleciona um arquivo no input.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      // Quando o leitor terminar de carregar o arquivo...
      reader.onload = () => {
        const base64String = reader.result as string;
        // Salva no localStorage e aplica como fundo
        this.salvarEAplicarImagem(base64String);
      };

      // Inicia a leitura do arquivo, convertendo-o para uma URL Base64
      reader.readAsDataURL(file);
    }
  }

  /**
   * Salva a string Base64 no localStorage e atualiza a propriedade do componente.
   */
  private salvarEAplicarImagem(base64String: string): void {
    // Salva a string no "banco" do navegador com a chave 'pokerDashboardBackground'
    localStorage.setItem('pokerDashboardBackground', base64String);
    this.aplicarImagemDeFundo(base64String);
  }

  /**
   * Carrega a imagem do localStorage, se existir.
   */
  private carregarImagemDeFundo(): void {
    const imagemSalva = localStorage.getItem('pokerDashboardBackground');
    if (imagemSalva) {
      this.aplicarImagemDeFundo(imagemSalva);
    }
  }

  /**
   * Atualiza a variável que está ligada ao estilo do template.
   */
  private aplicarImagemDeFundo(base64String: string): void {
    // Usamos o sanitizer do Angular para marcar a URL como segura
    const urlSegura = this.sanitizer.bypassSecurityTrustUrl(base64String);
    this.backgroundImageUrl = `url(${this.sanitizer.sanitize(SecurityContext.URL, urlSegura)})`;
  }
  
  /**
   * Remove a imagem do localStorage e da tela.
   */
  public removerImagem(): void {
    localStorage.removeItem('pokerDashboardBackground');
    this.backgroundImageUrl = null;
  }


}

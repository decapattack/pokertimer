import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-players-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jogadores-modal.component.html',
  styleUrls: ['./jogadores-modal.component.css']
})
export class JogadoresModalComponent {
  /**
   * @Input() permite que o componente receba valores do componente pai.
   * Aqui, recebemos o número atual e o total de jogadores.
   */
  @Input() jogadoresAtuais: number = 0;
  @Input() jogadoresTotais: number = 0;

  /**
   * @Output() cria um evento que o componente pai pode ouvir.
   * 'close' será emitido quando o usuário quiser fechar o modal.
   * 'update' será emitido para enviar o novo número de jogadores para o pai.
   */
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<number>();

  /**
   * Função para incrementar o número de jogadores.
   * Ela não permite que o número atual ultrapasse o total.
   */
  incrementar(): void {
    if (this.jogadoresAtuais < this.jogadoresTotais) {
      this.jogadoresAtuais++;
      // Emite o novo valor para o componente pai
      this.update.emit(this.jogadoresAtuais);
    }
  }

  /**
   * Função para decrementar o número de jogadores.
   * Ela não permite que o número seja menor que 0.
   */
  decrementar(): void {
    if (this.jogadoresAtuais > 0) {
      this.jogadoresAtuais--;
      // Emite o novo valor para o componente pai
      this.update.emit(this.jogadoresAtuais);
    }
  }

  /**
   * Emite o evento 'close' para que o componente pai saiba
   * que deve fechar o modal.
   */
  fecharModal(): void {
    this.close.emit();
  }
}
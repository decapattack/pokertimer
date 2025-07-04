import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Precisamos do FormsModule para usar o [(ngModel)] no campo de input
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chipcount-modal',
  standalone: true,
  // Adicione o FormsModule aos imports do componente
  imports: [CommonModule, FormsModule],
  templateUrl: './chipcount-modal.component.html',
  styleUrls: ['./chipcount-modal.component.css']
})
export class ChipcountModalComponent implements OnInit {
  /**
   * @Input() recebe o valor inicial do chipcount do componente pai.
   */
  @Input() valorInicial: number = 0;

  /**
   * @Output() para emitir eventos para o componente pai.
   * 'close' para fechar o modal.
   * 'update' para enviar o novo valor.
   */
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<number>();

  // Variável interna para vincular ao campo de input com ngModel.
  public valorEditavel: number = 0;

  constructor() {}

  ngOnInit(): void {
    // Ao iniciar, o valor editável recebe o valor que veio do componente pai.
    this.valorEditavel = this.valorInicial;
  }

  /**
   * Esta função é chamada para finalizar a edição.
   * Ela emite o novo valor e o evento para fechar o modal.
   */
  salvarEFechar(): void {
    // Garante que estamos enviando um número válido.
    const novoValor = Number(this.valorEditavel);
    if (!isNaN(novoValor)) {
      this.update.emit(novoValor);
    }
    this.close.emit();
  }
}
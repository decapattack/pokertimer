import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';


@Component({
  selector: 'app-chipcount-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './chipcount-modal.component.html',
  styleUrls: ['./chipcount-modal.component.css']
})
export class ChipcountModalComponent implements OnInit {
  @Input() valorInicial: number = 0;
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<number>();

  // Variável para controlar o modo: 'display' (padrão) ou 'add'/'subtract' (edição)
  public mode: 'display' | 'add' | 'subtract' = 'display';
  
  // Guarda o valor total do chipcount
  public valorEditavel: number = 0;

  // Guarda o valor a ser somado/subtraído no modo de edição
  public valorDaOperacao: number | null = null;

  constructor() {}

  ngOnInit(): void {
    this.valorEditavel = this.valorInicial;
  }

  /**
   * Alterna para o modo de edição quando '+' ou '-' são clicados.
   */
  switchToEditMode(operation: 'add' | 'subtract'): void {
    this.mode = operation;
  }

  /**
   * Executa a soma ou subtração e volta ao modo de exibição.
   */
  confirmarOperacao(): void {
    const valor = Number(this.valorDaOperacao);

    if (!isNaN(valor) && valor > 0) {
      if (this.mode === 'add') {
        this.valorEditavel += valor;
      } else if (this.mode === 'subtract') {
        this.valorEditavel = Math.max(0, this.valorEditavel - valor); // Impede valor negativo
      }
    }
    this.cancelarOperacao(); // Reseta para o modo de exibição
  }

  /**
   * Cancela a edição e volta para o modo de exibição sem fazer alterações.
   */
  cancelarOperacao(): void {
    this.mode = 'display';
    this.valorDaOperacao = null; // Limpa o campo para a próxima vez
  }

  /**
   * Emite o valor final e fecha o modal (só funciona no modo de exibição).
   */
  salvarEFechar(): void {
    if (this.mode === 'display') {
      this.update.emit(this.valorEditavel);
      this.close.emit();
    }
  }
}
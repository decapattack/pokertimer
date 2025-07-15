import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interface para definir a configuração do Ante que será enviada
export interface AnteConfig {
  type: 'initial' | 'fraction' | 'none'; // 'none' para desativar
  value: number;
}

@Component({
  selector: 'app-ante-modal',
  standalone: true,
  imports: [CommonModule, FormsModule], // Adicione FormsModule
  templateUrl: './ante-modal.component.html',
  styleUrls: ['./ante-modal.component.css']
})
export class AnteModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AnteConfig>();

  // Opções para os selects
  public initialAnteOptions: number[] = [];
  public fractionOptions = [1, 2, 3, 4, 5];

  // Modelo para os inputs do formulário
  public selectedType: 'initial' | 'fraction' = 'initial';
  public selectedInitialValue: number = 200; // Valor padrão
  public selectedFractionValue: number = 4;   // Valor padrão

  constructor() { }

  ngOnInit(): void {
    // Gera as opções para o "Ante Inicial" de 25 a 1000, com passo 25
    for (let i = 25; i <= 1000; i += 25) {
      this.initialAnteOptions.push(i);
    }
  }

  onSave(): void {
    const config: AnteConfig = {
      type: this.selectedType,
      value: this.selectedType === 'initial' 
        ? this.selectedInitialValue 
        : this.selectedFractionValue
    };
    this.save.emit(config);
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}
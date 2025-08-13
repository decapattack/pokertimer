import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-total-players-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './total-players-modal.component.html',
  styleUrls: ['./total-players-modal.component.css']
})
export class TotalPlayersModalComponent implements OnInit {
  @Input() valorAtual: number = 100;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<number>();

  public novoValor: number = 100;

  ngOnInit(): void {
    this.novoValor = this.valorAtual;
  }

  onSave(): void {
    if (this.novoValor && this.novoValor > 0) {
      this.save.emit(this.novoValor);
    }
  }

  onClose(): void {
    this.close.emit();
  }

  // Permite apenas números no input
  onKeyPress(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-type-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-type-modal.component.html',
  styleUrls: ['./game-type-modal.component.css']
})
export class GameTypeModalComponent {
  @Output() close = new EventEmitter<void>();
  // Emite o tempo selecionado em SEGUNDOS
  @Output() timeSelected = new EventEmitter<number>();

  onClose(): void {
    this.close.emit();
  }

  selectTime(minutes: number): void {
    const seconds = minutes * 60;
    this.timeSelected.emit(seconds);
  }
}
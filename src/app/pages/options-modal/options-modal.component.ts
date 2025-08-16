import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-options-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './options-modal.component.html',
  styleUrls: ['./options-modal.component.css']
})
export class OptionsModalComponent {
  // ---> Eventos que serão emitidos para o componente pai <---

  // Evento para fechar o modal
  @Output() close = new EventEmitter<void>();

  @Output() openBackgroundOptions = new EventEmitter<void>();
  @Output() openGameTypeOptions = new EventEmitter<void>();
  @Output() openLogoOptions = new EventEmitter<void>();
  @Output() openAnteOptions = new EventEmitter<void>();
  @Output() openTotalPlayersOptions = new EventEmitter<void>();
  @Output() openBlindsStructureOptions = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

}

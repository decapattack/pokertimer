import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-background-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './background-modal.component.html',
  styleUrls: ['./background-modal.component.css']
})
export class BackgroundModalComponent {
  // Eventos que serão enviados para o ClockComponent
  @Output() close = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();
  @Output() removeImage = new EventEmitter<void>();

  // Método para fechar o modal
  onClose(): void {
    this.close.emit();
  }

  // Método que lida com a seleção do arquivo
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fileSelected.emit(input.files[0]);
      // Opcional: fechar o modal após selecionar a imagem
      this.onClose(); 
    }
  }

  // Método que lida com a remoção da imagem
  onRemoveImage(): void {
    this.removeImage.emit();
    // Opcional: fechar o modal após remover a imagem
    this.onClose();
  }
}
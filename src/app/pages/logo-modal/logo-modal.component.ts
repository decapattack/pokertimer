import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logo-modal.component.html',
  styleUrls: ['./logo-modal.component.css']
})
export class LogoModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() fileSelected = new EventEmitter<File>();
  @Output() removeImage = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fileSelected.emit(input.files[0]);
      this.onClose(); 
    }
  }

  onRemoveImage(): void {
    this.removeImage.emit();
    this.onClose();
  }
}
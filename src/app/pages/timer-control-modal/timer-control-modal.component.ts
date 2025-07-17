import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer-control-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer-control-modal.component.html',
  styleUrls: ['./timer-control-modal.component.css']
})
export class TimerControlModalComponent {
  //DADOS QUE VÊM DO COMPONENTE PAI (CLOCK)
  @Input() tempo: string | null = '00:00';
  @Input() isPaused: boolean | null = false;

  //EVENTOS QUE SÃO EMITIDOS PARA O COMPONENTE PAI
  @Output() close = new EventEmitter<void>();
  @Output() pause = new EventEmitter<void>();
  @Output() resume = new EventEmitter<void>();
  @Output() stop = new EventEmitter<void>();

  constructor() {}

  onPause(): void {
    this.pause.emit();
  }

  onResume(): void {
    this.resume.emit();
    this.close.emit(); // Fecha o modal ao dar play, como solicitado
  }

  onStop(): void {
    this.stop.emit();
  }
}
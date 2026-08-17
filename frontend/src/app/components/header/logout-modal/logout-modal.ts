import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-logout-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './logout-modal.html',
  styleUrls: ['./logout-modal.css']
})
export class LogoutModalComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmar = new EventEmitter<void>();

  loading: boolean = false;

  fechar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  confirmarLogout(): void {
    this.loading = true;
    this.confirmar.emit();
    this.fechar();
    this.loading = false;
  }
}

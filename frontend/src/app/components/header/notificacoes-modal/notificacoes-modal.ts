import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-notificacoes-modal',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './notificacoes-modal.html',
  styleUrls: ['./notificacoes-modal.css']
})
export class NotificacoesModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  notificacoes: any[] = [];
  loading: boolean = false;
  usuario: any = null;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUser();
    if (this.usuario) {
      this.carregarNotificacoes();
    }

    this.authService.notificacoes$.subscribe(notificacoes => {
      this.notificacoes = notificacoes;
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && changes['visible'].currentValue === true) {
      this.carregarNotificacoes();
    }
  }

  carregarNotificacoes(): void {
    if (!this.usuario) {
      this.usuario = this.authService.getUser();
      if (!this.usuario) return;
    }

    const notificacoesPorUsuario = JSON.parse(localStorage.getItem('notificacoesPorUsuario') || '{}');
    this.notificacoes = notificacoesPorUsuario[this.usuario.id] || [];
    this.authService.notificacoesSubject.next(this.notificacoes);
    this.cdr.detectChanges();
  }

  fechar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  marcarComoLida(id: number): void {
    if (!this.usuario) return;

    const notificacoesPorUsuario = JSON.parse(localStorage.getItem('notificacoesPorUsuario') || '{}');
    let notificacoes = notificacoesPorUsuario[this.usuario.id] || [];
    notificacoes = notificacoes.map((n: any) => n.id === id ? {...n, lida: true} : n);
    notificacoesPorUsuario[this.usuario.id] = notificacoes;
    localStorage.setItem('notificacoesPorUsuario', JSON.stringify(notificacoesPorUsuario));

    this.notificacoes = notificacoes;
    this.authService.notificacoesSubject.next(notificacoes);
    this.cdr.detectChanges();
  }

  limparTodas(): void {
    if (!this.usuario) return;

    const notificacoesPorUsuario = JSON.parse(localStorage.getItem('notificacoesPorUsuario') || '{}');
    notificacoesPorUsuario[this.usuario.id] = [];
    localStorage.setItem('notificacoesPorUsuario', JSON.stringify(notificacoesPorUsuario));

    this.notificacoes = [];
    this.authService.notificacoesSubject.next([]);
    this.cdr.detectChanges();

    this.messageService.add({
      severity: 'success',
      summary: 'Notificações limpas',
      detail: 'Todas as notificações foram removidas com sucesso!',
      life: 3000
    });
  }
}

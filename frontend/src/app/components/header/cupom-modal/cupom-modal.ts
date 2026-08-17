import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-cupom-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './cupom-modal.html',
  styleUrls: ['./cupom-modal.css']
})
export class CupomModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  usuario: any = null;
  carregando: boolean = false;
  abaAtiva: string = 'disponiveis';
  cuponsDisponiveis: any[] = [];
  cuponsUsados: any[] = [];

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUser();
  }

  ngOnChanges(): void {
    if (this.visible) {
      this.carregarCupons();
    }
  }

carregarCupons(): void {
  this.carregando = true;
  const user = this.authService.getUser();
  if (!user) {
    this.carregando = false;
    return;
  }

  const cuponsPorUsuario = JSON.parse(localStorage.getItem('cuponsPorUsuario') || '{}');
  const cupons = cuponsPorUsuario[user.id] || [];

  this.cuponsDisponiveis = cupons.filter((c: any) => !c.usado);
  this.cuponsUsados = cupons.filter((c: any) => c.usado);

  this.authService.atualizarCuponsCount(this.cuponsDisponiveis.length);

  this.carregando = false;
}

copiarCupom(codigo: string): void {
  console.log('Tentando copiar:', codigo);

  const textarea = document.createElement('textarea');
  textarea.value = codigo;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const sucesso = document.execCommand('copy');
    console.log('Sucesso:', sucesso);
    if (sucesso) {
      this.messageService.add({
        severity: 'success',
        summary: 'Copiado!',
        detail: `Cupom ${codigo} copiado para a área de transferência`
      });
      this.authService.adicionarNotificacao(
        'Cupom Copiado',
        `Cupom ${codigo} foi copiado`,
        'success'
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível copiar o cupom'
      });
    }
  } catch (err) {
    console.error('Erro:', err);
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível copiar o cupom'
    });
  } finally {
    document.body.removeChild(textarea);
  }
}

  fechar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}

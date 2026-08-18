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

  async carregarCupons(): Promise<void> {
    this.carregando = true;
    const user = this.authService.getUser();
    if (!user) {
      this.carregando = false;
      return;
    }

    try {
      const token = this.authService.getToken();

      const [disponiveisRes, usadosRes] = await Promise.all([
        fetch(`/api/cupons/cliente/${user.id}/disponiveis`, {
          headers: { 'Authorization': 'Bearer ' + token }
        }),
        fetch(`/api/cupons/cliente/${user.id}/usados`, {
          headers: { 'Authorization': 'Bearer ' + token }
        })
      ]);

      if (disponiveisRes.ok) {
        this.cuponsDisponiveis = await disponiveisRes.json();
      }

      if (usadosRes.ok) {
        this.cuponsUsados = await usadosRes.json();
      }

      this.authService.atualizarCuponsCount(this.cuponsDisponiveis.length);

    } catch (error) {
      console.error('Erro ao carregar cupons:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar cupons'
      });
    } finally {
      this.carregando = false;
    }
  }

  copiarCupom(codigo: string): void {
    navigator.clipboard.writeText(codigo).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Copiado!',
        detail: `Cupom ${codigo} copiado para a área de transferência`
      });
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível copiar o cupom'
      });
    });
  }

  isExpirando(dataExpiracao: string): boolean {
    if (!dataExpiracao) return false;
    const agora = new Date();
    const expiracao = new Date(dataExpiracao);
    const diff = (expiracao.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 3;
  }

  fechar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}

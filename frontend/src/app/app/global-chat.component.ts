import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-global-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="chat-drawer" [class.open]="chatAberto" *ngIf="pedidoChat">
      <div class="chat-overlay" (click)="fecharChat()"></div>
      <div class="chat-panel">
        <div class="chat-header">
          <div class="chat-header-info">
            <i class="pi pi-comment"></i>
            <div>
              <span class="chat-header-title">Chat do Pedido</span>
              <span class="chat-header-pedido">#{{ pedidoChat?.id }}</span>
            </div>
          </div>
          <button class="chat-close" (click)="fecharChat()">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="chat-messages" #chatMessages>
          <div *ngIf="mensagensChat.length === 0" class="chat-empty">
            <i class="pi pi-comment"></i>
            <p>Nenhuma mensagem ainda</p>
            <span>Inicie uma conversa com o vendedor</span>
          </div>

          <div *ngFor="let msg of mensagensChat" class="chat-message"
               [class.message-admin]="msg.doAdmin"
               [class.message-cliente]="!msg.doAdmin">
            <div class="message-bubble">
              <span class="message-text">{{ msg.mensagem }}</span>
              <span class="message-time">{{ msg.dataEnvio | date:'HH:mm' }}</span>
            </div>
            <div class="message-author">
              {{ msg.doAdmin ? 'Vendedor' : 'Você' }}
            </div>
          </div>
        </div>

        <div class="chat-footer" *ngIf="chatAtivo">
          <div class="chat-input-wrapper">
            <input
              type="text"
              [(ngModel)]="novaMensagemChat"
              placeholder="Digite sua mensagem..."
              (keyup.enter)="enviarMensagemChat()"
              class="chat-input">
            <button
              class="chat-send-btn"
              (click)="enviarMensagemChat()"
              [disabled]="!novaMensagemChat.trim()">
              <i class="pi pi-send"></i>
            </button>
          </div>
          <button *ngIf="isAdmin" class="chat-encerrar-btn" (click)="encerrarAtendimento()">
            <i class="pi pi-times-circle"></i> Encerrar Atendimento
          </button>
        </div>

<div class="chat-footer" *ngIf="!chatAtivo">
  <div class="chat-encerrado">
    <i class="pi pi-info-circle"></i>
    <span>Atendimento encerrado</span>
  </div>
  <button class="chat-reativar-btn" (click)="reativarAtendimento()">
    <i class="pi pi-refresh"></i> Iniciar nova conversa
  </button>
</div>
      </div>
    </div>

    <div class="custom-modal" [class.active]="displayConfirmarEncerrar">
      <div class="custom-modal-overlay" (click)="cancelarEncerrar()"></div>
      <div class="custom-modal-content">
        <div class="custom-modal-header">
          <div class="auth-icon" style="background: #fee2e2;">
            <i class="pi pi-exclamation-triangle" style="color: #dc2626;"></i>
          </div>
          <h2>Encerrar Atendimento</h2>
          <p>Tem certeza que deseja encerrar o atendimento?</p>
        </div>
        <div class="custom-modal-body" style="text-align: center;">
          <p style="color: #4a5a6a; font-size: 0.95rem;">
            O atendimento será encerrado e você não poderá mais enviar mensagens.
          </p>
          <p style="color: #94a3b8; font-size: 0.85rem;">
            Você pode reativar a qualquer momento clicando em "Iniciar nova conversa".
          </p>
        </div>
        <div class="custom-modal-footer">
          <div class="modal-actions">
            <button class="btn-secondary" (click)="cancelarEncerrar()">
              <i class="pi pi-times"></i> Cancelar
            </button>
            <button class="btn-danger" (click)="confirmarEncerrarAtendimento()">
              <i class="pi pi-check"></i> Sim, Encerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-drawer {
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 99999;
      display: none;
    }

    .chat-drawer.open {
      display: block;
    }

    .chat-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 99998;
    }

    .chat-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 50%;
      height: 100%;
      background: white;
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      animation: slideInChat 0.3s ease;
      z-index: 99999;
    }

    @keyframes slideInChat {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e8ecf0;
      background: #2a5298;
      color: white;
      flex-shrink: 0;
    }

    .chat-header-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .chat-header-info i {
      font-size: 1.5rem;
    }

    .chat-header-title {
      font-weight: 700;
      font-size: 1rem;
    }

    .chat-header-pedido {
      font-size: 0.85rem;
      opacity: 0.8;
      margin-left: 0.3rem;
    }

    .chat-close {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.25rem;
      transition: opacity 0.2s;
    }

    .chat-close:hover {
      opacity: 0.7;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 1.5rem;
      background: #f8fafc;
    }

    .chat-messages::-webkit-scrollbar {
      width: 4px;
    }

    .chat-messages::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .chat-empty {
      text-align: center;
      padding: 3rem 0;
      color: #94a3b8;
    }

    .chat-empty i {
      font-size: 3rem;
      color: #cbd5e1;
      display: block;
      margin-bottom: 0.5rem;
    }

    .chat-empty p {
      margin: 0;
      font-size: 1rem;
      color: #6b7a8f;
    }

    .chat-empty span {
      font-size: 0.85rem;
    }

    .chat-message {
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
    }

    .chat-message.message-cliente {
      align-items: flex-end;
    }

    .chat-message.message-admin {
      align-items: flex-start;
    }

    .message-bubble {
      max-width: 75%;
      padding: 0.7rem 1rem;
      border-radius: 12px;
      position: relative;
      word-wrap: break-word;
    }

    .message-cliente .message-bubble {
      background: #2a5298;
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message-admin .message-bubble {
      background: white;
      color: #1a2332;
      border: 1px solid #e8ecf0;
      border-bottom-left-radius: 4px;
    }

    .message-text {
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .message-time {
      font-size: 0.65rem;
      opacity: 0.7;
      margin-left: 0.5rem;
      display: inline-block;
    }

    .message-author {
      font-size: 0.7rem;
      color: #94a3b8;
      margin-top: 0.15rem;
      padding: 0 0.25rem;
    }

    .chat-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #e8ecf0;
      background: white;
      flex-shrink: 0;
    }

    .chat-input-wrapper {
      display: flex;
      gap: 0.5rem;
    }

    .chat-input {
      flex: 1;
      padding: 0.6rem 1rem;
      border: 1.5px solid #d1d5db;
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
      font-family: 'Montserrat', sans-serif;
    }

    .chat-input:focus {
      border-color: #2a5298;
    }

    .chat-send-btn {
      padding: 0.6rem 1.2rem;
      background: #2a5298;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
    }

    .chat-send-btn:hover:not(:disabled) {
      background: #1a3a6e;
    }

    .chat-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .chat-encerrar-btn {
      margin-top: 0.5rem;
      padding: 0.4rem 1rem;
      background: transparent;
      border: 1.5px solid #dc2626;
      color: #dc2626;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      width: 100%;
      justify-content: center;
    }

.chat-reativar-btn {
  margin-top: 0.5rem;
  padding: 0.4rem 1rem;
  background: #22c55e;
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  width: 100%;
  justify-content: center;
}

.chat-reativar-btn:hover {
  background: #16a34a;
}

    .chat-encerrar-btn:hover {
      background: #dc2626;
      color: white;
    }

    .chat-encerrado {
      text-align: center;
      padding: 0.5rem;
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .chat-encerrado i {
      margin-right: 0.4rem;
      color: #94a3b8;
    }

    .custom-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100000;
    }

    .custom-modal.active {
      display: flex;
    }

    .custom-modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }

    .custom-modal-content {
      position: relative;
      background: white;
      border-radius: 16px;
      max-width: 95%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      padding: 2rem;
    }

    .custom-modal-header {
      text-align: center;
      padding:0;
    }

    .custom-modal-header h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: #1a2332;
      margin: 0;
    }

    .custom-modal-header p {
      color: #6b7a8f;
      font-size: 0.9rem;
      margin: 0.25rem 0 0 0;
    }

    .auth-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.75rem;
    }

    .auth-icon i {
      font-size: 1.5rem;
    }

    .custom-modal-body {
      padding: 0.5rem 0 1rem 0;
    }

    .custom-modal-footer {
      padding: 1rem;
      border-top: 1px solid #e8ecf0;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .chat-panel {
        width: 100%;
      }
    }
  `]
})
export class GlobalChatComponent implements OnInit, OnDestroy {
  @ViewChild('chatMessages') chatMessages!: ElementRef;

  chatAberto: boolean = false;
  pedidoChat: any = null;
  mensagensChat: any[] = [];
  novaMensagemChat: string = '';
  chatAtivo: boolean = true;
  chatInterval: any = null;
  displayConfirmarEncerrar: boolean = false;
  isAdmin: boolean = false;

  private ultimoStatusPorPedido: Map<number, boolean> = new Map();
  private carregandoMensagens: boolean = false;
  private pedidoIdAtual: number = 0;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.chatService.abrirChat$.subscribe(({ pedidoId, pedido }) => {
      if (this.pedidoIdAtual !== pedidoId) {
        this.fecharChat();
        this.abrirChat(pedidoId, pedido);
      }
    });
  }

  ngOnDestroy(): void {
    this.limparIntervalo();
  }

  private limparIntervalo(): void {
    if (this.chatInterval) {
      clearInterval(this.chatInterval);
      this.chatInterval = null;
    }
  }

async abrirChat(pedidoId: number, pedido: any): Promise<void> {
  if (!pedido || !pedido.id) {
    try {
      const user = this.authService.getUser();
      if (!user) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Usuário não autenticado'
        });
        return;
      }
      const token = this.authService.getToken();
      const response = await fetch(`/api/pedidos/${pedidoId}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      if (response.ok) {
        pedido = await response.json();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os dados do pedido'
        });
        return;
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar dados do pedido'
      });
      return;
    }
  }

  this.pedidoIdAtual = pedidoId;
  this.pedidoChat = pedido;
  this.chatAberto = true;
  this.novaMensagemChat = '';
  this.mensagensChat = [];
  this.carregandoMensagens = false;

  const user = this.authService.getUser();
  this.isAdmin = user?.perfil === 'ADMIN';

  this.limparIntervalo();

  await this.carregarMensagensChat(pedidoId);
  await this.verificarAtendimento(pedidoId);

  this.chatInterval = setInterval(() => {
    if (this.chatAberto && this.pedidoIdAtual === pedidoId && !this.carregandoMensagens) {
      this.carregarMensagensChatSilenciosamente(pedidoId);
    }
  }, 5000);
}

  fecharChat(): void {
    this.chatAberto = false;
    this.pedidoChat = null;
    this.mensagensChat = [];
    this.novaMensagemChat = '';
    this.carregandoMensagens = false;
    this.pedidoIdAtual = 0;
    this.limparIntervalo();
  }

  async carregarMensagensChat(pedidoId: number): Promise<void> {
    if (this.carregandoMensagens) return;

    this.carregandoMensagens = true;
    try {
      const user = this.authService.getUser();
      if (!user) {
        this.carregandoMensagens = false;
        return;
      }
      const token = this.authService.getToken();

      const url = `/api/chat/cliente/${pedidoId}?clienteId=${user.id}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        this.mensagensChat = await response.json();
        this.scrollChatParaBaixo();

        await fetch(`/api/chat/cliente/${pedidoId}/ler`, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      this.carregandoMensagens = false;
    }
  }

  async carregarMensagensChatSilenciosamente(pedidoId: number): Promise<void> {
    if (this.carregandoMensagens || !this.chatAberto) return;

    this.carregandoMensagens = true;
    try {
      const user = this.authService.getUser();
      if (!user) {
        this.carregandoMensagens = false;
        return;
      }
      const token = this.authService.getToken();

      const response = await fetch(`/api/chat/cliente/${pedidoId}?clienteId=${user.id}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        const novasMensagens = await response.json();
        if (JSON.stringify(novasMensagens) !== JSON.stringify(this.mensagensChat)) {
          this.mensagensChat = novasMensagens;
          this.scrollChatParaBaixo();

          await fetch(`/api/chat/cliente/${pedidoId}/ler`, {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
        }
      }

      await this.verificarAtendimento(pedidoId);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      this.carregandoMensagens = false;
    }
  }

  scrollChatParaBaixo(): void {
    setTimeout(() => {
      if (this.chatMessages) {
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
      }
    }, 100);
  }

  async enviarMensagemChat(): Promise<void> {
    if (!this.novaMensagemChat.trim()) return;

    try {
      const user = this.authService.getUser();
      if (!user) return;
      const token = this.authService.getToken();

      const response = await fetch(`/api/chat/cliente?pedidoId=${this.pedidoChat.id}&clienteId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ mensagem: this.novaMensagemChat })
      });

      if (response.ok) {
        this.novaMensagemChat = '';
        await this.carregarMensagensChat(this.pedidoChat.id);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  }

async verificarAtendimento(pedidoId: number): Promise<void> {
  try {
    const token = this.authService.getToken();
    const response = await fetch(`/api/chat/admin/${pedidoId}/atendimento-ativo`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    if (response.ok) {
      const data = await response.json();
      const novoStatus = data.ativo;
      const statusAnterior = this.ultimoStatusPorPedido.get(pedidoId);

      if (statusAnterior !== undefined && statusAnterior !== novoStatus) {
        if (!novoStatus) {
          this.messageService.add({
            severity: 'info',
            summary: 'Atendimento encerrado',
            detail: 'O vendedor encerrou o atendimento'
          });
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'Atendimento reativado',
            detail: 'Reativado a conversa'
          });
        }
      }

      this.ultimoStatusPorPedido.set(pedidoId, novoStatus);
      this.chatAtivo = novoStatus;
    }
  } catch (error) {
    console.error('Erro ao verificar atendimento:', error);
  }
}
  encerrarAtendimento(): void {
    this.displayConfirmarEncerrar = true;
  }

  async confirmarEncerrarAtendimento(): Promise<void> {
    this.displayConfirmarEncerrar = false;

    if (!this.pedidoChat || !this.pedidoChat.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Pedido não identificado'
      });
      return;
    }

    try {
      const token = this.authService.getToken();
      const response = await fetch(`/api/chat/cliente/${this.pedidoChat.id}/encerrar`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      if (response.ok) {
        this.chatAtivo = false;
        this.ultimoStatusPorPedido.set(this.pedidoChat.id, false);
        this.messageService.add({
          severity: 'success',
          summary: 'Atendimento encerrado',
          detail: 'O atendimento foi encerrado com sucesso'
        });
      } else {
        const error = await response.json();
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.mensagem || 'Erro ao encerrar atendimento'
        });
      }
    } catch (error) {
      console.error('Erro ao encerrar atendimento:', error);
    }
  }

  cancelarEncerrar(): void {
    this.displayConfirmarEncerrar = false;
  }

async reativarAtendimento(): Promise<void> {
  if (!this.pedidoChat || !this.pedidoChat.id) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Pedido não identificado'
    });
    return;
  }

  try {
    const token = this.authService.getToken();
    const response = await fetch(`/api/chat/cliente/${this.pedidoChat.id}/reativar`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    if (response.ok) {
      this.chatAtivo = true;
      this.ultimoStatusPorPedido.set(this.pedidoChat.id, true);
      this.messageService.add({
        severity: 'success',
        summary: 'Atendimento reativado',
        detail: 'A conversa foi reaberta com sucesso'
      });
      await this.carregarMensagensChat(this.pedidoChat.id);
    } else {
      const error = await response.json();
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.mensagem || 'Erro ao reativar atendimento'
      });
    }
  } catch (error) {
    console.error('Erro ao reativar atendimento:', error);
  }
}
}

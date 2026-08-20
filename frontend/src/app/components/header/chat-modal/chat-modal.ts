import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth';
import { ChatService } from '../../../services/chat.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-modal.html',
  styleUrls: ['./chat-modal.css']
})
export class ChatModalComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() abrirChat = new EventEmitter<{pedidoId: number, pedido: any}>();

  chatsTabAtivo: string = 'ativos';
  chatsAtivos: any[] = [];
  chatsEncerrados: any[] = [];
  loadingChats: boolean = false;
  totalChatsNaoLidas: number = 0;

  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  ngOnChanges(): void {
    if (this.visible) {
      this.loadingChats = true;
      this.carregarChats();
    }
  }

  fechar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  async carregarChats(): Promise<void> {
    const user = this.authService.getUser();
    if (!user) {
      this.loadingChats = false;
      return;
    }

    try {
      const token = this.authService.getToken();
      const response = await fetch(`${environment.apiUrl}/chat/cliente/${user.id}/conversas`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.chatsAtivos = data.ativos || [];
        this.chatsEncerrados = data.encerrados || [];
        this.totalChatsNaoLidas = this.chatsAtivos.reduce((sum: number, chat: any) => sum + (chat.naoLidas || 0), 0);
      }
    } catch (error) {
      console.error('Erro ao carregar chats:', error);
    } finally {
      this.loadingChats = false;
    }
  }

  selecionarChat(pedidoId: number): void {
    this.chatService.limparUltimoPedido();

    const pedido = this.chatsAtivos.find((c: any) => c.pedidoId === pedidoId) ||
                   this.chatsEncerrados.find((c: any) => c.pedidoId === pedidoId);

    this.fechar();

    setTimeout(() => {
      this.chatService.abrirChat(pedidoId, pedido);
    }, 100);
  }
}

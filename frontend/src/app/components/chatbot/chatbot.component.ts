import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="chatbot-container" [class.minimized]="minimized" *ngIf="isLoggedIn">
      <div class="chatbot-header" (click)="toggleChat()">
        <i class="pi pi-android"></i>
        <span>Robo Bibliotecario</span>
        <i class="pi" [class.pi-chevron-down]="minimized" [class.pi-chevron-up]="!minimized"></i>
      </div>
      <div class="chatbot-body" #chatBody>
        <div class="chat-messages" #chatMessages>
          <div *ngFor="let msg of mensagens" class="message" [class.user]="msg.user">
            <i class="pi" [class.pi-android]="!msg.user" [class.pi-user]="msg.user"></i>
            <div class="message-content" [innerHTML]="msg.texto"></div>
          </div>
          <div *ngIf="carregando" class="message bot">
            <i class="pi pi-android"></i>
            <div class="message-content">
              <span class="loading-dots">● ● ●</span>
            </div>
          </div>
        </div>
        <div class="sugestoes-container" *ngIf="!carregando && mensagens.length > 0">
          <button *ngFor="let sug of sugestoes" class="sugestao-btn" (click)="enviarSugestao(sug)">
            <i class="pi" [class.pi-book]="sug.includes('Recomendar')"
               [class.pi-history]="sug.includes('Historico')"
               [class.pi-info-circle]="sug.includes('Ajuda')"
               ></i>
            {{ sug }}
          </button>
        </div>
        <div class="chat-input-area">
          <input
            type="text"
            [(ngModel)]="novaMensagem"
            placeholder="Digite sua mensagem..."
            (keyup.enter)="enviarMensagem()"
            [disabled]="carregando">
          <button (click)="enviarMensagem()" [disabled]="carregando || !novaMensagem.trim()">
            <i class="pi pi-send"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chatbot-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: auto;
      background: transparent;
      border-radius: 0;
      box-shadow: none;
      z-index: 1000;
      overflow: visible;
      transition: all 0.3s ease;
    }

    .chatbot-container .chatbot-header {
      background: #d35400;
      color: white;
      padding: 15px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      font-weight: 600;
      border-radius: 50%;
      width: 55px;
      height: 55px;
      box-shadow: 0 10px 30px -12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    }

    .chatbot-container .chatbot-header span,
    .chatbot-container .chatbot-header i:last-child {
      display: none;
    }

    .chatbot-container .chatbot-header i:first-child {
      font-size: 1.5rem;
      margin: 0;
    }

    .chatbot-container .chatbot-body {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 350px;
      background: white;
      border-radius: 0 0 20px 20px;
      box-shadow: 0 10px 30px -12px rgba(0,0,0,0.15);
      overflow: hidden;
      transition: all 0.3s ease;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      display: flex;
      flex-direction: column;
      max-height: 500px;
    }

    .chatbot-container.minimized .chatbot-body {
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
    }

    .chatbot-container:not(.minimized) {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .chatbot-container:not(.minimized) .chatbot-body {
      position: relative;
      bottom: 0;
      right: 0;
      margin-top: 0;
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .chatbot-container:not(.minimized) .chatbot-header {
      width: 100%;
      border-radius: 20px 20px 0 0;
      justify-content: space-between;
      padding: 15px 20px;
    }

    .chatbot-container:not(.minimized) .chatbot-header span {
      display: inline;
    }

    .chatbot-container:not(.minimized) .chatbot-header i:last-child {
      display: inline;
    }

    .chatbot-container:not(.minimized) .chatbot-header i:first-child {
      font-size: 1.2rem;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8f9fa;
      max-height: 300px;
    }

    .message {
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }

    .message.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message.user .message-content {
      background: #e67e22;
      color: white;
    }

    .message.bot .message-content {
      background: white;
      color: #2c3e50;
      border: 1px solid #e9ecef;
    }

    .message i {
      width: 30px;
      height: 30px;
      background: #2c3e50;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      flex-shrink: 0;
    }

    .message.user i {
      background: #e67e22;
    }

    .message-content {
      padding: 10px 15px;
      border-radius: 18px;
      font-size: 0.85rem;
      line-height: 1.4;
      max-width: 80%;
      word-wrap: break-word;
    }

    .sugestoes-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 8px 12px 12px 12px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }

    .sugestao-btn {
      background: white;
      border: 1px solid #e67e22;
      color: #e67e22;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.3s;
      font-family: 'Inter', sans-serif;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .sugestao-btn i {
      font-size: 0.7rem;
    }

    .sugestao-btn:hover {
      background: #e67e22;
      color: white;
      transform: scale(1.05);
    }

    .sugestao-btn:active {
      transform: scale(0.95);
    }

    .chat-input-area {
      display: flex;
      padding: 12px;
      background: white;
      border-top: 1px solid #e9ecef;
      gap: 8px;
    }

    .chat-input-area input {
      flex: 1;
      padding: 10px 15px;
      border: 1px solid #e9ecef;
      border-radius: 25px;
      font-family: 'Inter', sans-serif;
      outline: none;
      font-size: 0.85rem;
    }

    .chat-input-area input:focus {
      border-color: #e67e22;
    }

    .chat-input-area button {
      background: #e67e22;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      color: white;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-input-area button:hover:not(:disabled) {
      background: #d35400;
      transform: scale(1.05);
    }

    .chat-input-area button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .loading-dots {
      display: inline-block;
      animation: pulse 1.2s infinite;
    }

    .loading-dots span {
      display: inline-block;
      animation: dot 1.4s infinite;
      margin: 0 2px;
    }

    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes dot {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.3; }
      40% { transform: scale(1.2); opacity: 1; }
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }

    @media (max-width: 768px) {
      .chatbot-container:not(.minimized) .chatbot-body {
        width: 300px;
      }
      .chat-messages {
        max-height: 280px;
      }
    }

    @media (max-width: 480px) {
      .chatbot-container {
        right: 10px;
        bottom: 10px;
      }
      .chatbot-container:not(.minimized) .chatbot-body {
        width: 280px;
      }
      .chat-messages {
        max-height: 220px;
      }
    }
  `]
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @ViewChild('chatMessages') chatMessages!: ElementRef;

  minimized: boolean = true;
  isLoggedIn: boolean = false;
  mensagens: any[] = [];
  novaMensagem: string = '';
  carregando: boolean = false;
  pedidosChat: any[] = [];
  private intervalId: any = null;

  sugestoes: string[] = [
    'Recomendar livros',
    'Meu historico',
    'Ver historico completo',
    'Ajuda'
  ];

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.loginStatus$.subscribe(logado => {
      this.isLoggedIn = logado;
      if (logado) {
        this.carregarPedidos();
        this.mensagens = [{
          user: false,
          texto: 'Ola! Eu sou seu assistente de livros.<br>Posso:<br>- Recomendar livros<br>- Mostrar seu historico de compras<br><br>Como posso ajudar voce?'
        }];
      }
    });

    const user = this.authService.getUser();
    if (user) {
      this.isLoggedIn = true;
      this.carregarPedidos();
      this.mensagens = [{
        user: false,
        texto: 'Ola! Eu sou seu assistente de livros.<br>Posso:<br>- Recomendar livros<br>- Mostrar seu historico de compras<br><br>Como posso ajudar voce?'
      }];
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  toggleChat(): void {
    this.minimized = !this.minimized;
    if (!this.minimized) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  async enviarSugestao(sugestao: string): Promise<void> {
    if (this.carregando) return;
    this.novaMensagem = sugestao;
    await this.enviarMensagem();
  }

  async carregarPedidos(): Promise<void> {
    const user = this.authService.getUser();
    if (!user) return;

    try {
      const token = this.authService.getToken();
      const response = await fetch(`/api/pedidos?clienteId=${user.id}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      if (response.ok) {
        const todosPedidos = await response.json();
        this.pedidosChat = todosPedidos.filter((p: any) => p.status !== 'CANCELADO');
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    }
  }

  scrollToBottom(): void {
    if (this.chatMessages) {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    }
  }

  async enviarMensagem(): Promise<void> {
    if (!this.novaMensagem.trim() || this.carregando) return;

    const mensagem = this.novaMensagem.trim();
    this.novaMensagem = '';

    this.mensagens.push({ user: true, texto: mensagem });
    this.scrollToBottom();

    this.carregando = true;

    try {
      const resposta = await this.processarComGemini(mensagem);
      this.mensagens.push({ user: false, texto: resposta });
    } catch (error) {
      this.mensagens.push({
        user: false,
        texto: 'Desculpe, estou com problemas de conexao. Tente novamente em alguns instantes.'
      });
    } finally {
      this.carregando = false;
      this.scrollToBottom();
    }
  }

  async processarComGemini(mensagem: string): Promise<string> {
    const cliente = this.authService.getUser();
    if (!cliente) {
      return 'Voce precisa estar logado para usar este assistente.';
    }

    if (this.pedidosChat.length === 0) {
      await this.carregarPedidos();
    }

    const contexto = this.construirContexto(cliente);
    const prompt = `${contexto}

Pergunta do usuario: "${mensagem}"

REGRAS:
1. Responda em portugues brasileiro
2. Formate com <br> para quebras de linha
3. Seja amigavel e educado
4. Foque em livros, recomendacoes e historico

Resposta:`;

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (response.ok) {
        const data = await response.json();
        return data.resposta || this.fallbackResponse(mensagem);
      }
      return this.fallbackResponse(mensagem);
    } catch (error) {
      console.error('Erro no chatbot:', error);
      return this.fallbackResponse(mensagem);
    }
  }

  construirContexto(cliente: any): string {
    let contexto = `Voce e um assistente especializado em livros chamado "LivroIA".
Usuario: ${cliente.nome}

Historico de compras do usuario:`;

    const pedidosValidos = this.pedidosChat.filter((p: any) => p.status !== 'CANCELADO');

    if (pedidosValidos.length === 0) {
      contexto += `\n- Nenhum pedido realizado ainda.`;
    } else {
      pedidosValidos.slice(-10).forEach((pedido: any) => {
        contexto += `\nPedido #${pedido.id} (${new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}) - Status: ${pedido.status}:`;
        pedido.itens.forEach((item: any) => {
          contexto += `\n  - ${item.livro?.titulo} (Autor: ${item.livro?.autor || 'N/A'}, Categoria: ${item.livro?.categoria || 'N/A'})`;
        });
      });
    }

    contexto += `\n\nVoce tem acesso a informacoes sobre livros, autores e categorias.`;

    return contexto;
  }

  fallbackResponse(mensagem: string): string {
    const msg = mensagem.toLowerCase();

    if (msg.includes('oi') || msg.includes('ola') || msg.includes('bom dia') || msg.includes('boa tarde') || msg.includes('boa noite')) {
      return 'Ola! Tudo bem? Como posso ajudar voce com livros hoje?';
    }

    if (msg.includes('historico') || msg.includes('compras') || msg.includes('pedidos')) {
      if (msg.includes('completo') || msg.includes('tudo') || msg.includes('todos')) {
        return this.mostrarHistoricoCompleto();
      }
      return this.mostrarHistorico();
    }

    if (msg.includes('recomenda') || msg.includes('sugere') || msg.includes('indicar') || msg.includes('livro')) {
      return this.mostrarRecomendacoes();
    }

    if (msg.includes('ajuda')) {
      return 'Comandos disponiveis:<br><br>• "ola" - Cumprimentar<br>• "meu historico" - Ver ultimas compras<br>• "historico completo" - Ver todas as compras<br>• "recomendar livros" - Sugestoes para voce<br> O que gostaria de saber?';
    }

    return 'Desculpe, nao entendi. Digite "ajuda" para ver os comandos disponiveis.';
  }

  mostrarHistorico(): string {
    const pedidosValidos = this.pedidosChat.filter((p: any) => p.status !== 'CANCELADO');

    if (pedidosValidos.length === 0) {
      return 'Voce ainda nao tem nenhum pedido. Explore nosso catalogo e faca sua primeira compra!';
    }

    const ultimosPedidos = pedidosValidos.slice(-5);
    let html = 'Seus ultimos pedidos:<br><br>';

    ultimosPedidos.forEach((pedido: any) => {
      const data = new Date(pedido.dataPedido).toLocaleDateString('pt-BR');
      html += `<strong>Pedido #${pedido.id}</strong> - ${data}<br>`;
      pedido.itens.forEach((item: any) => {
        html += `&nbsp;&nbsp;${item.livro?.titulo} (x${item.quantidade})<br>`;
      });
      html += `<strong>Total:</strong> R$ ${pedido.valorTotal?.toFixed(2)}<br><br>`;
    });

    return html;
  }

  mostrarHistoricoCompleto(): string {
    const pedidosValidos = this.pedidosChat.filter((p: any) => p.status !== 'CANCELADO');

    if (pedidosValidos.length === 0) {
      return 'Voce ainda nao tem nenhum pedido.';
    }

    let html = 'Historico completo de compras:<br><br>';

    pedidosValidos.forEach((pedido: any) => {
      const data = new Date(pedido.dataPedido).toLocaleDateString('pt-BR');
      html += `<strong>Pedido #${pedido.id}</strong> - ${data}<br>`;
      pedido.itens.forEach((item: any) => {
        html += `&nbsp;&nbsp;${item.livro?.titulo} (x${item.quantidade}) - R$ ${(item.precoUnitario * item.quantidade).toFixed(2)}<br>`;
      });
      html += `<strong>Total:</strong> R$ ${pedido.valorTotal?.toFixed(2)}<br>`;
      html += `<strong>Status:</strong> ${pedido.status}<br><br>`;
    });

    return html;
  }

  mostrarRecomendacoes(): string {
    const pedidosValidos = this.pedidosChat.filter((p: any) => p.status !== 'CANCELADO');

    if (pedidosValidos.length === 0) {
      return 'Faca sua primeira compra para eu poder recomendar livros baseado no seu gosto!';
    }

    const categorias: any = {};
    pedidosValidos.forEach((pedido: any) => {
      pedido.itens.forEach((item: any) => {
        if (item.livro && item.livro.categoria) {
          categorias[item.livro.categoria] = (categorias[item.livro.categoria] || 0) + 1;
        }
      });
    });

    const categoriaFavorita = Object.keys(categorias).reduce((a, b) => categorias[a] > categorias[b] ? a : b, 'Romance');

    const recomendacoes: any = {
      'Romance': ['Orgulho e Preconceito - Jane Austen', 'O Morro dos Ventos Uivantes - Emily Bronte', 'Jane Eyre - Charlotte Bronte'],
      'Terror': ['O Iluminado - Stephen King', 'Dracula - Bram Stoker', 'Frankenstein - Mary Shelley'],
      'Ficcao Cientifica': ['Duna - Frank Herbert', 'Fundacao - Isaac Asimov', '1984 - George Orwell'],
      'Fantasia': ['Harry Potter e a Pedra Filosofal', 'O Senhor dos Aneis - J.R.R. Tolkien', 'As Cronicas de Narnia - C.S. Lewis']
    };

    const sugestoes = recomendacoes[categoriaFavorita] || recomendacoes['Romance'];

    return `Baseado nas suas compras, sua categoria favorita e <strong>${categoriaFavorita}</strong>.<br><br>Recomendacoes para voce:<br>${sugestoes.join('<br>')}`;
  }

}

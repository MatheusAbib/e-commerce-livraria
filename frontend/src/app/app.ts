import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event as RouterEvent } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { AdminModalsComponent } from './components/admin-modals/admin-modals';
import { AuthService } from './services/auth';
import { ChatService } from './services/chat.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { GlobalChatComponent } from "./app/global-chat.component";
import { ChatbotComponent } from "./components/chatbot/chatbot.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    AdminModalsComponent,
    ToastModule,
    GlobalChatComponent,
    ChatbotComponent
  ],
  providers: [MessageService],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  private intervalId: any = null;
  private pedidosAnteriores: any[] = [];
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    private messageService: MessageService,
    private chatService: ChatService
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      }

      if (event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError) {
        setTimeout(() => {
          this.loading = false;
        }, 1000);
      }
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.isLoggedIn = true;
      this.isAdmin = user.perfil === 'ADMIN';
      const currentUrl = this.router.url;
      if (user.perfil === 'ADMIN' && !currentUrl.includes('/admin')) {
        this.router.navigate(['/admin/dashboard']);
      }
    }

    this.authService.loginStatus$.subscribe(logado => {
      this.isLoggedIn = logado;
      if (logado) {
        const user = this.authService.getUser();
        this.isAdmin = user?.perfil === 'ADMIN';
        if (user?.perfil === 'ADMIN') {
          this.loading = true;
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
            setTimeout(() => {
              this.loading = false;
            }, 2000);
          }, 300);
        }
        this.iniciarPolling();
      } else {
        this.isAdmin = false;
        this.pararPolling();
        this.pedidosAnteriores = [];
      }
    });

    this.authService.abrirChat$.subscribe((pedidoId: number) => {
      const pedido = this.pedidosAnteriores.find(p => p.id === pedidoId);
      this.chatService.limparUltimoPedido();
      setTimeout(() => {
        this.chatService.abrirChat(pedidoId, pedido || null);
      }, 50);
    });
  }

  ngOnDestroy(): void {
    this.pararPolling();
  }

  iniciarPolling(): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.verificarPedidos();
    }, 3000);
  }

  pararPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async verificarPedidos(): Promise<void> {
    try {
      const user = this.authService.getUser();
      if (!user) return;

      const token = this.authService.getToken();
      const response = await fetch(`/api/pedidos?clienteId=${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        const pedidos = await response.json();

        for (const pedido of pedidos) {
          const pedidoAntigo = this.pedidosAnteriores.find(p => p.id === pedido.id);
          if (pedidoAntigo && pedidoAntigo.status !== pedido.status) {
            const mensagem = this.getMensagemStatus(pedido);
            const titulo = this.getTituloStatus(pedido.status);

            this.authService.adicionarNotificacao(titulo, mensagem, 'info');

            this.messageService.add({
              severity: 'info',
              summary: titulo,
              detail: mensagem
            });

            if (pedido.status === 'DEVOLVIDO') {
              setTimeout(async () => {
                const cupomResponse = await fetch(`/api/cupons/cliente/${user.id}/disponiveis`, {
                  headers: {
                    'Authorization': 'Bearer ' + token
                  }
                });
                if (cupomResponse.ok) {
                  const cupons = await cupomResponse.json();
                  const cupomNovo = cupons.find((c: any) => c.pedidoId === pedido.id);
                  if (cupomNovo) {
                    const mensagemCupom = `Cupom ${cupomNovo.codigo} de ${cupomNovo.porcentagem}% de desconto disponível!`;
                    this.authService.adicionarNotificacao('Novo Cupom!', mensagemCupom, 'success');
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Novo Cupom!',
                      detail: mensagemCupom
                    });
                  }
                }
              }, 1000);
            }
          }
        }

        this.pedidosAnteriores = pedidos;
      }
    } catch (error) {
      console.error('Erro ao verificar pedidos:', error);
    }
  }

  private getTituloStatus(status: string): string {
    const titulos: any = {
      'EM_PROCESSAMENTO': 'Pedido Confirmado',
      'EM_TRANSITO': 'Pedido Enviado',
      'ENTREGUE': 'Pedido Entregue',
      'DEVOLUCAO': 'Devolução Solicitada',
      'AUTORIZADO_DEVOLUCAO': 'Devolução Autorizada',
      'ENVIADO_DEVOLUCAO': 'Devolução Enviada',
      'DEVOLVIDO': 'Devolução Finalizada',
      'CANCELADO': 'Pedido Cancelado'
    };
    return titulos[status] || 'Pedido Atualizado';
  }

  private getMensagemStatus(pedido: any): string {
    const status = pedido.status;
    const id = pedido.id;

    switch (status) {
      case 'EM_PROCESSAMENTO':
        return `Pedido #${id} confirmado. Estamos preparando seu pedido para envio.`;
      case 'EM_TRANSITO':
        return `Pedido #${id} foi enviado. Rastreie o pedido com o código enviado.`;
      case 'ENTREGUE':
        return `Pedido #${id} foi entregue com sucesso.`;
      case 'DEVOLUCAO':
        return `Devolução do pedido #${id} solicitada. Aguarde a análise do vendedor.`;
      case 'AUTORIZADO_DEVOLUCAO':
        return `Devolução do pedido #${id} autorizada. Envie o pacote conforme as instruções.`;
      case 'ENVIADO_DEVOLUCAO':
        return `Devolução do pedido #${id} enviada. Aguarde a confirmação do recebimento.`;
      case 'DEVOLVIDO':
        return `Devolução do pedido #${id} finalizada. O reembolso será processado em breve.`;
      case 'CANCELADO':
        return `Pedido #${id} foi cancelado com sucesso.`;
      default:
        return `Pedido #${id} foi atualizado.`;
    }
  }

  private getStatusLabel(status: string): string {
    const labels: any = {
      'EM_PROCESSAMENTO': 'Em Processamento',
      'EM_TRANSITO': 'Em Trânsito',
      'ENTREGUE': 'Entregue',
      'DEVOLUCAO': 'Devolução Solicitada',
      'AUTORIZADO_DEVOLUCAO': 'Devolução Autorizada',
      'ENVIADO_DEVOLUCAO': 'Devolução Enviada',
      'DEVOLVIDO': 'Devolvido',
      'CANCELADO': 'Cancelado'
    };
    return labels[status] || status;
  }

  showLoader(): void {
    this.loading = true;
  }

  hideLoader(): void {
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    try {
      const target = event.target as HTMLInputElement;
      if (target && target.value && target.value.length > 1000) {
        target.value = target.value.slice(0, 1000);
      }
    } catch (e) {
      console.warn('Input error suppressed');
    }
  }

  @HostListener('error', ['$event'])
  onError(event: ErrorEvent): void {
    event.preventDefault();
    console.warn('Error suppressed:', event.message);
  }

  @HostListener('window:error', ['$event'])
  onWindowError(event: ErrorEvent): void {
    event.preventDefault();
    console.warn('Window error suppressed:', event.message);
  }
}

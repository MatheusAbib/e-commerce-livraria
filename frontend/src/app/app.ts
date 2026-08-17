import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event as RouterEvent } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';
import { AdminModalsComponent } from './components/admin-modals/admin-modals';
import { AuthService } from './services/auth';
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
    private messageService: MessageService
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
            const statusLabel = this.getStatusLabel(pedido.status);
            this.authService.adicionarNotificacao(
              'Pedido Atualizado',
              `Pedido #${pedido.id} agora esta ${statusLabel}`,
              'info'
            );
            this.messageService.add({
              severity: 'info',
              summary: 'Pedido Atualizado',
              detail: `Pedido #${pedido.id} esta agora: ${statusLabel}`
            });
          }
        }

        this.pedidosAnteriores = pedidos;
      }
    } catch (error) {
      console.error('Erro ao verificar pedidos:', error);
    }
  }

  private getStatusLabel(status: string): string {
    const labels: any = {
      'EM_PROCESSAMENTO': 'Em Processamento',
      'EM_TRANSITO': 'Em Transito',
      'ENTREGUE': 'Entregue',
      'DEVOLUCAO': 'Devolucao',
      'DEVOLVIDO': 'Devolvido',
      'TROCADO': 'Trocado',
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

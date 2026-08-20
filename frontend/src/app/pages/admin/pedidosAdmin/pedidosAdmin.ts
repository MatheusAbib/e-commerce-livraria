import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar';
import { AdminModalsComponent } from '../../../components/admin-modals/admin-modals';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    PaginatorModule,
    AdminSidebarComponent,
    AdminModalsComponent
  ],
  providers: [MessageService],
  templateUrl: './pedidosAdmin.html',
  styleUrls: ['./pedidosAdmin.css', '../admin-common.css']
})
export class PedidosAdminComponent implements OnInit, OnDestroy {
  @ViewChild(AdminModalsComponent) adminModals!: AdminModalsComponent;

  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  pedidosPaginados: any[] = [];
  loading: boolean = true;
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;

  chatAdminAberto: boolean = false;
  chatAdminPedido: any = null;
  mensagensChatAdmin: any[] = [];
  novaMensagemChatAdmin: string = '';
  chatAdminAtivo: boolean = true;
  chatAdminInterval: any = null;

  tabAtivo: string = 'todos';

  filtros = {
    status: '',
    cliente: ''
  };

  statusMap: any = {
    'todos': '',
    'processamento': 'EM_PROCESSAMENTO',
    'transito': 'EM_TRANSITO',
    'entregues': 'ENTREGUE',
    'devolucao': 'DEVOLUCAO',
    'autorizado': 'AUTORIZADO_DEVOLUCAO',
    'enviado': 'ENVIADO_DEVOLUCAO',
    'devolvidos': 'DEVOLVIDO',
    'cancelados': 'CANCELADO'
  };

  pedidoSelecionado: any = null;
  private intervalId: any = null;

  constructor(
    private messageService: MessageService,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarPedidos();
    this.intervalId = setInterval(() => {
      this.carregarPedidosSilenciosamente();
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.chatAdminInterval) {
      clearInterval(this.chatAdminInterval);
      this.chatAdminInterval = null;
    }
  }

  abrirChatAdmin(pedido: any): void {
    this.router.navigate(['/admin/chats'], { queryParams: { pedidoId: pedido.id } });
  }

  fecharChatAdmin(): void {
    this.chatAdminAberto = false;
    this.chatAdminPedido = null;
    this.mensagensChatAdmin = [];
    if (this.chatAdminInterval) {
      clearInterval(this.chatAdminInterval);
      this.chatAdminInterval = null;
    }
  }

  async carregarMensagensChatAdmin(pedidoId: number): Promise<void> {
    try {
      const token = this.authService.getToken();
      const response = await fetch(`${environment.apiUrl}/chat/admin/${pedidoId}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        this.mensagensChatAdmin = await response.json();
        this.scrollChatAdminParaBaixo();

        await fetch(`${environment.apiUrl}/chat/admin/${pedidoId}/ler`, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  }

  async carregarMensagensChatAdminSilenciosamente(pedidoId: number): Promise<void> {
    try {
      const token = this.authService.getToken();
      const response = await fetch(`${environment.apiUrl}/chat/admin/${pedidoId}`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        const novasMensagens = await response.json();
        if (JSON.stringify(novasMensagens) !== JSON.stringify(this.mensagensChatAdmin)) {
          this.mensagensChatAdmin = novasMensagens;
          this.scrollChatAdminParaBaixo();

          await fetch(`${environment.apiUrl}/chat/admin/${pedidoId}/ler`, {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  }

  scrollChatAdminParaBaixo(): void {
    setTimeout(() => {
      const container = document.querySelector('.chat-messages-admin');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  async enviarMensagemChatAdmin(): Promise<void> {
    if (!this.novaMensagemChatAdmin.trim() || !this.chatAdminPedido) return;

    try {
      const token = this.authService.getToken();
      const response = await fetch(`${environment.apiUrl}/chat/admin?pedidoId=${this.chatAdminPedido.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ mensagem: this.novaMensagemChatAdmin })
      });

      if (response.ok) {
        this.novaMensagemChatAdmin = '';
        await this.carregarMensagensChatAdmin(this.chatAdminPedido.id);
      } else {
        const error = await response.json();
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.mensagem || 'Erro ao enviar mensagem'
        });
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  }

  async verificarAtendimentoAdmin(pedidoId: number): Promise<void> {
    try {
      const token = this.authService.getToken();
      const response = await fetch(`${environment.apiUrl}/chat/admin/${pedidoId}/atendimento-ativo`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.chatAdminAtivo = data.ativo;
      }
    } catch (error) {
      console.error('Erro ao verificar atendimento:', error);
    }
  }

  async encerrarAtendimentoAdmin(): Promise<void> {
    if (!this.chatAdminPedido) return;

    try {
      const token = this.authService.getToken();
      const response = await fetch(`${environment.apiUrl}/chat/admin/${this.chatAdminPedido.id}/encerrar`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        this.chatAdminAtivo = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Atendimento encerrado',
          detail: 'O atendimento foi encerrado com sucesso'
        });
        await this.carregarMensagensChatAdmin(this.chatAdminPedido.id);
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



  async carregarPedidosSilenciosamente(): Promise<void> {
    try {
      const token = this.authService.getToken();
      const response = await fetch(`${environment.apiUrl}/pedidos/todos`, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      if (response.ok) {
        const novosPedidos = await response.json();

        for (const pedido of novosPedidos) {
          const mensagensResponse = await fetch(`/api/chat/admin/${pedido.id}`, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          if (mensagensResponse.ok) {
            const mensagens = await mensagensResponse.json();
            pedido.temConversa = mensagens.length > 0;
          }

          const naoLidasResponse = await fetch(`/api/chat/admin/${pedido.id}/nao-lidas`, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          if (naoLidasResponse.ok) {
            const data = await naoLidasResponse.json();
            pedido.chatNaoLidas = data.naoLidas || 0;
          }
        }

        const pedidosAtuaisStr = JSON.stringify(this.pedidos.map((p: any) => ({
          id: p.id,
          status: p.status,
          temConversa: p.temConversa,
          chatNaoLidas: p.chatNaoLidas
        })));
        const novosPedidosStr = JSON.stringify(novosPedidos.map((p: any) => ({
          id: p.id,
          status: p.status,
          temConversa: p.temConversa,
          chatNaoLidas: p.chatNaoLidas
        })));

        if (pedidosAtuaisStr !== novosPedidosStr) {
          this.pedidos = novosPedidos;
          this.aplicarFiltrosSemLoading();
          this.cdr.detectChanges();
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar pedidos:', error);
    }
  }

  aplicarFiltrosSemLoading(): void {
    this.pedidosFiltrados = this.pedidos.filter(pedido => {
      let match = true;
      if (this.filtros.status && pedido.status !== this.filtros.status) match = false;
      if (this.filtros.cliente) {
        const nomeCliente = pedido.cliente?.nome || '';
        if (!nomeCliente.toLowerCase().includes(this.filtros.cliente.toLowerCase())) match = false;
      }
      return match;
    });
    this.totalRecords = this.pedidosFiltrados.length;
    this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    this.pedidosPaginados = this.pedidosFiltrados.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.atualizarPaginacao();
  }

  trocarTab(tab: string): void {
    this.tabAtivo = tab;
    this.filtros.status = this.statusMap[tab] || '';
    this.aplicarFiltros();
  }

  filtrando: boolean = false;

aplicarFiltros(): void {
  this.filtrando = true;
  this.loading = true;
  this.cdr.detectChanges();

  const inicio = Date.now();

  this.pedidosFiltrados = this.pedidos.filter(pedido => {
    let match = true;
    if (this.filtros.status && pedido.status !== this.filtros.status) match = false;
    if (this.filtros.cliente) {
      const nomeCliente = pedido.cliente?.nome || '';
      if (!nomeCliente.toLowerCase().includes(this.filtros.cliente.toLowerCase())) match = false;
    }
    return match;
  });

  this.totalRecords = this.pedidosFiltrados.length;
  this.first = 0;
  this.atualizarPaginacao();

  const decorrido = Date.now() - inicio;
  const restante = Math.max(0, 500 - decorrido);

  setTimeout(() => {
    this.loading = false;
    this.filtrando = false;
    this.cdr.detectChanges();
  }, restante);
}

limparFiltros(): void {
  this.filtrando = true;
  this.loading = true;
  this.cdr.detectChanges();

  const inicio = Date.now();

  this.filtros = { status: '', cliente: '' };
  this.tabAtivo = 'todos';
  this.pedidosFiltrados = [...this.pedidos];
  this.totalRecords = this.pedidosFiltrados.length;
  this.first = 0;
  this.atualizarPaginacao();

  const decorrido = Date.now() - inicio;
  const restante = Math.max(0, 500 - decorrido);

  setTimeout(() => {
    this.loading = false;
    this.filtrando = false;
    this.cdr.detectChanges();
  }, restante);
}

async carregarPedidos(): Promise<void> {
  this.loading = true;
  this.cdr.detectChanges();
  try {
    const token = this.authService.getToken();
    const response = await fetch(`${environment.apiUrl}/pedidos/todos`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (response.ok) {
      this.pedidos = await response.json();

      await Promise.all(this.pedidos.map(async (pedido) => {
        const [mensagensResponse, naoLidasResponse] = await Promise.all([
          fetch(`/api/chat/admin/${pedido.id}`, {
            headers: { 'Authorization': 'Bearer ' + token }
          }),
          fetch(`/api/chat/admin/${pedido.id}/nao-lidas`, {
            headers: { 'Authorization': 'Bearer ' + token }
          })
        ]);

        if (mensagensResponse.ok) {
          const mensagens = await mensagensResponse.json();
          pedido.temConversa = mensagens.length > 0;
        }

        if (naoLidasResponse.ok) {
          const data = await naoLidasResponse.json();
          pedido.chatNaoLidas = data.naoLidas || 0;
        }
      }));

      this.aplicarFiltrosSemLoading();
    }
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao carregar pedidos'});
  } finally {
    this.loading = false;
    this.cdr.detectChanges();
  }
}
  abrirDetalhes(pedido: any): void {
    this.pedidoSelecionado = pedido;
    this.adminModals.abrirPedidoDetalhes(pedido);
  }

  abrirStatus(pedido: any, status: string): void {
    this.adminModals.onConfirmarPedidoStatus = (pedidoParam: any, statusParam: string, dadosCupom: any, codigoRastreamento?: string) => {
      this.confirmarStatus(pedidoParam, statusParam, dadosCupom, codigoRastreamento);
    };
    this.adminModals.abrirPedidoStatus(pedido, status);
  }

  async confirmarStatus(pedido: any, status: string, dadosCupom?: any, codigoRastreamento?: string): Promise<void> {
    if (!pedido || !status) return;

    try {
      const token = this.authService.getToken();
      const body: any = { novoStatus: status };

      if (status === 'DEVOLVIDO' && dadosCupom && dadosCupom.gerarCupom) {
        body.cupom = {
          gerarCupom: true,
          porcentagem: dadosCupom.porcentagem
        };
      }

      if (status === 'EM_TRANSITO' && codigoRastreamento) {
        body.codigoRastreamentoEnvio = codigoRastreamento;
      }

      const response = await fetch(`${environment.apiUrl}/pedidos/${pedido.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const pedidoAtualizado = await response.json();
        const index = this.pedidos.findIndex(p => p.id === pedidoAtualizado.id);
        if (index !== -1) {
          this.pedidos[index] = pedidoAtualizado;
        }

        const clienteId = pedido.cliente?.id;
        if (clienteId) {
          let mensagem = `Pedido #${pedido.id} foi atualizado para ${this.getStatusLabel(status)}`;
          if (status === 'DEVOLVIDO' && dadosCupom && dadosCupom.gerarCupom) {
            mensagem += ` e você ganhou um cupom de ${dadosCupom.porcentagem}% de desconto!`;
          }
          if (status === 'EM_TRANSITO' && codigoRastreamento) {
            mensagem += ` Código de rastreamento: ${codigoRastreamento}`;
          }
          this.authService.adicionarNotificacaoParaCliente(
            clienteId,
            'Status do Pedido',
            mensagem,
            'info'
          );
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Status atualizado para: ${this.getStatusLabel(status)}`
        });
        this.aplicarFiltros();
      } else {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao atualizar status'});
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      this.messageService.add({severity:'error', summary:'Erro', detail:'Falha ao atualizar status'});
    }
  }

  abrirExcluir(pedido: any): void {
    this.adminModals.onConfirmarPedidoExcluir = (pedidoParam: any) => {
      this.confirmarExcluir(pedidoParam);
    };
    this.adminModals.abrirPedidoExcluir(pedido);
  }

  async confirmarExcluir(pedido: any): Promise<void> {
    if (!pedido) return;

    try {
      const token = this.authService.getToken();
      const response = await fetch(`${environment.apiUrl}/pedidos/${pedido.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        this.pedidos = this.pedidos.filter(p => p.id !== pedido.id);
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Pedido excluído com sucesso!'});
        this.aplicarFiltros();
      } else {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao excluir pedido'});
      }
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      this.messageService.add({severity:'error', summary:'Erro', detail:'Falha ao excluir pedido'});
    }
  }

  getStatusLabel(status: string): string {
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

  getStatusClass(status: string): string {
    const classes: any = {
      'EM_PROCESSAMENTO': 'status-pendente',
      'EM_TRANSITO': 'status-envio',
      'ENTREGUE': 'status-entregue',
      'DEVOLUCAO': 'status-devolucao',
      'AUTORIZADO_DEVOLUCAO': 'status-devolucao-autorizada',
      'ENVIADO_DEVOLUCAO': 'status-devolucao-enviada',
      'DEVOLVIDO': 'status-devolvido',
      'CANCELADO': 'status-cancelado'
    };
    return classes[status] || 'status-pendente';
  }
}

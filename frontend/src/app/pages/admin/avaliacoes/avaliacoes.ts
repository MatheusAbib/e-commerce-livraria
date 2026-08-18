import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth';
import { AdminSidebarComponent } from "../../../components/admin-sidebar/admin-sidebar";

@Component({
  selector: 'app-admin-avaliacoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    ToastModule,
    PaginatorModule,
    AdminSidebarComponent
],
  providers: [MessageService],
  templateUrl: './avaliacoes.html',
  styleUrls: ['./avaliacoes.css', './../admin-common.css']
})
export class AdminAvaliacoesComponent implements OnInit {
  avaliacoes: any[] = [];
  filteredAvaliacoes: any[] = [];
  loading: boolean = true;
  filtrando: boolean = false;

  filtroLivro: string = '';
  filtroCliente: string = '';
  filtroNota: string = '';

  displayExcluirModal: boolean = false;
  avaliacaoSelecionada: any = null;

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  constructor(
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarAvaliacoes();
  }

  async carregarAvaliacoes(): Promise<void> {
    this.loading = true;
    try {
      const token = this.authService.getToken();
      const response = await fetch('/api/avaliacoes/todas', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        this.avaliacoes = await response.json();
        this.filteredAvaliacoes = [...this.avaliacoes];
        this.totalRecords = this.filteredAvaliacoes.length;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar avaliações'
        });
      }
    } catch (error) {
      console.error('Erro:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar avaliações'
      });
    } finally {
      this.loading = false;
    }
  }

  async aplicarFiltros(): Promise<void> {
    this.filtrando = true;
    await new Promise(resolve => setTimeout(resolve, 1500));

    this.filteredAvaliacoes = this.avaliacoes.filter(a => {
      let match = true;

      if (this.filtroLivro) {
        match = match && a.livro?.titulo?.toLowerCase().includes(this.filtroLivro.toLowerCase());
      }

      if (this.filtroCliente) {
        match = match && a.cliente?.nome?.toLowerCase().includes(this.filtroCliente.toLowerCase());
      }

      if (this.filtroNota) {
        match = match && a.nota === parseInt(this.filtroNota);
      }

      return match;
    });
    this.totalRecords = this.filteredAvaliacoes.length;
    this.first = 0;
    this.filtrando = false;
  }

  async limparFiltros(): Promise<void> {
    this.filtrando = true;
    await new Promise(resolve => setTimeout(resolve, 1500));

    this.filtroLivro = '';
    this.filtroCliente = '';
    this.filtroNota = '';
    this.filteredAvaliacoes = [...this.avaliacoes];
    this.totalRecords = this.filteredAvaliacoes.length;
    this.first = 0;
    this.filtrando = false;
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  get avaliacoesPaginadas(): any[] {
    return this.filteredAvaliacoes.slice(this.first, this.first + this.rows);
  }

  abrirExcluir(avaliacao: any): void {
    this.avaliacaoSelecionada = avaliacao;
    this.displayExcluirModal = true;
  }

async confirmarExcluir(): Promise<void> {
  if (!this.avaliacaoSelecionada) return;

  try {
    const token = this.authService.getToken();
    const response = await fetch(`/api/avaliacoes/${this.avaliacaoSelecionada.id}/remover-comentario`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });

    if (response.ok) {
      const avaliacaoAtualizada = await response.json();

      const index = this.avaliacoes.findIndex(a => a.id === avaliacaoAtualizada.id);
      if (index !== -1) {
        this.avaliacoes[index] = avaliacaoAtualizada;
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Comentário removido com sucesso'
      });

      const user = this.authService.getUser();
      if (user) {
        const notificacoesPorUsuario = JSON.parse(localStorage.getItem('notificacoesPorUsuario') || '{}');
        const notificacoes = notificacoesPorUsuario[user.id] || [];

        notificacoes.push({
          id: Date.now(),
          titulo: 'Comentário Removido',
          mensagem: `Seu comentário sobre o livro "${avaliacaoAtualizada.livro?.titulo || 'Livro'}" foi removido pelo administrador.`,
          tipo: 'warning',
          lida: false,
          data: new Date().toISOString()
        });

        notificacoesPorUsuario[user.id] = notificacoes;
        localStorage.setItem('notificacoesPorUsuario', JSON.stringify(notificacoesPorUsuario));

        this.authService.adicionarNotificacao(
          'Comentário Removido',
          `Seu comentário sobre o livro "${avaliacaoAtualizada.livro?.titulo || 'Livro'}" foi removido pelo administrador.`,
          'warning'
        );
      }

      this.aplicarFiltros();
      this.displayExcluirModal = false;
      this.avaliacaoSelecionada = null;
    } else {
      const error = await response.json();
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.mensagem || 'Erro ao remover comentário'
      });
    }
  } catch (error) {
    console.error('Erro:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao remover comentário'
    });
  }
}

getTipoEstrelaAdmin(nota: number, estrelaIndex: number): string {
  if (!nota) return 'vazia';
  if (nota >= estrelaIndex + 1) {
    return 'cheia';
  } else if (nota > estrelaIndex && nota < estrelaIndex + 1) {
    return 'meia';
  } else {
    return 'vazia';
  }
}

  formatarData(data: string): string {
    if (!data) return '-';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
  }
}

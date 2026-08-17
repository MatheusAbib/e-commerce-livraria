import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { GalleriaModule } from 'primeng/galleria';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { BadgeModule } from 'primeng/badge';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { CarrinhoService } from '../../services/carrinho';
import { AuthService } from '../../services/auth';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    GalleriaModule,
    PaginatorModule,
    DialogModule,
    BadgeModule,
    ProgressSpinnerModule,
    ToastModule,
    TooltipModule
  ],
  providers: [MessageService],
  templateUrl: './principal.html',
  styleUrls: ['./principal.css']
})
export class Principal implements OnInit {
  livros: any[] = [];
  filteredLivros: any[] = [];
  selectedLivro: any = null;
  displayDialog: boolean = false;
  loading: boolean = false;
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 12;
  isLoggedIn: boolean = false;
  favoritosIds: number[] = [];

  comentarios: any[] = [];
  comentariosPaginados: any[] = [];
  comentariosLoading: boolean = false;
  comentariosExpandido: boolean = false;
  comentariosFirst: number = 0;
  comentariosRows: number = 5;
  comentariosTotal: number = 0;

  filtros = {
    titulo: '',
    autor: '',
    editora: '',
    categoria: '',
    precoMax: null
  };

  categorias: any[] = [];
  quantidadeSelecionada: number = 1;
  selectedIsFavorited: boolean = false;

  constructor(
    private messageService: MessageService,
    private carrinhoService: CarrinhoService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarLivros();
    const user = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
    this.isLoggedIn = !!user;

    if (this.isLoggedIn) {
      this.carregarFavoritos();
    }

    this.authService.loginStatus$.subscribe(async logado => {
      this.isLoggedIn = logado;
      if (!logado) {
        this.favoritosIds = [];
        this.selectedIsFavorited = false;
      } else {
        await this.carregarFavoritos();
      }
      this.cdr.detectChanges();
    });

    this.authService.favoritosAtualizados$.subscribe(() => {
      this.carregarFavoritos();
    });

    this.route.queryParams.subscribe(params => {
      const livroId = params['livroId'];
      if (livroId) {
        setTimeout(() => {
          const livro = this.livros.find(l => l.id == livroId);
          if (livro) {
            this.verDetalhes(livro);
            this.router.navigate([], { queryParams: {}, replaceUrl: true });
          }
        }, 500);
      }
    });
  }

  async carregarComentarios(livroId: number): Promise<void> {
  this.comentariosLoading = true;
  try {
    const response = await fetch(`/api/avaliacoes/livro/${livroId}`);
    if (response.ok) {
      this.comentarios = await response.json();
      // Ordena por data (mais recentes primeiro)
      this.comentarios.sort((a, b) =>
        new Date(b.dataAvaliacao).getTime() - new Date(a.dataAvaliacao).getTime()
      );
      this.comentariosTotal = this.comentarios.length;
      this.atualizarComentariosPaginados();
    }
  } catch (error) {
    console.error('Erro ao carregar comentários:', error);
  } finally {
    this.comentariosLoading = false;
  }
}

atualizarComentariosPaginados(): void {
  this.comentariosPaginados = this.comentarios.slice(
    this.comentariosFirst,
    this.comentariosFirst + this.comentariosRows
  );
}

onComentariosPageChange(event: any): void {
  this.comentariosFirst = event.first;
  this.comentariosRows = event.rows;
  this.atualizarComentariosPaginados();
}

toggleComentarios(): void {
  this.comentariosExpandido = !this.comentariosExpandido;
  if (this.comentariosExpandido && this.comentarios.length === 0) {
    this.carregarComentarios(this.selectedLivro.id);
  }
}

formatarDataComentario(data: string): string {
  const date = new Date(data);
  const hoje = new Date();
  const diff = hoje.getTime() - date.getTime();
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (dias === 0) return 'Hoje';
  if (dias === 1) return 'Ontem';
  if (dias < 7) return `${dias} dias atrás`;
  if (dias < 30) return `${Math.floor(dias / 7)} semanas atrás`;
  if (dias < 365) return `${Math.floor(dias / 30)} meses atrás`;
  return `${Math.floor(dias / 365)} anos atrás`;
}

getIniciais(nome: string): string {
  if (!nome) return '?';
  return nome.charAt(0).toUpperCase();
}

  async carregarFavoritos(): Promise<void> {
    const user = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
    if (!user) return;

    try {
      const token = this.authService.getToken();
      const response = await fetch(`http://localhost:8081/api/clientes/${user.id}/favoritos`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      if (response.ok) {
        const favoritos = await response.json();
        this.favoritosIds = favoritos.map((f: any) => f.id);
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    }
  }

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async carregarLivros(): Promise<void> {
    this.loading = true;
    try {
      const response = await fetch('/api/livros');
      this.livros = await response.json();
      this.filteredLivros = [...this.livros];
      await this.carregarAvaliacoesDosLivros();
      this.totalRecords = this.filteredLivros.length;
      this.carregarCategorias();
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    } finally {
      this.loading = false;
    }
  }

  async carregarAvaliacoesDosLivros(): Promise<void> {
  for (const livro of this.livros) {
    try {
      const response = await fetch(`/api/avaliacoes/livro/${livro.id}/resumo`);
      if (response.ok) {
        livro.avaliacao = await response.json();
      }
    } catch (error) {
      console.error('Erro ao buscar avaliação do livro:', error);
    }
  }
}

formatarNota(nota: number): string {
  return nota.toFixed(1);
}

  carregarCategorias(): void {
    const cats = this.livros.map(l => l.categoria).filter(c => c);
    this.categorias = [...new Set(cats)].map(c => ({ label: c, value: c }));
  }

  filtrando: boolean = false;

async aplicarFiltros(): Promise<void> {
  this.filtrando = true;
  this.loading = true;
  await new Promise(resolve => setTimeout(resolve, 1500));
  this.filteredLivros = this.livros.filter(l => {
    let match = true;
    if (this.filtros.titulo && !l.titulo?.toLowerCase().includes(this.filtros.titulo.toLowerCase())) match = false;
    if (this.filtros.autor && !l.autor?.toLowerCase().includes(this.filtros.autor.toLowerCase())) match = false;
    if (this.filtros.editora && !l.editora?.toLowerCase().includes(this.filtros.editora.toLowerCase())) match = false;
    if (this.filtros.categoria && l.categoria !== this.filtros.categoria) match = false;
    if (this.filtros.precoMax && l.precoVenda > this.filtros.precoMax) match = false;
    return match;
  });
  this.totalRecords = this.filteredLivros.length;
  this.first = 0;
  this.loading = false;
  this.filtrando = false;
}

async limparFiltros(): Promise<void> {
  this.filtrando = true;
  this.loading = true;
  await new Promise(resolve => setTimeout(resolve, 1500));
  this.filtros = { titulo: '', autor: '', editora: '', categoria: '', precoMax: null };
  this.filteredLivros = [...this.livros];
  this.totalRecords = this.filteredLivros.length;
  this.first = 0;
  this.loading = false;
  this.filtrando = false;
}
  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  get livrosPaginados(): any[] {
    return this.filteredLivros.slice(this.first, this.first + this.rows);
  }

verDetalhes(livro: any): void {
  this.selectedLivro = livro;
  this.quantidadeSelecionada = 1;
  this.selectedIsFavorited = this.favoritosIds.includes(livro.id);
  this.displayDialog = true;

  this.comentarios = [];
  this.comentariosPaginados = [];
  this.comentariosExpandido = false;
  this.comentariosFirst = 0;

  this.carregarComentarios(livro.id);
}

  async favoritarDoModal(): Promise<void> {
    if (!this.selectedLivro) return;
    await this.favoritar(this.selectedLivro.id);
    this.selectedIsFavorited = this.favoritosIds.includes(this.selectedLivro.id);
  }

  aumentarQuantidade(): void {
    if (this.selectedLivro && this.quantidadeSelecionada < this.selectedLivro.estoque) {
      this.quantidadeSelecionada++;
    }
  }

  diminuirQuantidade(): void {
    if (this.quantidadeSelecionada > 1) {
      this.quantidadeSelecionada--;
    }
  }

  async favoritar(livroId: number): Promise<void> {
    const user = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
    if (!user) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Faça login para favoritar livros'
      });
      return;
    }

    try {
      const token = this.authService.getToken();
      const isFavorited = this.favoritosIds.includes(livroId);

      if (isFavorited) {
        const response = await fetch(`http://localhost:8081/api/clientes/${user.id}/favoritos/${livroId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        if (response.ok) {
          this.favoritosIds = this.favoritosIds.filter(id => id !== livroId);
          this.selectedIsFavorited = false;
          const livro = this.livros.find(l => l.id === livroId);
          const nomeLivro = livro ? livro.titulo : 'Livro';
          this.messageService.add({severity:'info', summary:'Removido', detail:`${nomeLivro} removido dos favoritos`});
          this.authService.adicionarNotificacao('Removido', `${nomeLivro} removido dos favoritos`, 'info');
          await this.atualizarContadorFavoritos();
          this.authService.notificarFavoritosAtualizados();
          this.displayDialog = false;
        }
      } else {
        const body = { livroId };
        const response = await fetch(`http://localhost:8081/api/clientes/${user.id}/favoritos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify(body)
        });
        if (response.ok) {
          this.favoritosIds.push(livroId);
          this.selectedIsFavorited = true;
          const livro = this.livros.find(l => l.id === livroId);
          const nomeLivro = livro ? livro.titulo : 'Livro';
          this.messageService.add({severity:'success', summary:'Favoritado', detail:`${nomeLivro} adicionado aos favoritos`});
          this.authService.adicionarNotificacao('Favoritado', `${nomeLivro} adicionado aos favoritos`, 'success');
          await this.atualizarContadorFavoritos();
          this.authService.notificarFavoritosAtualizados();
          this.displayDialog = false;
        }
      }
    } catch (error) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao favoritar'});
    }
  }

  async atualizarContadorFavoritos(): Promise<void> {
    const user = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
    if (!user) return;

    try {
      const token = this.authService.getToken();
      const response = await fetch(`http://localhost:8081/api/clientes/${user.id}/favoritos`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      if (response.ok) {
        const favoritos = await response.json();
        this.authService.atualizarFavoritosCount(favoritos.length);
      }
    } catch (error) {
      console.error('Erro ao atualizar contador de favoritos:', error);
    }
  }

  atualizarFavoritos(): void {
    this.carregarFavoritos();
  }

async adicionarAoCarrinhoComQuantidade(id: number): Promise<void> {
  const user = this.authService.getUser();
  if (!user) {
    this.messageService.add({severity:'error', summary:'Erro', detail:'Faça login para comprar'});
    return;
  }

  try {
    const token = this.authService.getToken();
    const responseUser = await fetch(`http://localhost:8081/api/clientes/${user.id}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (responseUser.ok) {
      const usuarioCompleto = await responseUser.json();
      const temEndereco = usuarioCompleto.enderecos && usuarioCompleto.enderecos.length > 0;
      const temCartao = usuarioCompleto.cartoes && usuarioCompleto.cartoes.length > 0;

      if (!temEndereco || !temCartao) {
        let mensagem = '';
        if (!temEndereco && !temCartao) {
          mensagem = 'Cadastre um endereco e um cartao para finalizar a compra';
        } else if (!temEndereco) {
          mensagem = 'Cadastre um endereco para finalizar a compra';
        } else {
          mensagem = 'Cadastre um cartao para finalizar a compra';
        }

        this.messageService.add({
          severity: 'warn',
          summary: 'Dados incompletos',
          detail: mensagem,
          life: 4000
        });
        this.authService.adicionarNotificacao('Dados incompletos', mensagem, 'warning');
        return;
      }
    }

    const response = await fetch(`/api/livros/${id}`);
    const produto = await response.json();

    if (produto.estoque <= 0) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Produto indisponivel'});
      return;
    }

    const carrinhos = JSON.parse(localStorage.getItem('carrinhosPorUsuario') || '{}');
    let carrinho = carrinhos[user.id] || [];
    const existente = carrinho.find((i: any) => i.id === id);
    const novaQuantidade = this.quantidadeSelecionada;

    if (existente) {
      if (existente.quantidade + novaQuantidade > produto.estoque) {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Quantidade indisponivel em estoque'});
        return;
      }
      existente.quantidade += novaQuantidade;
    } else {
      carrinho.push({ id, quantidade: novaQuantidade });
    }

    carrinhos[user.id] = carrinho;
    localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhos));
    this.carrinhoService.atualizarContador();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${novaQuantidade}x ${produto.titulo} adicionado ao carrinho!`
    });
    this.displayDialog = false;
    this.quantidadeSelecionada = 1;
  } catch (error) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao adicionar produto'
    });
  }
}
  arredondarNota(nota: number): number {
  return Math.round(nota);
}

getTipoEstrelaPrincipal(nota: number, estrelaIndex: number): string {
  if (nota >= estrelaIndex + 1) {
    return 'cheia';
  } else if (nota > estrelaIndex && nota < estrelaIndex + 1) {
    return 'meia';
  } else {
    return 'vazia';
  }
}

async adicionarAoCarrinho(id: number): Promise<void> {
  const user = this.authService.getUser();
  if (!user) {
    this.messageService.add({severity:'error', summary:'Erro', detail:'Faça login para comprar'});
    return;
  }

  try {
    const token = this.authService.getToken();
    const responseUser = await fetch(`http://localhost:8081/api/clientes/${user.id}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (responseUser.ok) {
      const usuarioCompleto = await responseUser.json();
      const temEndereco = usuarioCompleto.enderecos && usuarioCompleto.enderecos.length > 0;
      const temCartao = usuarioCompleto.cartoes && usuarioCompleto.cartoes.length > 0;

      if (!temEndereco || !temCartao) {
        let mensagem = '';
        if (!temEndereco && !temCartao) {
          mensagem = 'Cadastre um endereco e um cartao para finalizar a compra';
        } else if (!temEndereco) {
          mensagem = 'Cadastre um endereco para finalizar a compra';
        } else {
          mensagem = 'Cadastre um cartao para finalizar a compra';
        }

        this.messageService.add({
          severity: 'warn',
          summary: 'Dados incompletos',
          detail: mensagem,
          life: 4000
        });
        this.authService.adicionarNotificacao('Dados incompletos', mensagem, 'warning');
        return;
      }
    }

    const response = await fetch(`/api/livros/${id}`);
    const produto = await response.json();

    if (produto.estoque <= 0) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Produto indisponivel'});
      return;
    }

    const carrinhos = JSON.parse(localStorage.getItem('carrinhosPorUsuario') || '{}');
    let carrinho = carrinhos[user.id] || [];
    const existente = carrinho.find((i: any) => i.id === id);

    if (existente) {
      if (existente.quantidade + 1 > produto.estoque) {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Quantidade indisponivel em estoque'});
        return;
      }
      existente.quantidade++;
    } else {
      carrinho.push({ id, quantidade: 1 });
    }

    carrinhos[user.id] = carrinho;
    localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhos));
    this.carrinhoService.atualizarContador();
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${produto.titulo} adicionado ao carrinho!`
    });
  } catch (error) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao adicionar produto'
    });
  }
}
}

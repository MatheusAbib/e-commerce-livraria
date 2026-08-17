import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CarrinhoService } from '../../../services/carrinho';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favoritos-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, ToastModule],
  providers: [MessageService],
  templateUrl: './favoritos-modal.html',
  styleUrls: ['./favoritos-modal.css'],
  encapsulation: ViewEncapsulation.None
})
export class FavoritosModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  favoritos: any[] = [];
  loading: boolean = false;
  usuario: any = null;

  constructor(
    private messageService: MessageService,
    private carrinhoService: CarrinhoService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
    if (user) {
      this.usuario = user;
    }

    this.authService.favoritosAtualizados$.subscribe(() => {
      if (this.visible) {
        this.carregarFavoritos();
      }
    });
  }

  fechar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cdr.detectChanges();
  }

  async carregarFavoritos(): Promise<void> {
    console.log('Carregando favoritos...');
    console.log('Usuario no modal:', this.usuario);

    if (!this.usuario) {
      console.log('Usuário não encontrado no modal');
      return;
    }

    this.loading = true;

    try {
      const token = this.authService.getToken();
      const response = await fetch(`http://localhost:8081/api/clientes/${this.usuario.id}/favoritos`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      console.log('Response status:', response.status);

      if (response.ok) {
        this.favoritos = await response.json();
        console.log('Favoritos carregados:', this.favoritos);
        this.cdr.detectChanges();
      } else {
        console.log('Erro na resposta:', response.status);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      this.loading = false;
    }
  }

  verDetalhes(livroId: number): void {
    this.router.navigate(['/principal'], { queryParams: { livroId: livroId } });
  }

  async removerFavorito(livroId: number): Promise<void> {
    if (!this.usuario) return;

    try {
      const token = this.authService.getToken();
      const response = await fetch(`http://localhost:8081/api/clientes/${this.usuario.id}/favoritos/${livroId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        this.favoritos = this.favoritos.filter(l => l.id !== livroId);
        this.cdr.detectChanges();
        this.messageService.add({severity:'success', summary:'Removido', detail:'Livro removido dos favoritos'});

        const user = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
        if (user) {
          const tokenCount = this.authService.getToken();
          const responseCount = await fetch(`http://localhost:8081/api/clientes/${user.id}/favoritos`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + tokenCount
            }
          });
          if (responseCount.ok) {
            const favoritos = await responseCount.json();
            this.authService.atualizarFavoritosCount(favoritos.length);
          }
        }

        this.authService.notificarFavoritosAtualizados();
      }
    } catch (error) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao remover favorito'});
    }
  }

adicionarAoCarrinho(livroId: number): void {
  const user = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
  if (!user) {
    this.messageService.add({severity:'error', summary:'Erro', detail:'Faça login para comprar'});
    return;
  }

  const livro = this.favoritos.find(l => l.id === livroId);
  if (!livro) return;

  if (!livro.ativo) {
    this.messageService.add({severity:'error', summary:'Erro', detail:'Este livro está inativo e não pode ser comprado'});
    return;
  }

  if (livro.estoque <= 0) {
    this.messageService.add({severity:'error', summary:'Erro', detail:'Este livro está esgotado'});
    return;
  }

  const carrinhos = JSON.parse(localStorage.getItem('carrinhosPorUsuario') || '{}');
  let carrinho = carrinhos[user.id] || [];
  const existente = carrinho.find((i: any) => i.id === livroId);

  if (existente) {
    if (existente.quantidade + 1 > livro.estoque) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Quantidade indisponível em estoque'});
      return;
    }
    existente.quantidade++;
  } else {
    carrinho.push({ id: livroId, quantidade: 1 });
  }

  carrinhos[user.id] = carrinho;
  localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhos));
  this.carrinhoService.atualizarContador();
  this.carrinhoService['carrinhoItensSubject'].next(
    this.carrinhoService['carrinhoItensSubject'].value
  );
  this.carrinhoService.notificarCarrinhoAtualizado();
  this.messageService.add({severity:'success', summary:'Sucesso', detail:'Adicionado ao carrinho!'});
  this.authService.adicionarNotificacao('Carrinho', 'Produto adicionado ao carrinho', 'success');
}
}

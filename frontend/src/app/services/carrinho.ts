import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private carrinhoItensSubject = new BehaviorSubject<number>(0);
  carrinhoItens$ = this.carrinhoItensSubject.asObservable();

  private carrinhoAtualizadoSubject = new BehaviorSubject<boolean>(false);
  carrinhoAtualizado$ = this.carrinhoAtualizadoSubject.asObservable();

  constructor() {
    this.atualizarContador();
  }

  atualizarContador(): void {
    const usuario = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
    if (!usuario) {
      this.carrinhoItensSubject.next(0);
      return;
    }

    const carrinhos = JSON.parse(localStorage.getItem('carrinhosPorUsuario') || '{}');
    const carrinho = carrinhos[usuario.id] || [];
    const total = carrinho.reduce((acc: number, item: any) => acc + item.quantidade, 0);
    this.carrinhoItensSubject.next(total);
  }

  notificarCarrinhoAtualizado(): void {
    this.carrinhoAtualizadoSubject.next(true);
  }

  adicionarAoCarrinho(produtoId: number, quantidade: number = 1): void {
    const usuario = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
    if (!usuario) return;

    const carrinhos = JSON.parse(localStorage.getItem('carrinhosPorUsuario') || '{}');
    let carrinho = carrinhos[usuario.id] || [];

    const existente = carrinho.find((i: any) => i.id === produtoId);
    if (existente) {
      existente.quantidade += quantidade;
    } else {
      carrinho.push({ id: produtoId, quantidade });
    }

    carrinhos[usuario.id] = carrinho;
    localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhos));
    this.atualizarContador();
    this.notificarCarrinhoAtualizado();
  }

  removerDoCarrinho(produtoId: number): void {
    const usuario = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
    if (!usuario) return;

    const carrinhos = JSON.parse(localStorage.getItem('carrinhosPorUsuario') || '{}');
    let carrinho = carrinhos[usuario.id] || [];
    carrinho = carrinho.filter((i: any) => i.id !== produtoId);

    carrinhos[usuario.id] = carrinho;
    localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhos));
    this.atualizarContador();
    this.notificarCarrinhoAtualizado();
  }

  limparCarrinho(): void {
    const usuario = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
    if (!usuario) return;

    const carrinhos = JSON.parse(localStorage.getItem('carrinhosPorUsuario') || '{}');
    carrinhos[usuario.id] = [];
    localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhos));
    this.atualizarContador();
    this.notificarCarrinhoAtualizado();
  }

  obterCarrinho(): any[] {
    const usuario = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
    if (!usuario) return [];

    const carrinhos = JSON.parse(localStorage.getItem('carrinhosPorUsuario') || '{}');
    return carrinhos[usuario.id] || [];
  }
}

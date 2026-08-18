import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private abrirChatSubject = new Subject<{pedidoId: number, pedido: any}>();
  abrirChat$ = this.abrirChatSubject.asObservable();

  private ultimoPedidoId: number | null = null;
  private timeoutId: any = null;

  abrirChat(pedidoId: number, pedido: any = null): void {
    // Se for o mesmo pedido, reseta para permitir reabrir
    if (this.ultimoPedidoId === pedidoId) {
      this.ultimoPedidoId = null;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.ultimoPedidoId = pedidoId;

    this.timeoutId = setTimeout(() => {
      this.abrirChatSubject.next({ pedidoId, pedido });
      this.timeoutId = null;
    }, 50);
  }

  limparUltimoPedido(): void {
    this.ultimoPedidoId = null;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

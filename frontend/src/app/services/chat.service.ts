import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private abrirChatSubject = new Subject<{pedidoId: number, pedido: any}>();
  abrirChat$ = this.abrirChatSubject.asObservable();

  abrirChat(pedidoId: number, pedido: any = null): void {
    this.abrirChatSubject.next({ pedidoId, pedido });
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private perfilAtualizadoSource = new Subject<void>();
  perfilAtualizado$ = this.perfilAtualizadoSource.asObservable();

  notificarPerfilAtualizado(): void {
    this.perfilAtualizadoSource.next();
  }
}

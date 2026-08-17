import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  token?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userKey = 'user_data';

  private loginStatusSubject = new BehaviorSubject<boolean>(false);
  loginStatus$ = this.loginStatusSubject.asObservable();

  private favoritosCountSubject = new BehaviorSubject<number>(0);
  favoritosCount$ = this.favoritosCountSubject.asObservable();

  private cuponsCountSubject = new BehaviorSubject<number>(0);
  public cuponsCount$ = this.cuponsCountSubject.asObservable();

  private usuarioSubject = new BehaviorSubject<any>(null);
  usuario$ = this.usuarioSubject.asObservable();

  private favoritosAtualizadosSubject = new BehaviorSubject<boolean>(false);
  favoritosAtualizados$ = this.favoritosAtualizadosSubject.asObservable();

  public notificacoesSubject = new BehaviorSubject<any[]>([]);
  notificacoes$ = this.notificacoesSubject.asObservable();

  private dadosClienteAtualizadosSubject = new BehaviorSubject<boolean>(false);
  dadosClienteAtualizados$ = this.dadosClienteAtualizadosSubject.asObservable();

  private abrirChatSubject = new Subject<number>();
  abrirChat$ = this.abrirChatSubject.asObservable();


  constructor(private http: HttpClient) {
    const user = this.getUserFromStorage();
    if (user) {
      this.usuarioSubject.next(user);
      this.loginStatusSubject.next(true);
    }
  }

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + '/clientes/login', { email, senha })
      .pipe(
        switchMap(response => {
          return this.http.get(`${this.apiUrl}/clientes/${response.user.id}`).pipe(
            map((dadosCompletos: any) => {
              const userWithoutPassword: any = { ...dadosCompletos };
              delete userWithoutPassword.senha;
              response.user = userWithoutPassword;
              return response;
            })
          );
        }),
        tap(response => {
          this.storeAuthData(response.token, response.user);
          this.usuarioSubject.next(response.user);
          this.loginStatusSubject.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem('clienteLogado');
    this.usuarioSubject.next(null);
    this.loginStatusSubject.next(false);
  }

  notificarAbrirChat(pedidoId: number): void {
  this.abrirChatSubject.next(pedidoId);
}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): User | null {
    return this.usuarioSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.perfil === 'ADMIN';
  }

  private storeAuthData(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    const userToStore: any = { ...user };
    delete userToStore.senha;
    localStorage.setItem(this.userKey, JSON.stringify(userToStore));
    localStorage.setItem('clienteLogado', JSON.stringify(userToStore));
  }

  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem(this.userKey);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        return null;
      }
    }
    const oldUserData = localStorage.getItem('clienteLogado');
    if (oldUserData) {
      try {
        return JSON.parse(oldUserData);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() > exp;
    } catch (e) {
      return true;
    }
  }

  atualizarLoginStatus(logado: boolean): void {
    this.loginStatusSubject.next(logado);
  }

  atualizarFavoritosCount(count: number): void {
    this.favoritosCountSubject.next(count);
  }

  atualizarCuponsCount(count: number): void {
    this.cuponsCountSubject.next(count);
  }

  atualizarUsuario(usuario: any): void {
    this.usuarioSubject.next(usuario);
  }

  notificarFavoritosAtualizados(): void {
    this.favoritosAtualizadosSubject.next(true);
  }

  adicionarNotificacao(titulo: string, mensagem: string, tipo: string = 'info'): void {
    const user = this.getUser();
    if (!user) return;

    const notificacoesPorUsuario = JSON.parse(localStorage.getItem('notificacoesPorUsuario') || '{}');
    let notificacoes = notificacoesPorUsuario[user.id] || [];

    const novaNotificacao = {
      id: Date.now(),
      titulo,
      mensagem,
      tipo,
      data: new Date().toISOString(),
      lida: false
    };

    notificacoes.unshift(novaNotificacao);
    notificacoesPorUsuario[user.id] = notificacoes;
    localStorage.setItem('notificacoesPorUsuario', JSON.stringify(notificacoesPorUsuario));

    this.notificacoesSubject.next(notificacoes);
  }

adicionarNotificacaoParaCliente(clienteId: number, titulo: string, mensagem: string, tipo: string = 'info'): void {
  console.log('=== ADICIONANDO NOTIFICAÇÃO PARA CLIENTE ===');
  console.log('Cliente ID:', clienteId);
  console.log('Título:', titulo);
  console.log('Mensagem:', mensagem);
  console.log('Usuário logado:', this.getUser());

  const notificacoesPorUsuario = JSON.parse(localStorage.getItem('notificacoesPorUsuario') || '{}');
  let notificacoes = notificacoesPorUsuario[clienteId] || [];

  const novaNotificacao = {
    id: Date.now(),
    titulo,
    mensagem,
    tipo,
    data: new Date().toISOString(),
    lida: false
  };

  notificacoes.unshift(novaNotificacao);
  notificacoesPorUsuario[clienteId] = notificacoes;
  localStorage.setItem('notificacoesPorUsuario', JSON.stringify(notificacoesPorUsuario));

  console.log('Notificações após salvar:', notificacoes);

  const user = this.getUser();
  if (user && user.id === clienteId) {
    console.log('Usuário logado é o mesmo, atualizando subject');
    this.notificacoesSubject.next(notificacoes);
  } else {
    console.log('Usuário logado não é o mesmo ou não está logado');
  }
}

  notificarDadosClienteAtualizados(): void {
    this.dadosClienteAtualizadosSubject.next(true);
  }
}

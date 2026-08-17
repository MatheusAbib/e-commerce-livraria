import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getVendas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos/todos`);
  }

  getLucros(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vendas/lucros`);
  }

  getVendasPorCategoria(dataInicio: string, dataFim: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/vendas/categorias?dataInicio=${dataInicio}&dataFim=${dataFim}`);
  }

  getLivros(): Observable<any> {
    return this.http.get(`${this.apiUrl}/livros/consulta`);
  }

  getRanking(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/ranking`);
  }

  getLogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logs`);
  }

  getClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes`);
  }

  getClientesConsulta(url: string): Observable<any> {
    return this.http.get(url);
  }

  criarCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes`, cliente);
  }

  alterarSenha(id: number, senha: string, confirmacaoSenha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes/${id}/change-password`, { senha, confirmacaoSenha });
  }

  alterarStatus(id: number, ativo: boolean, motivo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes/change-status/${id}`, { ativo, motivo });
  }

  excluirCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes/${id}`);
  }

  atualizarAdmin(id: number, dados: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/clientes/${id}`, dados);
}

getCliente(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/clientes/${id}`);
}

getLivrosConsulta(url: string): Observable<any> {
  return this.http.get(url);
}

}

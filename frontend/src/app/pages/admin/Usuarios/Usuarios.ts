import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginatorModule,
    DialogModule,
    ToastModule,
    AdminSidebarComponent
  ],
  providers: [MessageService],
  templateUrl: './Usuarios.html',
  styleUrls: ['./Usuarios.css', '../admin-common.css']
})
export class UsuariosComponent implements OnInit {
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  clientesPaginados: any[] = [];
  loading: boolean = true;
  totalRecords: number = 0;

  filtros = {
    nome: '',
    email: '',
    cpf: '',
    genero: '',
    ativo: ''
  };

  generosOptions = [
    { label: 'Todos', value: '' },
    { label: 'Masculino', value: 'MASCULINO' },
    { label: 'Feminino', value: 'FEMININO' },
    { label: 'Prefiro não informar', value: 'PREFIRO_NAO_INFORMAR' }
  ];

  statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Ativo', value: 'ativo' },
    { label: 'Inativo', value: 'inativo' }
  ];

  first: number = 0;
  rows: number = 10;
  timeoutFiltro: any = null;

  displayCadastroModal: boolean = false;
  displaySenhaModal: boolean = false;
  displayStatusModal: boolean = false;
  displayExcluirModal: boolean = false;

  novoCliente: any = {
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    telefone: '',
    genero: 'PREFIRO_NAO_INFORMAR',
    dataNascimento: ''
  };

  clienteStatus: any = { id: null, nome: '', ativo: false };
  motivoStatus: string = '';
  clienteSenha: any = { id: null, email: '', novaSenha: '', confirmarSenha: '' };
  clienteExcluir: any = { id: null, nome: '' };

  constructor(
    private adminService: AdminService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  async carregarClientes(filtros: any = {}): Promise<void> {
    this.loading = true;
    try {
      const params = new URLSearchParams();
      if (filtros.nome) params.append('nome', filtros.nome);
      if (filtros.email) params.append('email', filtros.email);
      if (filtros.cpf) params.append('cpf', filtros.cpf);
      if (filtros.genero) params.append('genero', filtros.genero);
      if (filtros.ativo !== undefined && filtros.ativo !== null && filtros.ativo !== '') {
        params.append('ativo', filtros.ativo === 'ativo' ? 'true' : 'false');
      }
      const url = '/api/clientes/consulta?' + params.toString();
      const data = await this.adminService.getClientesConsulta(url).toPromise();
      this.clientes = data || [];
      this.clientesFiltrados = [...this.clientes];
      this.totalRecords = this.clientesFiltrados.length;
      this.atualizarPaginacao();
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      this.messageService.add({severity:'error', summary:'Erro', detail:'Falha ao carregar clientes'});
    } finally {
      this.loading = false;
    }
  }

filtrando: boolean = false;

aplicarFiltros(): void {
  this.filtrando = true;
  clearTimeout(this.timeoutFiltro);
  this.loading = true;

  this.timeoutFiltro = setTimeout(() => {
    const filtros: any = {};
    if (this.filtros.nome) filtros.nome = this.filtros.nome;
    if (this.filtros.email) filtros.email = this.filtros.email;
    if (this.filtros.cpf) filtros.cpf = this.filtros.cpf;
    if (this.filtros.genero) filtros.genero = this.filtros.genero;
    if (this.filtros.ativo) filtros.ativo = this.filtros.ativo;
    this.carregarClientes(filtros);
    this.filtrando = false;
  }, 1500);
}

limparFiltros(): void {
  this.filtrando = true;
  clearTimeout(this.timeoutFiltro);
  this.filtros = { nome: '', email: '', cpf: '', genero: '', ativo: '' };
  this.carregarClientes();
  this.filtrando = false;
}
  atualizarPaginacao(): void {
    this.clientesPaginados = this.clientesFiltrados.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.atualizarPaginacao();
  }

  abrirCadastro(): void {
    this.novoCliente = {
      nome: '',
      email: '',
      senha: '',
      cpf: '',
      telefone: '',
      genero: 'PREFIRO_NAO_INFORMAR',
      dataNascimento: ''
    };
    this.displayCadastroModal = true;
  }

  async salvarCliente(): Promise<void> {
    if (!this.novoCliente.nome || !this.novoCliente.email || !this.novoCliente.senha) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Preencha os campos obrigatórios'});
      return;
    }
    try {
      const data = await this.adminService.criarCliente(this.novoCliente).toPromise();
      this.messageService.add({severity:'success', summary:'Sucesso', detail:'Cliente cadastrado com sucesso!'});
      this.displayCadastroModal = false;
      this.carregarClientes();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      this.messageService.add({severity:'error', summary:'Erro', detail:'Falha ao cadastrar cliente'});
    }
  }

  abrirSenha(cliente: any): void {
    this.clienteSenha = {
      id: cliente.id,
      email: cliente.email,
      novaSenha: '',
      confirmarSenha: ''
    };
    this.displaySenhaModal = true;
  }

  async confirmarAlterarSenha(): Promise<void> {
    if (!this.clienteSenha.novaSenha || !this.clienteSenha.confirmarSenha) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Preencha os dois campos'});
      return;
    }
    if (this.clienteSenha.novaSenha !== this.clienteSenha.confirmarSenha) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Senhas não conferem'});
      return;
    }
    try {
      await this.adminService.alterarSenha(this.clienteSenha.id, this.clienteSenha.novaSenha, this.clienteSenha.confirmarSenha).toPromise();

      // Atualizar a senha salva no "Lembrar-me" do cliente
      this.atualizarSenhaSalva(this.clienteSenha.email, this.clienteSenha.novaSenha);

      this.messageService.add({severity:'success', summary:'Sucesso', detail:'Senha alterada com sucesso!'});
      this.displaySenhaModal = false;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      this.messageService.add({severity:'error', summary:'Erro', detail:'Falha ao alterar senha'});
    }
  }

  private atualizarSenhaSalva(email: string, novaSenha: string): void {
    const REMEMBER_KEY = 'login_remember';
    const dados = localStorage.getItem(REMEMBER_KEY);
    if (dados) {
      try {
        const parsed = JSON.parse(dados);
        // Verifica se o email salvo é o mesmo do cliente que está tendo a senha alterada
        if (parsed.email === email) {
          parsed.senha = novaSenha;
          localStorage.setItem(REMEMBER_KEY, JSON.stringify(parsed));
          console.log('Senha salva no "Lembrar-me" atualizada para o cliente:', email);
        }
      } catch (e) {
        console.error('Erro ao atualizar senha salva:', e);
      }
    }
  }

  abrirStatus(cliente: any, ativo: boolean): void {
    this.clienteStatus = { id: cliente.id, nome: cliente.nome, ativo: ativo };
    this.motivoStatus = '';
    this.displayStatusModal = true;
  }

  async confirmarAlterarStatus(): Promise<void> {
    if (!this.motivoStatus.trim()) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Informe o motivo da alteração'});
      return;
    }
    try {
      await this.adminService.alterarStatus(this.clienteStatus.id, this.clienteStatus.ativo, this.motivoStatus).toPromise();
      this.messageService.add({severity:'success', summary:'Sucesso', detail:'Status alterado com sucesso!'});
      this.displayStatusModal = false;
      this.carregarClientes();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      this.messageService.add({severity:'error', summary:'Erro', detail:'Falha ao alterar status'});
    }
  }

  abrirExcluir(cliente: any): void {
    this.clienteExcluir = { id: cliente.id, nome: cliente.nome };
    this.displayExcluirModal = true;
  }

  async confirmarExcluir(): Promise<void> {
    try {
      await this.adminService.excluirCliente(this.clienteExcluir.id).toPromise();
      this.messageService.add({severity:'success', summary:'Sucesso', detail:'Cliente excluído com sucesso!'});
      this.displayExcluirModal = false;
      this.carregarClientes();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      this.messageService.add({severity:'error', summary:'Erro', detail:'Falha ao excluir cliente'});
    }
  }

  togglePassword(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (!input) return;
    const icon = input.parentElement?.querySelector('.password-toggle') as HTMLElement;
    if (!icon) return;
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'pi pi-eye-slash password-toggle';
    } else {
      input.type = 'password';
      icon.className = 'pi pi-eye password-toggle';
    }
  }

  formatarCPF(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length === 11) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (valor.length > 3) {
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    }
    event.target.value = valor;
  }

  formatarTelefone(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length === 11) {
      valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length === 10) {
      valor = valor.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    event.target.value = valor;
  }

  formatarCPFExibicao(cpf: string): string {
    if (!cpf) return '-';
    const numeros = cpf.replace(/\D/g, '');
    if (numeros.length === 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return cpf;
  }

  formatarTelefoneExibicao(telefone: string): string {
    if (!telefone) return '-';
    const numeros = telefone.replace(/\D/g, '');
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  }

  getStatusClass(ativo: boolean): string {
    return ativo ? 'status-ativo' : 'status-inativo';
  }

  getStatusText(ativo: boolean): string {
    return ativo ? 'Ativo' : 'Inativo';
  }

  getStatusIcon(ativo: boolean): string {
    return ativo ? 'pi pi-check-circle' : 'pi pi-times-circle';
  }

  getGeneroLabel(genero: string): string {
    const labels: any = {
      'MASCULINO': 'Masculino',
      'FEMININO': 'Feminino',
      'PREFIRO_NAO_INFORMAR': 'Prefiro não informar'
    };
    return labels[genero] || genero || '-';
  }
}

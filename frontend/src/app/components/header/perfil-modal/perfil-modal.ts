import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-perfil-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, DialogModule, ToastModule],
  providers: [MessageService],
  templateUrl: './perfil-modal.html',
  styleUrls: ['./perfil-modal.css']
})
export class PerfilModalComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() usuario: any = null;

  perfilEnderecos: any[] = [];
  perfilCartoes: any[] = [];
  loading: boolean = false;

  displayEditarEndereco: boolean = false;
  displayEditarCartao: boolean = false;
  displayEditarPerfil: boolean = false;
  displayAlterarSenha: boolean = false;
  displayConfirmarExclusao: boolean = false;

  enderecoEditando: any = {};
  cartaoEditando: any = {};
  itemParaExcluir: { tipo: string, id: number } | null = null;
  novaSenha: string = '';
  confirmarSenha: string = '';
  showNovaSenha: boolean = false;
  showConfirmarSenha: boolean = false;

  constructor(
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
    if (user) {
      this.usuario = user;
      this.carregarDadosPerfil();
    }

    this.authService.dadosClienteAtualizados$.subscribe(() => {
      if (this.visible) {
        this.carregarDadosPerfil();
      }
    });
  }

  fechar(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

async carregarDadosPerfil(): Promise<void> {
  if (!this.usuario) return;
  this.loading = true;

  try {
    const token = this.authService.getToken();
    const response = await fetch(`http://localhost:8081/api/clientes/${this.usuario.id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    if (response.ok) {
      const text = await response.text();
      console.log('RESPOSTA PERFIL:', text);
      const dados = JSON.parse(text);
      this.usuario = dados;
      this.perfilEnderecos = dados.enderecos || [];
      this.perfilCartoes = dados.cartoes || [];
      this.cdr.detectChanges();
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao carregar perfil'});
  } finally {
    this.loading = false;
  }
}
  editarDados(): void {
    this.displayEditarPerfil = true;
  }

  async salvarDados(): Promise<void> {
    if (!this.usuario) return;
    try {
      const token = this.authService.getToken();
      const usuarioAntigo = { ...this.usuario };
      const response = await fetch(`http://localhost:8081/api/clientes/${this.usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(this.usuario)
      });

      if (response.ok) {
        const camposAlterados = [];
        if (usuarioAntigo.nome !== this.usuario.nome) camposAlterados.push('Nome');
        if (usuarioAntigo.email !== this.usuario.email) camposAlterados.push('E-mail');
        if (usuarioAntigo.cpf !== this.usuario.cpf) camposAlterados.push('CPF');
        if (usuarioAntigo.nascimento !== this.usuario.nascimento) camposAlterados.push('Data de Nascimento');
        if (usuarioAntigo.genero !== this.usuario.genero) camposAlterados.push('Gênero');
        if (usuarioAntigo.telefone !== this.usuario.telefone) camposAlterados.push('Telefone');
        if (usuarioAntigo.tipotelefone !== this.usuario.tipotelefone) camposAlterados.push('Tipo de Telefone');

        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Dados atualizados!'});
        if (camposAlterados.length > 0) {
          this.authService.adicionarNotificacao(
            'Perfil Atualizado',
            `Campos alterados: ${camposAlterados.join(', ')}`,
            'success'
          );
        } else {
          this.authService.adicionarNotificacao('Perfil Atualizado', 'Seus dados pessoais foram atualizados com sucesso!', 'success');
        }
        this.displayEditarPerfil = false;
        await this.carregarDadosPerfil();
        localStorage.setItem('clienteLogado', JSON.stringify(this.usuario));

        this.authService.atualizarUsuario(this.usuario);

        setTimeout(() => {
          const user = JSON.parse(localStorage.getItem('clienteLogado') || 'null');
          const header = document.querySelector('app-header') as any;
          if (header && header.atualizarNomeDoUsuario) {
            header.atualizarNomeDoUsuario(user);
          }
        }, 100);
      } else {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao atualizar dados'});
      }
    } catch (error) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao conectar ao servidor'});
    }
  }

  alterarSenha(): void {
    this.novaSenha = '';
    this.confirmarSenha = '';
    this.showNovaSenha = false;
    this.showConfirmarSenha = false;
    this.displayAlterarSenha = true;
  }

  toggleNovaSenha(): void {
    this.showNovaSenha = !this.showNovaSenha;
  }

  toggleConfirmarSenha(): void {
    this.showConfirmarSenha = !this.showConfirmarSenha;
  }

  async salvarSenha(): Promise<void> {
    if (!this.novaSenha || !this.confirmarSenha) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Preencha todos os campos'});
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'As senhas não conferem'});
      return;
    }

    try {
      const token = this.authService.getToken();
      const response = await fetch(`http://localhost:8081/api/clientes/${this.usuario.id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ senha: this.novaSenha, confirmacaoSenha: this.confirmarSenha })
      });

      if (response.ok) {
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Senha alterada!'});
        this.authService.adicionarNotificacao('Senha Alterada', 'Sua senha foi alterada com sucesso!', 'success');
        this.displayAlterarSenha = false;
        this.novaSenha = '';
        this.confirmarSenha = '';
        this.atualizarSenhaSalva(this.novaSenha);
      } else {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao alterar senha'});
      }
    } catch (error) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao conectar ao servidor'});
    }
  }

  private atualizarSenhaSalva(novaSenha: string): void {
    const REMEMBER_KEY = 'login_remember';
    const dados = localStorage.getItem(REMEMBER_KEY);
    if (dados) {
      try {
        const parsed = JSON.parse(dados);
        parsed.senha = novaSenha;
        localStorage.setItem(REMEMBER_KEY, JSON.stringify(parsed));
        console.log('Senha salva no "Lembrar-me" atualizada com sucesso!');
      } catch (e) {
        console.error('Erro ao atualizar senha salva:', e);
      }
    }
  }

  getTelefonePlaceholder(): string {
    if (!this.usuario) {
      return '(00) 0000-0000';
    }
    const tipo = this.usuario?.tipotelefone;
    if (tipo === 'CELULAR') {
      return '(00) 00000-0000';
    }
    return '(00) 0000-0000';
  }

  getTelefoneIcon(tipo: string): string {
    const icons: any = {
      'CELULAR': 'pi pi-mobile',
      'RESIDENCIAL': 'pi pi-home',
      'COMERCIAL': 'pi pi-building'
    };
    return icons[tipo] || 'pi pi-phone';
  }

  onTipoTelefoneChange(): void {
    if (this.usuario?.telefone) {
      this.usuario.telefone = '';
    }
  }

  formatarTelefone(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    const tipo = this.usuario?.tipotelefone;

    if (tipo === 'CELULAR') {
      if (valor.length > 11) valor = valor.slice(0, 11);
      if (valor.length === 11) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (valor.length >= 2) {
        valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      }
    } else {
      if (valor.length > 10) valor = valor.slice(0, 10);
      if (valor.length === 10) {
        valor = valor.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else if (valor.length >= 2) {
        valor = valor.replace(/(\d{2})(\d{0,4})/, '($1) $2');
      }
    }

    event.target.value = valor;
  }

  adicionarEndereco(): void {
    this.enderecoEditando = {
      nomeEndereco: '',
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      tipoResidencia: '',
      complemento: '',
      tipo: 'ENTREGA',
      pais: 'Brasil'
    };
    this.displayEditarEndereco = true;
  }

  async editarEndereco(endereco: any): Promise<void> {
    this.enderecoEditando = { ...endereco };
    this.displayEditarEndereco = true;
  }

  async salvarEndereco(): Promise<void> {
    if (!this.enderecoEditando.rua || !this.enderecoEditando.numero || !this.enderecoEditando.bairro ||
        !this.enderecoEditando.cidade || !this.enderecoEditando.estado || !this.enderecoEditando.cep) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Preencha todos os campos obrigatórios'});
      return;
    }

    try {
      const token = this.authService.getToken();
      const enderecoAntigo = this.enderecoEditando.id ? { ...this.enderecoEditando } : null;
      const endereco = {
        ...this.enderecoEditando,
        cliente: { id: this.usuario.id },
        cep: this.enderecoEditando.cep.replace(/\D/g, ''),
        pais: 'Brasil'
      };

      const url = this.enderecoEditando.id
        ? `http://localhost:8081/api/enderecos/${this.enderecoEditando.id}`
        : 'http://localhost:8081/api/enderecos';
      const method = this.enderecoEditando.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(endereco)
      });

      if (response.ok) {
        const mensagem = this.enderecoEditando.id ? 'Endereço atualizado!' : 'Endereço adicionado!';
        this.messageService.add({severity:'success', summary:'Sucesso', detail: mensagem});

        if (this.enderecoEditando.id) {
          const camposEndereco = [];
          if (enderecoAntigo.rua !== this.enderecoEditando.rua) camposEndereco.push('Rua');
          if (enderecoAntigo.numero !== this.enderecoEditando.numero) camposEndereco.push('Número');
          if (enderecoAntigo.bairro !== this.enderecoEditando.bairro) camposEndereco.push('Bairro');
          if (enderecoAntigo.cidade !== this.enderecoEditando.cidade) camposEndereco.push('Cidade');
          if (enderecoAntigo.estado !== this.enderecoEditando.estado) camposEndereco.push('Estado');
          if (enderecoAntigo.cep !== this.enderecoEditando.cep) camposEndereco.push('CEP');

          if (camposEndereco.length > 0) {
            this.authService.adicionarNotificacao(
              'Endereço Atualizado',
              `Endereço "${this.enderecoEditando.nomeEndereco || 'sem nome'}" - Campos alterados: ${camposEndereco.join(', ')}`,
              'success'
            );
          } else {
            this.authService.adicionarNotificacao(
              'Endereço Atualizado',
              `Endereço "${this.enderecoEditando.nomeEndereco || 'sem nome'}" foi atualizado!`,
              'success'
            );
          }
        } else {
          this.authService.adicionarNotificacao(
            'Endereço Adicionado',
            `Novo endereço "${this.enderecoEditando.nomeEndereco || 'sem nome'}" foi adicionado!`,
            'success'
          );
        }
        this.displayEditarEndereco = false;
        await this.carregarDadosPerfil();
      } else {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao salvar endereço'});
      }
    } catch (error) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao conectar ao servidor'});
    }
  }

  adicionarCartao(): void {
    this.cartaoEditando = {
      nomeCartao: '',
      numero: '',
      nomeTitular: '',
      bandeira: '',
      cvv: '',
      dataValidade: '',
      preferencial: false
    };
    this.displayEditarCartao = true;
  }

  async editarCartao(cartao: any): Promise<void> {
    this.cartaoEditando = { ...cartao };
    this.displayEditarCartao = true;
  }

  async salvarCartao(): Promise<void> {
    if (!this.cartaoEditando.numero || !this.cartaoEditando.nomeTitular || !this.cartaoEditando.bandeira ||
        !this.cartaoEditando.cvv || !this.cartaoEditando.dataValidade) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Preencha todos os campos obrigatórios'});
      return;
    }

    try {
      const token = this.authService.getToken();
      const cartaoAntigo = this.cartaoEditando.id ? { ...this.cartaoEditando } : null;
      const cartao = {
        numero: this.cartaoEditando.numero.replace(/\s/g, ''),
        nomeTitular: this.cartaoEditando.nomeTitular,
        bandeira: this.cartaoEditando.bandeira,
        cvv: this.cartaoEditando.cvv,
        dataValidade: this.cartaoEditando.dataValidade,
        preferencial: this.cartaoEditando.preferencial || false
      };

      const url = this.cartaoEditando.id
        ? `http://localhost:8081/api/clientes/${this.usuario.id}/cartoes/${this.cartaoEditando.id}`
        : `http://localhost:8081/api/clientes/${this.usuario.id}/cartoes`;
      const method = this.cartaoEditando.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(cartao)
      });

      if (response.ok) {
        const mensagem = this.cartaoEditando.id ? 'Cartão atualizado!' : 'Cartão adicionado!';
        this.messageService.add({severity:'success', summary:'Sucesso', detail: mensagem});

        if (this.cartaoEditando.id) {
          const camposCartao = [];
          if (cartaoAntigo.bandeira !== this.cartaoEditando.bandeira) camposCartao.push('Bandeira');
          if (cartaoAntigo.nomeTitular !== this.cartaoEditando.nomeTitular) camposCartao.push('Nome do Titular');
          if (cartaoAntigo.dataValidade !== this.cartaoEditando.dataValidade) camposCartao.push('Data de Validade');
          if (cartaoAntigo.preferencial !== this.cartaoEditando.preferencial) camposCartao.push('Preferencial');

          if (camposCartao.length > 0) {
            this.authService.adicionarNotificacao(
              'Cartão Atualizado',
              `Cartão ${this.cartaoEditando.bandeira} - Campos alterados: ${camposCartao.join(', ')}`,
              'success'
            );
          } else {
            this.authService.adicionarNotificacao(
              'Cartão Atualizado',
              `Cartão ${this.cartaoEditando.bandeira} foi atualizado!`,
              'success'
            );
          }
        } else {
          this.authService.adicionarNotificacao(
            'Cartão Adicionado',
            `Novo cartão ${this.cartaoEditando.bandeira} foi adicionado!`,
            'success'
          );
        }
        this.displayEditarCartao = false;
        await this.carregarDadosPerfil();
      } else {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao salvar cartão'});
      }
    } catch (error) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao conectar ao servidor'});
    }
  }

  confirmarExclusao(tipo: string, id: number): void {
    this.itemParaExcluir = { tipo, id };
    this.displayConfirmarExclusao = true;
  }

async executarExclusao(): Promise<void> {
  const item = this.itemParaExcluir;
  if (!item) return;

  try {
    const token = this.authService.getToken();
    let url = '';
    let nomeItem = '';
    if (item.tipo === 'endereco') {
      const endereco = this.perfilEnderecos.find(e => e.id === item.id);
      nomeItem = endereco?.nomeEndereco || 'Endereço';
      url = `http://localhost:8081/api/enderecos/${item.id}`;
    } else if (item.tipo === 'cartao') {
      const cartao = this.perfilCartoes.find(c => c.id === item.id);
      nomeItem = cartao?.bandeira || 'Cartão';
      url = `http://localhost:8081/api/clientes/${this.usuario.id}/cartoes/${item.id}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (response.ok) {
      const tipoNome = item.tipo === 'endereco' ? 'Endereço' : 'Cartão';
      this.messageService.add({severity:'success', summary:'Sucesso', detail: `${tipoNome} excluído!`});
      this.authService.adicionarNotificacao(
        `${tipoNome} Excluído`,
        `${tipoNome} "${nomeItem}" foi removido do seu perfil.`,
        'warning'
      );
      this.displayConfirmarExclusao = false;
      this.itemParaExcluir = null;
      await this.carregarDadosPerfil();
    } else {
      this.messageService.add({severity:'error', summary:'Erro', detail: `Erro ao excluir ${item.tipo === 'endereco' ? 'endereço' : 'cartão'}`});
    }
  } catch (error) {
    this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao conectar ao servidor'});
  }
}

formatarCPF(event: any): void {
  let valor = event.target.value.replace(/\D/g, '');
  if (valor.length > 11) valor = valor.slice(0, 11);
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    event.target.value = valor;
  }

  formatarCEP(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    if (valor.length === 8) {
      valor = valor.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    event.target.value = valor;
  }

  formatarNumeroCartao(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 16) valor = valor.slice(0, 16);
    valor = valor.replace(/(\d{4})/g, '$1 ').trim();
    event.target.value = valor;
  }

  formatarCVV(event: any): void {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4);
  }

  formatarValidadeCartao(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 6) valor = valor.slice(0, 6);
    if (valor.length >= 2) {
      const mes = valor.slice(0, 2);
      const ano = valor.slice(2);
      if (parseInt(mes) > 12) {
        event.target.value = '12/' + ano;
      } else {
        event.target.value = valor.replace(/(\d{2})(\d{0,4})/, '$1/$2');
      }
    }
  }

  getGeneroLabel(genero: string): string {
    const labels: any = {
      'MASCULINO': 'Masculino',
      'FEMININO': 'Feminino',
      'PREFIRO_NAO_INFORMAR': 'Prefiro não informar'
    };
    return labels[genero] || genero;
  }

  getTipoTelefoneLabel(tipo: string): string {
    const labels: any = {
      'RESIDENCIAL': 'Residencial',
      'COMERCIAL': 'Comercial',
      'CELULAR': 'Celular'
    };
    return labels[tipo] || tipo;
  }

  cancelarExclusao(): void {
    this.displayConfirmarExclusao = false;
    this.itemParaExcluir = null;
  }

  getEnderecoIcon(tipo: string): string {
    return tipo === 'COBRANCA' ? 'pi pi-credit-card' : 'pi pi-truck';
  }

  getEnderecoLabel(tipo: string): string {
    return tipo === 'COBRANCA' ? 'Cobrança' : 'Entrega';
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar';
import { AdminModalsComponent } from '../../../components/admin-modals/admin-modals';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-livros-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    CalendarModule,
    FileUploadModule,
    DropdownModule,
    PaginatorModule,
    AdminSidebarComponent,
    AdminModalsComponent
  ],
  providers: [MessageService],
  templateUrl: './livros.html',
  styleUrls: ['./livros.css', '../admin-common.css']
})
export class LivrosComponent implements OnInit {
  @ViewChild(AdminModalsComponent) adminModals!: AdminModalsComponent;

  livros: any[] = [];
  livrosPaginados: any[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
  categorias: string[] = [];

  filtros = {
    titulo: '',
    autor: '',
    editora: '',
    isbn: '',
    categoria: '',
    precoMin: null as number | null,
    precoMax: null as number | null,
    estoqueMin: null as number | null,
    estoqueMax: null as number | null,
    status: ''
  };

  constructor(
    private messageService: MessageService,
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarLivros();
    this.carregarCategorias();
  }

async carregarCategorias(): Promise<void> {
  try {
    const token = this.authService.getToken();
    const response = await fetch('http://localhost:8081/api/livros/categorias', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    if (response.ok) {
      this.categorias = await response.json();
    }
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}
  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    this.livrosPaginados = this.livros.slice(this.first, this.first + this.rows);
  }

  async carregarLivros(filtros: any = {}): Promise<void> {
    this.loading = true;
    try {
      const params = new URLSearchParams();
      if (filtros.titulo) params.append('titulo', filtros.titulo);
      if (filtros.autor) params.append('autor', filtros.autor);
      if (filtros.editora) params.append('editora', filtros.editora);
      if (filtros.isbn) params.append('isbn', filtros.isbn);
      if (filtros.categoria) params.append('categoria', filtros.categoria);
      if (filtros.precoMin) params.append('precoMin', filtros.precoMin.toString());
      if (filtros.precoMax) params.append('precoMax', filtros.precoMax.toString());
      if (filtros.estoqueMin) params.append('estoqueMin', filtros.estoqueMin.toString());
      if (filtros.estoqueMax) params.append('estoqueMax', filtros.estoqueMax.toString());
      if (filtros.status) {
        params.append('status', filtros.status);
      }

      const data = await this.adminService.getLivrosConsulta('/api/livros/consulta?' + params.toString()).toPromise();
      this.livros = data?.livros || [];
      this.totalRecords = this.livros.length;
      this.first = 0;
      this.atualizarPaginacao();
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
      this.messageService.add({severity:'error', summary:'Erro', detail:'Falha ao carregar livros'});
    } finally {
      this.loading = false;
    }
  }

filtrando: boolean = false;

async aplicarFiltros(): Promise<void> {
  this.filtrando = true;
  await new Promise(resolve => setTimeout(resolve, 1500));
  this.loading = true;
  this.carregarLivros(this.filtros);
  this.filtrando = false;
}

async limparFiltros(): Promise<void> {
  this.filtrando = true;
  await new Promise(resolve => setTimeout(resolve, 1500));
  this.filtros = {
    titulo: '',
    autor: '',
    editora: '',
    isbn: '',
    categoria: '',
    precoMin: null,
    precoMax: null,
    estoqueMin: null,
    estoqueMax: null,
    status: ''
  };
  this.carregarLivros();
  this.filtrando = false;
}

  abrirFormulario(livro?: any): void {
    this.adminModals.abrirFormulario(livro);
    this.adminModals.setSalvarLivroCallback(() => this.salvarLivro());
  }
async salvarLivro(): Promise<void> {
  const livroData = this.adminModals.livroEditando;
  const imagem = this.adminModals.livroEditando.imagem;

  if (!livroData.titulo || !livroData.autor) {
    this.messageService.add({severity:'error', summary:'Erro', detail:'Preencha os campos obrigatórios'});
    return;
  }

if (livroData.categoria) {
  livroData.categoria = livroData.categoria.trim().replace(/\s+/g, ' ');
  livroData.categoria = livroData.categoria.split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

    try {
      const formData = new FormData();
      const livro = {
        titulo: livroData.titulo,
        autor: livroData.autor,
        editora: livroData.editora || null,
        categoria: livroData.categoria || null,
        edicao: livroData.edicao,
        isbn: livroData.isbn || null,
        paginas: livroData.paginas,
        sinopse: livroData.sinopse || null,
        altura: livroData.altura,
        largura: livroData.largura,
        profundidade: livroData.profundidade,
        peso: livroData.peso,
        codigoBarras: livroData.codigoBarras || null,
        precoCusto: livroData.precoCusto,
        estoque: livroData.estoque,
        dataEntrada: livroData.dataEntrada
      };
      formData.append('livro', new Blob([JSON.stringify(livro)], { type: 'application/json' }));
      if (imagem) {
        formData.append('imagem', imagem);
      }

      const token = this.authService.getToken();
      const headers: any = {};
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }

      const url = livroData.id
        ? `http://localhost:8081/api/livros/${livroData.id}/com-imagem`
        : 'http://localhost:8081/api/livros/com-imagem';
      const method = livroData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: formData
      });

      if (response.ok) {
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Livro salvo com sucesso!'});
        this.adminModals.fecharFormulario();
        this.carregarLivros();
        this.carregarCategorias();
      } else {
        const error = await response.text();
        this.messageService.add({severity:'error', summary:'Erro', detail: error || 'Erro ao salvar livro'});
      }
    } catch (error) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao conectar ao servidor'});
    }
  }

  abrirExcluir(livro: any): void {
    this.adminModals.abrirExcluir(() => this.confirmarExcluir(livro));
  }

  async confirmarExcluir(livro: any): Promise<void> {
    try {
      const token = this.authService.getToken();
      const response = await fetch(`http://localhost:8081/api/livros/${livro.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        this.messageService.add({severity:'success', summary:'Sucesso', detail:'Livro excluído com sucesso!'});
        this.carregarLivros();
        this.carregarCategorias();
      } else {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao excluir livro'});
      }
    } catch (error) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao conectar ao servidor'});
    }
  }

  abrirStatus(livro: any, ativo: boolean): void {
    this.adminModals.abrirStatus(ativo, () => this.confirmarStatus(livro, ativo));
  }

  async confirmarStatus(livro: any, ativo: boolean): Promise<void> {
    try {
      const token = this.authService.getToken();
      const response = await fetch(`http://localhost:8081/api/livros/change-status/${livro.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          ativo: ativo,
          motivo: this.adminModals.motivoStatus
        })
      });

      if (response.ok) {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Livro ${ativo ? 'ativado' : 'inativado'} com sucesso!`
        });
        this.carregarLivros();
      } else {
        this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao alterar status'});
      }
    } catch (error) {
      this.messageService.add({severity:'error', summary:'Erro', detail:'Erro ao conectar ao servidor'});
    }
  }

  abrirDetalhes(livro: any): void {
    this.adminModals.abrirDetalhes(livro, []);
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
}

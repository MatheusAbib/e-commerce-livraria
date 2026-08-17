import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from '../../../components/admin-sidebar/admin-sidebar';
import { PaginatorModule } from 'primeng/paginator';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminSidebarComponent,
    PaginatorModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css', '../admin-common.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChartRef!: ElementRef;

  loading: boolean = true;
  loadingAvaliacoes: boolean = true;

  stats = {
    totalLivros: 0,
    totalVendas: 0,
    lucroTotal: 0,
    totalPedidos: 0
  };

  statsAvaliacoes = {
    mediaGeral: 0,
    totalAvaliacoes: 0,
    notaMaxima: 0,
    notaMinima: 0
  };

  lucros: any[] = [];
  lucrosFiltrados: any[] = [];
  lucrosPaginados: any[] = [];
  filtroLivro: string = 'todos';
  livrosOptions: string[] = [];
  statusDistribuicao: any[] = [];

  rankingLivros: any[] = [];
  rankingLivrosPaginados: any[] = [];
  distribuicaoNotas: any[] = [];

  firstLucro: number = 0;
  rowsLucro: number = 10;
  totalRecordsLucro: number = 0;

  firstRanking: number = 0;
  rowsRanking: number = 5;
  totalRecordsRanking: number = 0;

  filtrando: boolean = false;

  filtros = {
    periodo: 'month',
    status: 'todos',
    livro: '',
    chartType: 'line',
    dataInicio: '',
    dataFim: ''
  };

  private chart: Chart | null = null;
  private maxLucro: number = 0;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user || user.perfil !== 'ADMIN') {
      this.router.navigate(['/principal']);
      return;
    }
    this.carregarDados();
    this.carregarAvaliacoes();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.carregarGrafico(), 500);
  }

  async carregarDados(): Promise<void> {
    this.loading = true;
    try {
      await Promise.all([
        this.carregarLucros(),
        this.carregarLivros(),
        this.carregarStatusDistribuicao()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      this.loading = false;
    }
  }

  async carregarAvaliacoes(): Promise<void> {
    this.loadingAvaliacoes = true;
    try {
      const token = this.authService.getToken();
      const response = await fetch('/api/avaliacoes/todas', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      if (response.ok) {
        const avaliacoes = await response.json();
        this.processarAvaliacoes(avaliacoes);
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      this.loadingAvaliacoes = false;
    }
  }

  processarAvaliacoes(avaliacoes: any[]): void {
    if (avaliacoes.length === 0) {
      this.statsAvaliacoes = {
        mediaGeral: 0,
        totalAvaliacoes: 0,
        notaMaxima: 0,
        notaMinima: 0
      };
      this.rankingLivros = [];
      this.distribuicaoNotas = [];
      return;
    }

    const notas = avaliacoes.map(a => a.nota);
    const mediaGeral = notas.reduce((a, b) => a + b, 0) / notas.length;
    const notaMaxima = Math.max(...notas);
    const notaMinima = Math.min(...notas);

    this.statsAvaliacoes = {
      mediaGeral: mediaGeral,
      totalAvaliacoes: avaliacoes.length,
      notaMaxima: notaMaxima,
      notaMinima: notaMinima
    };

    const livroMap: any = {};
    for (const av of avaliacoes) {
      const livroId = av.livro.id;
      if (!livroMap[livroId]) {
        livroMap[livroId] = {
          id: livroId,
          titulo: av.livro.titulo,
          notas: [],
          total: 0
        };
      }
      livroMap[livroId].notas.push(av.nota);
      livroMap[livroId].total++;
    }

    this.rankingLivros = Object.values(livroMap).map((item: any) => ({
      id: item.id,
      titulo: item.titulo,
      media: item.notas.reduce((a: number, b: number) => a + b, 0) / item.notas.length,
      total: item.total
    })).sort((a, b) => b.media - a.media);

    this.totalRecordsRanking = this.rankingLivros.length;
    this.atualizarRankingPaginado();

    const distribuicao: any = {};
    for (const nota of notas) {
      const chave = Math.round(nota * 2) / 2;
      if (!distribuicao[chave]) {
        distribuicao[chave] = 0;
      }
      distribuicao[chave]++;
    }

    const total = Object.values(distribuicao).reduce((a: any, b: any) => a + b, 0) as number;
    this.distribuicaoNotas = Object.keys(distribuicao).map(key => ({
      nota: parseFloat(key),
      total: distribuicao[key],
      percentual: (distribuicao[key] / total) * 100
    })).sort((a, b) => b.nota - a.nota);
  }

  atualizarRankingPaginado(): void {
    const start = this.firstRanking;
    const end = Math.min(start + this.rowsRanking, this.totalRecordsRanking);
    this.rankingLivrosPaginados = this.rankingLivros.slice(start, end);
  }

  onPageChangeRanking(event: any): void {
    this.firstRanking = event.first;
    this.rowsRanking = event.rows;
    this.atualizarRankingPaginado();
  }

  getCorNota(nota: number): string {
    if (nota >= 4.5) return '#22c55e';
    if (nota >= 4) return '#84cc16';
    if (nota >= 3) return '#fbbf24';
    if (nota >= 2) return '#fb923c';
    return '#ef4444';
  }

  async carregarLucros(): Promise<void> {
    try {
      const data = await this.adminService.getLucros().toPromise();
      if (Array.isArray(data)) {
        this.lucros = data;
        this.lucrosFiltrados = data;
        this.maxLucro = Math.max(...data.map((item: any) => Number(item[2])), 0);
        this.atualizarStats(data);
        this.atualizarPaginacaoLucros();
      }
    } catch (error) {
      console.error('Erro ao carregar lucros:', error);
    }
  }

  atualizarPaginacaoLucros(): void {
    this.totalRecordsLucro = this.lucrosFiltrados.length;
    const start = this.firstLucro;
    const end = Math.min(start + this.rowsLucro, this.totalRecordsLucro);
    this.lucrosPaginados = this.lucrosFiltrados.slice(start, end);
  }

  onPageChangeLucro(event: any): void {
    this.firstLucro = event.first;
    this.rowsLucro = event.rows;
    this.atualizarPaginacaoLucros();
  }

  onFiltroLivroChange(): void {
    this.lucrosFiltrados = this.filtroLivro === 'todos'
      ? this.lucros
      : this.lucros.filter((item: any) => item[0] === this.filtroLivro);

    this.maxLucro = Math.max(...this.lucrosFiltrados.map((item: any) => Number(item[2])), 0);
    this.atualizarStats(this.lucrosFiltrados);

    this.firstLucro = 0;
    this.atualizarPaginacaoLucros();
  }

  async carregarLivros(): Promise<void> {
    try {
      const data = await this.adminService.getLivros().toPromise();
      const livros = data?.livros || [];
      this.livrosOptions = livros.map((l: any) => l.titulo);
      this.stats.totalLivros = livros.length;
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    }
  }

  async carregarStatusDistribuicao(): Promise<void> {
    try {
      const pedidos = await this.adminService.getVendas().toPromise();
      const statusMap: any = {};
      (pedidos || []).forEach((p: any) => {
        const status = p.status || 'DESCONHECIDO';
        if (!statusMap[status]) statusMap[status] = 0;
        statusMap[status]++;
      });

      const total = Object.values(statusMap).reduce((a: any, b: any) => a + b, 0) as number;
      this.statusDistribuicao = Object.keys(statusMap).map(key => ({
        status: key,
        total: statusMap[key],
        percentual: (statusMap[key] / total) * 100
      }));

      this.stats.totalPedidos = total;
    } catch (error) {
      console.error('Erro ao carregar distribuição de status:', error);
    }
  }

  getLucroPercent(valor: number): number {
    if (this.maxLucro === 0) return 0;
    return (Number(valor) / this.maxLucro) * 100;
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'EM_PROCESSAMENTO': 'Em Processamento',
      'EM_TRANSITO': 'Em Trânsito',
      'ENTREGUE': 'Entregue',
      'DEVOLUCAO': 'Devolução',
      'DEVOLVIDO': 'Devolvido',
      'TROCADO': 'Trocado',
      'CANCELADO': 'Cancelado'
    };
    return labels[status] || status;
  }

  atualizarStats(data: any[]): void {
    if (data && data.length > 0) {
      const totalVendas = data.reduce((sum: number, item: any) => sum + item[1], 0);
      const totalLucro = data.reduce((sum: number, item: any) => sum + Number(item[2]), 0);
      this.stats.totalVendas = totalVendas;
      this.stats.lucroTotal = totalLucro;
    } else {
      this.stats.totalVendas = 0;
      this.stats.lucroTotal = 0;
    }
  }

  async carregarGrafico(): Promise<void> {
    try {
      const pedidos = await this.adminService.getVendas().toPromise();
      this.processarDadosGrafico(pedidos || []);
    } catch (error) {
      console.error('Erro ao carregar gráfico:', error);
    }
  }

  processarDadosGrafico(pedidos: any[]): void {
    const period = this.filtros.periodo;
    const status = this.filtros.status;
    const livro = this.filtros.livro;

    let filtered = status === 'todos' ? pedidos : pedidos.filter((p: any) => p.status === status);

    if (livro) {
      filtered = filtered.filter((pedido: any) => {
        return pedido.itens?.some((item: any) =>
          item.livro?.titulo === livro || item.livroId == livro
        );
      });
    }

    const grouped = this.agruparPorPeriodo(filtered, period);
    const labels = Object.keys(grouped);
    const data = Object.values(grouped).map((group: any) =>
      group.reduce((sum: number, pedido: any) => sum + (pedido.valorTotal || 0), 0)
    );

    if (data.length === 0 || data.every(v => v === 0)) {
      this.destroyChart();
      return;
    }

    this.renderChart(labels, data);
  }

  agruparPorPeriodo(pedidos: any[], period: string): any {
    const groups: any = {};
    pedidos.forEach((pedido: any) => {
      const date = new Date(pedido.dataPedido);
      let key: string;
      switch(period) {
        case 'day': key = date.toLocaleDateString('pt-BR'); break;
        case 'week': {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = 'Sem ' + weekStart.toLocaleDateString('pt-BR');
          break;
        }
        case 'month': key = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }); break;
        case 'year': key = date.getFullYear().toString(); break;
        default: key = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      }
      if (!groups[key]) groups[key] = [];
      groups[key].push(pedido);
    });
    return groups;
  }

  renderChart(labels: string[], data: number[]): void {
    const ctx = this.salesChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.destroyChart();

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.6)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0.05)');

    const isBar = this.filtros.chartType === 'bar';

    this.chart = new Chart(ctx, {
      type: isBar ? 'bar' : 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Vendas (R$)',
          data: data,
          backgroundColor: isBar ? 'rgba(79, 70, 229, 0.7)' : gradient,
          borderColor: '#4f46e5',
          borderWidth: 3,
          tension: 0.4,
          fill: !isBar,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              font: { family: 'Montserrat, sans-serif', size: 12 },
              color: '#4a5a6a'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                return 'R$ ' + context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: any) {
                return 'R$ ' + value.toLocaleString('pt-BR');
              },
              font: { family: 'Montserrat, sans-serif' }
            },
            grid: { color: 'rgba(0,0,0,0.06)' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Montserrat, sans-serif', size: 11 } }
          }
        }
      }
    });
  }

  get temDados(): boolean {
    return this.stats.totalVendas > 0 || this.stats.lucroTotal > 0;
  }

  destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  async aplicarFiltros(): Promise<void> {
    this.filtrando = true;
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.carregarGrafico();
    this.filtrando = false;
  }

  async limparFiltros(): Promise<void> {
    this.filtrando = true;
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.filtros = {
      periodo: 'month',
      status: 'todos',
      livro: '',
      chartType: 'line',
      dataInicio: '',
      dataFim: ''
    };
    this.carregarGrafico();
    this.filtrando = false;
  }

  exportarPDF(): void {
    window.print();
  }

  arredondarNota(nota: number): number {
  return Math.round(nota);
}

  exportarExcel(): void {
    const dados = [
      ['Métrica', 'Valor'],
      ['Total de Livros', this.stats.totalLivros],
      ['Vendas Totais', this.stats.totalVendas],
      ['Lucro Total', this.stats.lucroTotal],
      ['Total de Pedidos', this.stats.totalPedidos],
      ['Nota Média Geral', this.statsAvaliacoes.mediaGeral],
      ['Total de Avaliações', this.statsAvaliacoes.totalAvaliacoes],
      ['Maior Nota', this.statsAvaliacoes.notaMaxima],
      ['Menor Nota', this.statsAvaliacoes.notaMinima]
    ];

    let csv = dados.map(row => row.join(';')).join('\n');
    csv += '\n\nRanking de Livros por Avaliação\n';
    csv += 'Livro;Média;Total de Avaliações\n';
    for (const item of this.rankingLivros) {
      csv += `${item.titulo};${item.media.toFixed(1)};${item.total}\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `dashboard_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}

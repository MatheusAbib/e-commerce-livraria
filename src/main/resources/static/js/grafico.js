             let salesChart;
        let allPedidosGlobal = [];

        document.addEventListener('DOMContentLoaded', () => {
            carregarLivros();  // Carregar livros para o filtro
            loadData();
            
            // Efeito de onda no botão
            const refreshBtn = document.getElementById('refresh-btn');
            refreshBtn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const wave = document.createElement('span');
                wave.className = 'wave';
                wave.style.left = x + 'px';
                wave.style.top = y + 'px';
                this.appendChild(wave);
                
                setTimeout(() => wave.remove(), 600);
            });
        });

        // Função para carregar livros e preencher select
        async function carregarLivros() {
            try {
                const res = await fetch('/api/livros/consulta');
                if (!res.ok) throw new Error('Erro ao carregar livros');
                const data = await res.json();
                const livros = data.livros || [];
                const select = document.getElementById('livros-filter');

                // Limpa as opções antigas (exceto "Todos os Livros")
                select.innerHTML = '<option value="" selected>Todos os Livros</option>';

                livros.forEach(livro => {
                    const option = document.createElement('option');
                    option.value = livro.id;
                    option.textContent = livro.titulo;
                    select.appendChild(option);
                });
            } catch (error) {
                console.error('Erro ao carregar livros:', error);
                alert('Não foi possível carregar a lista de livros.');
            }
        }

async function loadData() {
    try {
        const statusSelecionado = document.getElementById('status-filter').value;
        const livroSelecionado = document.getElementById('livros-filter').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        const response = await fetch('/api/pedidos/todos');
        if (!response.ok) throw new Error('Erro ao carregar dados');
        
        allPedidosGlobal = await response.json();

        // Filtra por status
        let filteredPedidos = statusSelecionado === 'todos' 
            ? allPedidosGlobal 
            : allPedidosGlobal.filter(p => p.status === statusSelecionado);

        // Filtra por livro
        if (livroSelecionado) {
            filteredPedidos = filteredPedidos.filter(pedido => {
                return pedido.itens && pedido.itens.some(item => {
                    return item.livroId == livroSelecionado || 
                           (item.livro && item.livro.id == livroSelecionado);
                });
            });
        }

        // 🔹 Filtra por intervalo de datas
        if (startDate) {
            const start = new Date(startDate);
            filteredPedidos = filteredPedidos.filter(p => new Date(p.dataPedido) >= start);
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // inclui o dia todo
            filteredPedidos = filteredPedidos.filter(p => new Date(p.dataPedido) <= end);
        }

        processAndDisplayData(filteredPedidos, livroSelecionado);
    } catch (error) {
        console.error('Erro:', error);
        alert('Não foi possível carregar os dados de vendas');
    }
}


function processAndDisplayData(pedidos, livroSelecionado = null) {
    const period = document.getElementById('time-period').value;
    const chartType = document.getElementById('chart-type').value;
    
    const groupedData = groupDataByPeriod(pedidos, period);
    
    const labels = Object.keys(groupedData);
    const data = Object.values(groupedData).map(group => {
        return group.reduce((sum, pedido) => {
            if (!livroSelecionado) {
                return sum + (pedido.valorTotal || 0);
            }
            
            if (pedido.itens) {
                const valorItensFiltrados = pedido.itens
                    .filter(item => {
                        return item.livroId == livroSelecionado || 
                               (item.livro && item.livro.id == livroSelecionado);
                    })
                    .reduce((itemSum, item) => {
                        const preco = Number(item.preco || 
                                      (item.livro && item.livro.precoVenda) || 
                                      0);
                        const quantidade = Number(item.quantidade || 1);
                        return itemSum + (preco * quantidade);
                    }, 0);
                return sum + valorItensFiltrados;
            }
            return sum;
        }, 0);
    });
    
    // Verifica se há dados para mostrar
    if (data.length === 0 || data.every(val => val === 0)) {
        mostrarNotificacao(
            'Filtro sem resultados', 
            'Nenhum dado encontrado com os filtros selecionados', 
            'warning'
        );
        // Não destrói o gráfico, apenas retorna
        return;
    }
    
    let label = `Vendas (${getPeriodLabel(period)})`;
    if (livroSelecionado) {
        const livroSelecionadoElement = document.getElementById('livros-filter');
        const livroNome = livroSelecionadoElement.options[livroSelecionadoElement.selectedIndex].text;
        label += ` - ${livroNome}`;
    }
    
    updateChart(labels, data, chartType, label);
}

        function groupDataByPeriod(pedidos, period) {
            const groups = {};
            
            pedidos.forEach(pedido => {
                const date = new Date(pedido.dataPedido);
                let key;
                
                switch(period) {
                    case 'day':
                        key = date.toLocaleDateString('pt-BR');
                        break;
                    case 'week':
                        const weekStart = new Date(date);
                        weekStart.setDate(date.getDate() - date.getDay());
                        key = `Semana ${weekStart.toLocaleDateString('pt-BR')}`;
                        break;
                    case 'month':
                        key = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                        break;
                    case 'year':
                        key = date.getFullYear().toString();
                        break;
                }
                
                if (!groups[key]) groups[key] = [];
                groups[key].push(pedido);
            });
            
            return groups;
        }

        function getPeriodLabel(period) {
            switch(period) {
                case 'day': return 'Dia';
                case 'week': return 'Semana';
                case 'month': return 'Mês';
                case 'year': return 'Ano';
                default: return '';
            }
        }

        function updateChart(labels, data, chartType, label) {
            const ctx = document.getElementById('salesChart').getContext('2d');
            
            if (salesChart) {
                salesChart.destroy();
            }
            
            const gradient = ctx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(67, 97, 238, 0.8)');
            gradient.addColorStop(1, 'rgba(76, 201, 240, 0.2)');
            
            salesChart = new Chart(ctx, {
                type: chartType,
                data: {
                    labels: labels,
                    datasets: [{
                        label: label,
                        data: data,
                        backgroundColor: gradient,
                        borderColor: 'rgba(67, 97, 238, 1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: 'white',
                        pointBorderColor: 'rgba(67, 97, 238, 1)',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    family: 'Poppins',
                                    size: 14,
                                    weight: '500'
                                },
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(43, 45, 66, 0.9)',
                            titleFont: {
                                family: 'Poppins',
                                size: 14,
                                weight: 'bold'
                            },
                            bodyFont: {
                                family: 'Poppins',
                                size: 12
                            },
                            padding: 12,
                            cornerRadius: 8,
                            displayColors: true,
                            callbacks: {
                                label: function(context) {
                                    return 'R$ ' + context.raw.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                font: {
                                    family: 'Poppins',
                                    size: 12
                                },
                                callback: function(value) {
                                    return 'R$ ' + value.toLocaleString('pt-BR');
                                }
                            },
                            title: {
                                display: true,
                                text: 'Valor Total (R$)',
                                font: {
                                    family: 'Poppins',
                                    size: 14,
                                    weight: '600'
                                },
                                padding: {top: 20, bottom: 10}
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                font: {
                                    family: 'Poppins',
                                    size: 12
                                }
                            },
                            title: {
                                display: true,
                                text: 'Período',
                                font: {
                                    family: 'Poppins',
                                    size: 14,
                                    weight: '600'
                                },
                                padding: {top: 10, bottom: 20}
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeOutQuart'
                    },
                    elements: {
                        bar: {
                            borderRadius: 8,
                            borderSkipped: 'bottom'
                        }
                    }
                }
            });
        }

        // Atualiza os dados ao mudar filtros
        document.getElementById('status-filter').addEventListener('change', loadData);
        document.getElementById('time-period').addEventListener('change', loadData);
        document.getElementById('chart-type').addEventListener('change', loadData);
        document.getElementById('livros-filter').addEventListener('change', loadData);

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.toggle('show');
        }

        function mostrarNotificacao(titulo, mensagem, tipo = 'info') {
    // Cria o elemento da notificação
    const toast = document.createElement('div');
    toast.className = `notificacao-toast ${tipo}`;
    
    // Ícone baseado no tipo
    let iconClass;
    switch(tipo) {
        case 'error':
            iconClass = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            iconClass = 'fas fa-exclamation-triangle';
            break;
        default:
            iconClass = 'fas fa-info-circle';
    }
    
    toast.innerHTML = `
        <i class="${iconClass} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${titulo}</div>
            <div class="toast-message">${mensagem}</div>
        </div>
    `;
    
    // Adiciona ao corpo do documento
    document.body.appendChild(toast);
    
    // Mostra a notificação
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Remove após 5 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
    
    // Fecha ao clicar
    toast.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
}
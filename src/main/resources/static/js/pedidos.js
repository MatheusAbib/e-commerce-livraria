  let pedidosDevolucao = [];
    let pedidosCache = [];
    let intervaloMonitoramento = null;

    document.addEventListener('DOMContentLoaded', async () => {
      const devolucoesSalvas = localStorage.getItem('pedidosDevolucao');
      pedidosDevolucao = devolucoesSalvas ? JSON.parse(devolucoesSalvas) : [];
      let clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

      if (!clienteLogado || !clienteLogado.id) {
        alert('Você precisa estar logado para visualizar seus pedidos.');
        window.location.href = 'login.html';
        return;
      }

      const clienteId = clienteLogado.id;

      try {
        const response = await fetch(`/api/pedidos?clienteId=${clienteId}`);
        if (!response.ok) throw new Error('Erro ao carregar pedidos');

        pedidosCache = await response.json();
        console.log('Pedidos recebidos:', pedidosCache);
        
        exibirPedidosFiltrados(pedidosCache, false);
      } catch (error) {
        console.error('Erro:', error);
        document.getElementById('pedidos-container').innerHTML = `
          <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Não foi possível carregar seus pedidos.</p>
            <p>Detalhes: ${error.message}</p>
          </div>
        `;
      }

      // Configura eventos das abas
      document.getElementById('tab-pedidos').addEventListener('click', () => {
        setActiveTab('pedidos');
        exibirPedidosFiltrados(pedidosCache, false); 
      });

      document.getElementById('tab-historico').addEventListener('click', () => {
        setActiveTab('historico');
        exibirPedidosFiltrados(pedidosCache, true);
      });

      document.getElementById('tab-devolucao').addEventListener('click', () => {
        setActiveTab('devolucao');
        const pedidosDevolucao = pedidosCache.filter(p => p.status === 'DEVOLUCAO');
        exibirPedidos(pedidosDevolucao);
      });

      document.getElementById('tab-devolvidos').addEventListener('click', () => {
        setActiveTab('devolvidos');
        const pedidosDevolvidos = pedidosCache.filter(p => p.status === 'DEVOLVIDO');
        exibirPedidos(pedidosDevolvidos);
      });

      document.getElementById('tab-trocados').addEventListener('click', () => {
        setActiveTab('trocados');
        const pedidosTrocados = pedidosCache.filter(p => p.status === 'TROCADO');
        exibirPedidos(pedidosTrocados);
      });

      document.getElementById('tab-cancelado').addEventListener('click', () => {
        setActiveTab('cancelado');
        const pedidosCancelados = pedidosCache.filter(p => p.status === 'CANCELADO');
        exibirPedidos(pedidosCancelados);
      });

      // Configura notificações
      const notificacaoIcon = document.getElementById('notificacao-icon');
      if (notificacaoIcon) {
        notificacaoIcon.addEventListener('click', function(e) {
          exibirNotificacoes(e);
        });
      }

      document.addEventListener('click', () => {
        const dropdown = document.getElementById('notificacao-dropdown');
        if (dropdown && dropdown.style.display === 'block') {
          dropdown.style.display = 'none';
        }
      });

      const dropdown = document.getElementById('notificacao-dropdown');
      if (dropdown) {
        dropdown.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }

      atualizarBadgeNotificacao();
      verificarCuponsTroca();
      monitorarMudancasStatus();
      intervaloMonitoramento = setInterval(monitorarMudancasStatus, 120000);
    });

    function setActiveTab(tab) {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.getElementById(`tab-${tab}`).classList.add('active');
    }

    function exibirPedidosFiltrados(pedidos, mostrarEntregues) {
      const pedidosFiltrados = pedidos.filter(pedido => 
        mostrarEntregues 
          ? pedido.status === 'ENTREGUE' 
          : (pedido.status !== 'ENTREGUE' && 
             pedido.status !== 'DEVOLUCAO' && 
             pedido.status !== 'DEVOLVIDO' && 
             pedido.status !== 'CANCELADO' && 
             pedido.status !== 'TROCADO')
      );
      exibirPedidos(pedidosFiltrados);
    }

    function exibirPedidos(pedidos) {
      const container = document.getElementById('pedidos-container');

      if (!pedidos || pedidos.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-box-open"></i>
            <p>Nenhum pedido encontrado nesta categoria</p>
            <a href="principal.html" class="btn-voltar">Voltar às compras</a>
          </div>
        `;
        return;
      }

container.innerHTML = pedidos.map(pedido => {
    // Usamos os valores já calculados e persistidos no backend
    const subtotal = pedido.valorSubtotal || 0;
    const frete = pedido.valorFrete || 0;
    const desconto = pedido.valorDesconto || 0;
    const total = pedido.valorTotal || 0; // Sempre usamos o valor persistido
    const codigoCupom = pedido.codigoCupom || '';

    // Função para formatar valores monetários
    const formatarMoeda = (valor) => {
        return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
    };

    return `
    <div class="pedido-card" data-id="${pedido.id}">
      <div class="pedido-header">
        <div>
          <span class="pedido-id">Pedido #${pedido.id}</span>
          <span class="pedido-data">${new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}</span>
        </div>
        <span class="pedido-status ${getStatusClass(pedido.status)}">
          ${formatStatus(pedido.status)}
        </span>
      </div>

      <div class="pedido-produtos">
        ${(pedido.itens || []).map(item => `
          <div class="produto-item">
            <img src="${item.livro?.imagemUrl || 'img/livro-placeholder.jpg'}" class="produto-imagem" />
            <div class="produto-info">
              <div class="produto-nome">${item.livro?.titulo || 'Livro desconhecido'}</div>
              <div>Quantidade: ${item.quantidade || 1}</div>
              <div class="produto-preco">${formatarMoeda(item.precoUnitario || 0)}</div>
            </div>
          </div>
        `).join('')}
      </div>

      ${pedido.status === 'DEVOLUCAO' && pedido.motivoDevolucao ? `
      <div class="motivo-devolucao">
        <strong>Motivo da devolução:</strong>
        <p>${pedido.motivoDevolucao}</p>
      </div>
      ` : ''}

      <div class="pedido-total">
        Subtotal: ${formatarMoeda(subtotal)} <br />
        Frete: ${formatarMoeda(frete)} <br />
        ${desconto > 0 ? `
          Desconto: -${formatarMoeda(desconto)} ${codigoCupom ? `(Cupom: ${codigoCupom})` : ''} <br />
        ` : ''}
        <strong>Total: ${formatarMoeda(total)}</strong>
      </div>

          <div class="pedido-acoes">
            ${pedido.status !== 'ENTREGUE' && pedido.status !== 'DEVOLUCAO' && 
              pedido.status !== 'DEVOLVIDO' && pedido.status !== 'CANCELADO' && 
              pedido.status !== 'TROCADO' ? `
              
              ${(pedido.status === 'EM_PROCESSAMENTO') ? `
                <button class="btn-acao btn-cancelar" onclick="cancelarPedido('${pedido.id}')">
                  <i class="fas fa-times"></i> Cancelar Pedido
                </button>
              ` : ''}

              ${pedido.status === 'EM_TRANSITO' ? `
                <button class="btn-acao btn-entregue" onclick="atualizarStatusPedido('${pedido.id}', 'ENTREGUE')">
                  <i class="fas fa-check"></i> Marcar como Entregue
                </button>
              ` : ''}
            ` : ''}

            ${pedido.status === 'ENTREGUE' ? `
              <button class="btn-acao btn-devolucao" onclick="solicitarDevolucao(${pedido.id})">
                <i class="fas fa-undo"></i> Solicitar Devolução
              </button>
            ` : ''}

            ${pedido.status === 'DEVOLVIDO' ? `
              <button class="btn-acao btn-confirmar-troca" onclick="atualizarStatusPedido('${pedido.id}', 'TROCADO')">
                <i class="fas fa-check"></i> Confirmar Troca
              </button>
            ` : ''}

            ${pedido.status === 'CANCELADO' ? `
              <button class="btn-acao btn-excluir" title="Excluir pedido" onclick="excluirPedidoCancelado('${pedido.id}')">
                <i class="fas fa-trash"></i> Excluir
              </button>
            ` : ''}

            ${pedido.status === 'TROCADO' ? `
              <div class="troca-cupom-container">
                <p style="margin-bottom: 10px;">Você tem direito a um cupom de troca:</p>
                <button class="btn-gerar-cupom-troca" onclick="gerarCupomTroca('${pedido.id}')">
                  <i class="fas fa-tag"></i> Gerar Cupom de Troca
                </button>
                <div id="cupom-troca-${pedido.id}" style="display: none; margin-top: 10px;">
                  <!-- Aqui será exibido o cupom quando gerado -->
                </div>
              </div>
            ` : ''}
          </div>
        </div>
        `;
      }).join('');

      verificarCuponsTroca();
    }

    function formatStatus(status) {
      switch (status) {
        case 'EM_PROCESSAMENTO': return 'Em Processamento';
        case 'EM_TRANSITO': return 'Em Trânsito';
        case 'ENTREGUE': return 'Entregue';
        case 'DEVOLUCAO': return 'Em Devolução';
        case 'DEVOLVIDO': return 'Devolvido';
        case 'TROCADO': return 'Trocado';
        case 'CANCELADO': return 'Cancelado';
        default: return status;
      }
    }

    function getStatusClass(status) {
      switch (status) {
        case 'EM_PROCESSAMENTO': return 'status-pendente';
        case 'EM_TRANSITO': return 'status-envio';
        case 'ENTREGUE': return 'status-entregue';
        case 'DEVOLUCAO': return 'status-devolucao';
        case 'DEVOLVIDO': return 'status-devolvido';
        case 'CANCELADO': return 'status-cancelado';
        case 'TROCADO': return 'status-trocado';
        default: return 'status-pendente';
      }
    }

function solicitarDevolucao(pedidoId) {
  console.log("ID do pedido recebido:", pedidoId, "Tipo:", typeof pedidoId);
  
  // Converta para número se necessário
  pedidoId = typeof pedidoId === 'string' ? parseInt(pedidoId) : pedidoId;
  
  const modal = document.getElementById('modal-devolucao');
  const itensContainer = document.getElementById('itens-devolucao-container');
  document.getElementById('pedido-id-devolucao').value = pedidoId;
  document.getElementById('motivo-devolucao').value = '';
  
  // Encontrar o pedido no cache com comparação não estrita
  const pedido = pedidosCache.find(p => p.id == pedidoId);  // Note o == em vez de ===
  
  if (!pedido) {
    console.error("Pedido não encontrado no cache. IDs disponíveis:", 
                 pedidosCache.map(p => p.id));
    alert('Pedido não encontrado');
    return;
  }
  // Limpar container
  itensContainer.innerHTML = '';
  
  // Adicionar itens com checkboxes
  pedido.itens.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-devolucao';
    itemDiv.innerHTML = `
      <label>
        <input type="checkbox" name="item-devolucao" value="${index}" data-item-id="${item.id}">
        ${item.livro?.titulo || 'Livro desconhecido'} - 
        Quantidade: ${item.quantidade} - 
        R$ ${item.precoUnitario.toFixed(2)}
      </label>
      <div class="quantidade-devolucao" style="display: none; margin-top: 5px;">
        <label>Quantidade a devolver:</label>
        <input type="number" min="1" max="${item.quantidade}" value="${item.quantidade}" 
               class="quantidade-input" data-item-id="${item.id}">
      </div>
    `;
    itensContainer.appendChild(itemDiv);
    
    // Adicionar evento para mostrar quantidade quando selecionado
    const checkbox = itemDiv.querySelector('input[type="checkbox"]');
    const quantidadeDiv = itemDiv.querySelector('.quantidade-devolucao');
    checkbox.addEventListener('change', () => {
      quantidadeDiv.style.display = checkbox.checked ? 'block' : 'none';
    });
  });
  
  modal.style.display = 'block';
}
function fecharModalDevolucao() {
  document.getElementById('modal-devolucao').style.display = 'none';
}

// Adicione o evento de submit do formulário
document.getElementById('form-devolucao').addEventListener('submit', async function(e) {
  e.preventDefault();

  const pedidoId = Number.parseInt(document.getElementById('pedido-id-devolucao').value, 10);
  const motivo = document.getElementById('motivo-devolucao').value;
  const checkboxes = document.querySelectorAll('input[name="item-devolucao"]:checked');

const itensDevolucao = Array.from(checkboxes).map(checkbox => {
    const rawId = checkbox.dataset.itemId;
    const itemPedidoId = Number.parseInt(rawId, 10);
    const quantidadeInput = document.querySelector(`.quantidade-input[data-item-id="${rawId}"]`);
    const quantidade = Number.parseInt(quantidadeInput?.value ?? '1', 10);

    if (Number.isNaN(itemPedidoId)) {
        throw new Error('Item da devolução sem ID válido.');
    }
    if (!Number.isInteger(quantidade) || quantidade < 1) {
        throw new Error('Quantidade inválida para um dos itens selecionados.');
    }

    return { itemPedidoId, quantidade };
});

  if (!motivo || !motivo.trim()) {
    alert('Informe o motivo da devolução.');
    return;
  }
  if (itensDevolucao.length === 0) {
    alert('Selecione ao menos um item.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/pedidos/${pedidoId}/devolucao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ motivo, itens: itensDevolucao })
    });

    if (!response.ok) {
      let errText = 'Erro ao solicitar devolução';
      try {
        const data = await response.json();
        errText = data.mensagem || data.message || JSON.stringify(data);
      } catch {
        errText = await response.text();
      }
      throw new Error(errText);
    }

    const updatedPedido = await response.json();
    const index = pedidosCache.findIndex(p => p.id === updatedPedido.id);
    if (index !== -1) pedidosCache[index] = updatedPedido;

    document.getElementById('modal-devolucao').style.display = 'none';

    const currentTab = document.querySelector('.tab.active').id;
    if (currentTab === 'tab-pedidos') {
      exibirPedidosFiltrados(pedidosCache, false);
    } else if (currentTab === 'tab-historico') {
      exibirPedidosFiltrados(pedidosCache, true);
    } else if (currentTab === 'tab-devolucao') {
      exibirPedidos(pedidosCache.filter(p => p.status === 'DEVOLUCAO'));
    }

    alert('Devolução solicitada com sucesso!');
  } catch (error) {
    console.error('Erro ao solicitar devolução:', error);
    alert(`Erro: ${error.message}`);
  }
});



    async function atualizarStatusPedido(pedidoId, novoStatus) {
  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/pedidos/${pedidoId}/status`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ novoStatus })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar status');
    }

    const updatedPedido = await response.json();
    const index = pedidosCache.findIndex(p => p.id === updatedPedido.id);
    if (index !== -1) {
      pedidosCache[index] = updatedPedido;
    }

    if (novoStatus === 'CANCELADO' || novoStatus === 'TROCADO') {
      try {
        const estoqueResponse = await fetch(`/api/estoque/reentrada`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ pedidoId })
        });
        if (!estoqueResponse.ok) {
          console.warn(`Falha ao reentrar estoque do pedido ${pedidoId}`);
        }
      } catch (e) {
        console.error(`Erro na reentrada de estoque para o pedido ${pedidoId}:`, e);
      }
    }
    
    const mensagem = getMensagemStatus(novoStatus, pedidoId);
    adicionarNotificacao(
      'Status do pedido atualizado',
      mensagem,
      'pedido'
    );
    
    // Recarrega os pedidos da aba atual sem mudar de tab
    const currentTab = document.querySelector('.tab.active').id;
    if (currentTab === 'tab-pedidos') {
      exibirPedidosFiltrados(pedidosCache, false);
    } else if (currentTab === 'tab-historico') {
      exibirPedidosFiltrados(pedidosCache, true);
    } else {
      // Para outras abas específicas (devolução, devolvidos, etc.)
      const statusMap = {
        'tab-devolucao': 'DEVOLUCAO',
        'tab-devolvidos': 'DEVOLVIDO',
        'tab-trocados': 'TROCADO',
        'tab-cancelado': 'CANCELADO'
      };
      const status = statusMap[currentTab];
      if (status) {
        const filtered = pedidosCache.filter(p => p.status === status);
        exibirPedidos(filtered);
      }
    }
    
    return updatedPedido;
    
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    adicionarNotificacao(
      'Erro ao atualizar pedido',
      `Não foi possível atualizar o status do pedido #${pedidoId}: ${error.message}`,
      'error'
    );
    throw error;
  }
}

    function getMensagemStatus(status, pedidoId) {
      switch (status) {
        case 'EM_PROCESSAMENTO': return `Pedido #${pedidoId} está em processamento`;
        case 'EM_TRANSITO': return `Pedido #${pedidoId} saiu para entrega`;
        case 'ENTREGUE': return `Pedido #${pedidoId} foi entregue`;
        case 'CANCELADO': return `Pedido #${pedidoId} foi cancelado`;
        case 'DEVOLUCAO': return `Devolução solicitada para o pedido #${pedidoId}`;
        case 'DEVOLVIDO': return `Pedido #${pedidoId} foi devolvido`;
        case 'TROCADO': return `Troca realizada para o pedido #${pedidoId}`;
        default: return `Status do pedido #${pedidoId} foi atualizado`;
      }
    }

async function cancelarPedido(pedidoId) {
  if (!confirm('Deseja realmente cancelar este pedido?')) {
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/pedidos/${pedidoId}/status`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ novoStatus: 'CANCELADO' })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao cancelar pedido');
    }

    const updatedPedido = await response.json();
    const index = pedidosCache.findIndex(p => p.id === updatedPedido.id);
    if (index !== -1) {
      pedidosCache[index] = updatedPedido;
    }

    adicionarNotificacao(
      'Pedido cancelado',
      `Seu pedido #${pedidoId} foi cancelado com sucesso.`,
      'pedido'
    );

    // Recarrega os pedidos da aba atual sem mudar para a tab de cancelados
    const currentTab = document.querySelector('.tab.active').id;
    if (currentTab === 'tab-pedidos') {
      exibirPedidosFiltrados(pedidosCache, false);
    } else if (currentTab === 'tab-historico') {
      exibirPedidosFiltrados(pedidosCache, true);
    }

    alert('Pedido cancelado com sucesso.');

  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    alert(`Erro: ${error.message}`);
  }
}

async function excluirPedidoCancelado(pedidoId) {
  if (!confirm('Deseja realmente excluir este pedido cancelado? Esta ação é irreversível.')) {
    return;
  }
  try {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`/api/pedidos/${pedidoId}`, {
      method: 'DELETE',
      headers: headers
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao excluir pedido');
    }
    alert('Pedido cancelado excluído com sucesso.');
    pedidosCache = pedidosCache.filter(p => p.id !== pedidoId);
    
    // Recarrega os pedidos da aba de cancelados (já que estamos excluindo um pedido cancelado)
    const pedidosCancelados = pedidosCache.filter(p => p.status === 'CANCELADO');
    exibirPedidos(pedidosCancelados);
  } catch (error) {
    console.error('Erro ao excluir pedido:', error);
    alert(`Erro: ${error.message}`);
  }
}

   function gerarCupomTroca(pedidoId) {
  const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
  if (!clienteLogado) {
    alert('Você precisa estar logado para gerar um cupom de troca!');
    return;
  }

  // Converte pedidoId para número (caso seja string)
  pedidoId = parseInt(pedidoId);
  
  // Encontra o pedido no cache
  const pedido = pedidosCache.find(p => p.id === pedidoId);
  
  if (!pedido) {
    alert('Pedido não encontrado no cache. Atualize a página e tente novamente.');
    return;
  }

  // Verifica se o pedido está com status TROCADO
  if (pedido.status !== 'TROCADO') {
    alert('Só é possível gerar cupom para pedidos com status TROCADO');
    return;
  }

  const cuponsPorUsuario = JSON.parse(localStorage.getItem('cuponsPorUsuario')) || {};
  const cuponsUsuario = cuponsPorUsuario[clienteLogado.id] || [];
  
  // Verifica se já existe cupom para este pedido
  const cupomExistente = cuponsUsuario.find(c => 
    c.origem === 'troca' && c.pedidoId === pedidoId
  );
  
  if (cupomExistente) {
    const valorDisponivel = cupomExistente.valor - cupomExistente.valorUsado;
    const cupomDiv = document.getElementById(`cupom-troca-${pedidoId}`);
    const botao = document.querySelector(`.btn-gerar-cupom-troca[onclick*="${pedidoId}"]`);
    
    if (cupomDiv && botao) {
      cupomDiv.innerHTML = `
        <div id="cupom-info-${pedidoId}">
          <p>Cupom: <strong id="codigo-cupom-troca-${pedidoId}" style="color: #28a745;">${cupomExistente.codigo}</strong></p>
          <p>Valor total: R$ ${cupomExistente.valor.toFixed(2)}</p>
          <p>Valor já utilizado: R$ ${cupomExistente.valorUsado.toFixed(2)}</p>
          <p>Valor disponível: <strong>R$ ${valorDisponivel.toFixed(2)}</strong></p>
          <p>Válido até: ${new Date(cupomExistente.dataExpiracao).toLocaleDateString('pt-BR')}</p>
          <p>Benefícios: Pode zerar sua compra + Frete Grátis</p>
        </div>
      `;
      cupomDiv.style.display = 'block';
      botao.disabled = true;
      botao.textContent = 'Cupom Gerado Anteriormente';
      botao.style.backgroundColor = '#6c757d';
    }
    return;
  }

  // Gera um código de cupom aleatório
  const codigoCupom = 'TROCA-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  
  // Calcula 20% do valor total do pedido (mínimo de R$ 50)
  const valorCupom = Math.max(pedido.valorTotal * 0.2, 50);
  
  const cupom = {
    id: Date.now(),
    codigo: codigoCupom,
    valor: valorCupom,
    tipo: 'credito',
    dataGeracao: new Date().toISOString(),
    dataExpiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    usado: false,
    valorUsado: 0,
    origem: 'troca',
    pedidoId: pedidoId,
    zerarFrete: true
  };

  // Adiciona o cupom ao usuário
  cuponsUsuario.push(cupom);
  cuponsPorUsuario[clienteLogado.id] = cuponsUsuario;
  localStorage.setItem('cuponsPorUsuario', JSON.stringify(cuponsPorUsuario));

  // Atualiza a UI imediatamente
  const cupomDiv = document.getElementById(`cupom-troca-${pedidoId}`);
  const botao = document.querySelector(`.btn-gerar-cupom-troca[onclick*="${pedidoId}"]`);
  
  if (cupomDiv && botao) {
    cupomDiv.innerHTML = `
      <div id="cupom-info-${pedidoId}">
        <p>Cupom: <strong id="codigo-cupom-troca-${pedidoId}" style="color: #28a745;">${codigoCupom}</strong></p>
        <p>Valor total: R$ ${valorCupom.toFixed(2)}</p>
        <p>Valor disponível: <strong>R$ ${valorCupom.toFixed(2)}</strong></p>
        <p>Válido até: ${new Date(cupom.dataExpiracao).toLocaleDateString('pt-BR')}</p>
        <p>Benefícios: Pode zerar sua compra + Frete Grátis</p>
      </div>
    `;
    cupomDiv.style.display = 'block';
    botao.disabled = true;
    botao.textContent = 'Cupom Gerado!';
    botao.style.backgroundColor = '#28a745';
  }
  
  // Notificação
  adicionarNotificacao(
    'Cupom de troca gerado',
    `Você gerou um cupom de troca no valor de R$ ${valorCupom.toFixed(2)} (${codigoCupom}) para o pedido #${pedidoId}. Válido por 30 dias!`,
    'cupom'
  );
  
  alert(`Cupom de troca gerado com sucesso!\n\nCódigo: ${codigoCupom}\nValor: R$ ${valorCupom.toFixed(2)}`);
}

function verificarCuponsTroca() {
  const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
  if (!clienteLogado) return;

  const cuponsPorUsuario = JSON.parse(localStorage.getItem('cuponsPorUsuario')) || {};
  const cuponsUsuario = cuponsPorUsuario[clienteLogado.id] || [];

  document.querySelectorAll('.pedido-card[data-id]').forEach(card => {
    const pedidoId = parseInt(card.getAttribute('data-id'));
    const cupomDiv = document.getElementById(`cupom-troca-${pedidoId}`);
    const botao = document.querySelector(`.btn-gerar-cupom-troca[onclick*="${pedidoId}"]`);
    
    if (!cupomDiv || !botao) return;

    const cupomExistente = cuponsUsuario.find(c => 
      c.origem === 'troca' && c.pedidoId === pedidoId
    );
    
    if (cupomExistente) {
      const valorDisponivel = cupomExistente.valor - cupomExistente.valorUsado;
      cupomDiv.innerHTML = `
        <div id="cupom-info-${pedidoId}">
          <p>Cupom: <strong id="codigo-cupom-troca-${pedidoId}" style="color: #28a745;">${cupomExistente.codigo}</strong></p>
          <p>Valor total: R$ ${cupomExistente.valor.toFixed(2)}</p>
          <p>Valor já utilizado: R$ ${cupomExistente.valorUsado.toFixed(2)}</p>
          <p>Valor disponível: <strong>R$ ${valorDisponivel.toFixed(2)}</strong></p>
          <p>Válido até: ${new Date(cupomExistente.dataExpiracao).toLocaleDateString('pt-BR')}</p>
          <p>Benefícios: Pode zerar sua compra + Frete Grátis</p>
        </div>
      `;
      cupomDiv.style.display = 'block';
      botao.disabled = true;
      botao.textContent = 'Cupom Gerado';
      botao.style.backgroundColor = '#6c757d';
    }
  });
}

    async function monitorarMudancasStatus() {
      try {
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
        if (!clienteLogado) return;
        
        const response = await fetch(`/api/pedidos?clienteId=${clienteLogado.id}`);
        if (!response.ok) throw new Error('Erro ao verificar pedidos');
        
        const novosPedidos = await response.json();
        
        novosPedidos.forEach(novoPedido => {
          const pedidoAntigo = pedidosCache.find(p => p.id === novoPedido.id);
          
          if (pedidoAntigo && pedidoAntigo.status !== novoPedido.status) {
            const mensagem = getMensagemStatus(novoPedido.status, novoPedido.id);
            adicionarNotificacao(
              `Status do pedido atualizado`,
              mensagem,
              'pedido'
            );
          }
        });
        
        pedidosCache = novosPedidos;
        
      } catch (error) {
        console.error('Erro ao monitorar pedidos:', error);
      }
    }

    /* Notificações */
    function exibirNotificacoes(event) {
      event.stopPropagation();
      
      const dropdown = document.getElementById('notificacao-dropdown');
      const list = document.getElementById('notificacao-list');
      const notificacoes = obterNotificacoesUsuario();
      
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      
      if (dropdown.style.display === 'block') {
        const ordenadas = [...notificacoes].sort((a, b) => {
          if (a.lida !== b.lida) return a.lida ? 1 : -1;
          return new Date(b.data) - new Date(a.data);
        });
        
        list.innerHTML = ordenadas.map(notificacao => `
          <div class="notificacao-item ${notificacao.lida ? '' : 'unread'}" 
               onclick="marcarComoLida(${notificacao.id}, this)">
            <div class="notificacao-titulo">${notificacao.titulo}</div>
            <div class="notificacao-mensagem">${notificacao.mensagem}</div>
            <div class="notificacao-data">${formatarData(notificacao.data)}</div>
          </div>
        `).join('');
      }
    }

    function formatarData(dataISO) {
      const data = new Date(dataISO);
      const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      };
      return data.toLocaleString('pt-BR', options);
    }

    function marcarComoLida(id, elemento) {
      let notificacoes = obterNotificacoesUsuario();
      
      notificacoes = notificacoes.map(n => 
        n.id === id ? {...n, lida: true} : n
      );
      
      salvarNotificacoesUsuario(notificacoes);
      
      if (elemento) {
        elemento.classList.remove('unread');
      }
      
      atualizarBadgeNotificacao();
    }

    function marcarTodasComoLidas() {
      let notificacoes = obterNotificacoesUsuario();
      
      notificacoes = notificacoes.map(n => ({...n, lida: true}));
      salvarNotificacoesUsuario(notificacoes);
      
      document.querySelectorAll('.notificacao-item.unread').forEach(item => {
        item.classList.remove('unread');
      });
      
      atualizarBadgeNotificacao();
    }

    function atualizarBadgeNotificacao() {
      const notificacoes = obterNotificacoesUsuario();
      const naoLidas = notificacoes.filter(n => !n.lida).length;
      const badge = document.getElementById('notificacao-badge');
      
      if (naoLidas > 0) {
        badge.style.display = 'flex';
        badge.textContent = naoLidas > 9 ? '9+' : naoLidas.toString();
      } else {
        badge.style.display = 'none';
      }
    }

    function obterNotificacoesUsuario() {
      const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
      if (!clienteLogado) return [];
      
      const notificacoesPorUsuario = JSON.parse(localStorage.getItem('notificacoesPorUsuario')) || {};
      return notificacoesPorUsuario[clienteLogado.id] || [];
    }

    function salvarNotificacoesUsuario(notificacoes) {
      const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
      if (!clienteLogado) return;
      
      const notificacoesPorUsuario = JSON.parse(localStorage.getItem('notificacoesPorUsuario')) || {};
      notificacoesPorUsuario[clienteLogado.id] = notificacoes;
      localStorage.setItem('notificacoesPorUsuario', JSON.stringify(notificacoesPorUsuario));
    }

    function adicionarNotificacao(titulo, mensagem, tipo = 'info') {
      const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
      if (!clienteLogado) return;
      
      const notificacoes = obterNotificacoesUsuario();
      
      const novaNotificacao = {
        id: Date.now(),
        titulo,
        mensagem,
        tipo,
        data: new Date().toISOString(),
        lida: false,
        pedidoId: tipo === 'pedido' ? mensagem.match(/#(\d+)/)?.[1] : null
      };
      
      notificacoes.unshift(novaNotificacao);
      salvarNotificacoesUsuario(notificacoes);
      atualizarBadgeNotificacao();
      
      if (document.visibilityState === 'visible') {
        mostrarNotificacaoToast(novaNotificacao);
      }
      
      return novaNotificacao;
    }

    function mostrarNotificacaoToast(notificacao) {
      const toast = document.createElement('div');
      toast.className = `notificacao-toast ${notificacao.tipo}`;
      toast.innerHTML = `
        <strong>${notificacao.titulo}</strong>
        <p>${notificacao.mensagem}</p>
      `;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      }, 5000);
    }

    // Estilo dinâmico para notificações toast
    const style = document.createElement('style');
    style.textContent = `
      .notificacao-toast {

        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 1200;
        max-width: 300px;
      }
      
      .notificacao-toast.show {
        transform: translateX(0);
      }
      
      .notificacao-toast.pedido {
        border-left: 4px solid var(--primary-color);
      }
      
      .notificacao-toast.error {
        border-left: 4px solid var(--danger-color);
      }
      
      .notificacao-toast.success {
        border-left: 4px solid var(--success-color);
      }
      
      .notificacao-toast.devolucao {
        border-left: 4px solid var(--warning-color);
      }
      
      .notificacao-toast.cupom {
        border-left: 4px solid var(--accent-color);
      }
    `;
    document.head.appendChild(style);

  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
  }

  function esconderLinksRestritos() {
    const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

    // IDs ou seletores dos links restritos na sidebar do pedidos.html
    const linksRestritos = [
      'usuarios.html',
      'log.html',
      'lucros.html',
      'livros.html'
    ];

    if (!clienteLogado || clienteLogado.perfil !== 'ADMIN') {
      // Para cada link restrito, esconde se encontrar na sidebar
      linksRestritos.forEach(href => {
        const link = document.querySelector(`.sidebar a[href="${href}"]`);
        if (link) link.style.display = 'none';
      });
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    esconderLinksRestritos();
  });

  // Função para alternar a sidebar, você já deve ter
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
  }
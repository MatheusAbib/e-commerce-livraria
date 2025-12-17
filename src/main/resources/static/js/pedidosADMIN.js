 document.addEventListener('DOMContentLoaded', async () => {
  const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

  if (!clienteLogado) {
    alert('Você precisa estar logado');
    window.location.href = 'principal.html';
    return;
  }

  if (clienteLogado.perfil !== 'ADMIN') {
    alert('Acesso negado: área restrita para administradores.');
    window.location.href = 'principal.html';
    return;
  }

  // Configurar eventos das abas
  document.getElementById('tab-todos').addEventListener('click', () => {
    setActiveTab('todos');
    document.getElementById('filtro-status').value = 'TODOS';
    filtrarPedidos();
  });
  document.getElementById('tab-processamento').addEventListener('click', () => {
    setActiveTab('processamento');
    document.getElementById('filtro-status').value = 'EM_PROCESSAMENTO';
    filtrarPedidos();
  });
  document.getElementById('tab-transito').addEventListener('click', () => {
    setActiveTab('transito');
    document.getElementById('filtro-status').value = 'EM_TRANSITO';
    filtrarPedidos();
  });
  document.getElementById('tab-entregues').addEventListener('click', () => {
    setActiveTab('entregues');
    document.getElementById('filtro-status').value = 'ENTREGUE';
    filtrarPedidos();
  });
  document.getElementById('tab-devolucao').addEventListener('click', () => {
    setActiveTab('devolucao');
    document.getElementById('filtro-status').value = 'DEVOLUCAO';
    filtrarPedidos();
  });
  document.getElementById('tab-cancelados').addEventListener('click', () => {
    setActiveTab('cancelados');
    document.getElementById('filtro-status').value = 'CANCELADO';
    filtrarPedidos();
  });

  document.getElementById('btn-filtrar').addEventListener('click', filtrarPedidos);

  // Carrega clientes e pedidos, e exibe a tabela
  await carregarClientesEPedidosAdmin();

  esconderLinksRestritos();
});

let pedidosAdminCache = [];
let clientesMap = {};

function setActiveTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
}

async function carregarClientesEPedidosAdmin() {
  try {
    const resPedidos = await fetch('/api/pedidos/todos');
    if (!resPedidos.ok) throw new Error('Erro ao carregar pedidos');
    
    pedidosAdminCache = await resPedidos.json();
    console.log('Dados completos dos pedidos:', pedidosAdminCache);

    // Processamento garantido do nome do cliente
    pedidosAdminCache.forEach(pedido => {
      if (!pedido.cliente && pedido.clienteId) {
        pedido.cliente = { id: pedido.clienteId, nome: 'N/D' };
      }
    });

    exibirTabelaPedidosAdmin(pedidosAdminCache);
  } catch (e) {
    console.error('Erro ao carregar dados:', e);
    document.getElementById('admin-pedidos-container').innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Não foi possível carregar os dados.</p>
        <p>${e.message}</p>
      </div>
    `;
  }
}

function filtrarPedidos() {
  const statusFiltro = document.getElementById('filtro-status').value.toUpperCase();
  const clienteFiltro = document.getElementById('filtro-cliente').value.toLowerCase();

  console.log('Filtrando pedidos com status:', statusFiltro, 'e cliente:', clienteFiltro);

  const container = document.getElementById('admin-pedidos-container');
  
  // Adiciona mensagem de carregamento com animação
  container.innerHTML = `
    <div class="loading-state">
      <p style="text-align:center; padding: 15px;">
        <i class="fas fa-spinner fa-spin"></i> Carregando pedidos...
      </p>
    </div>
  `;

  // Adiciona o timeout de 1 segundo
  setTimeout(() => {
    let filtrados = pedidosAdminCache;

    if (statusFiltro && statusFiltro !== 'TODOS') {
      filtrados = filtrados.filter(p => ((p.status?.name || p.status) || '').toUpperCase() === statusFiltro);
    }
    if (clienteFiltro) {
      filtrados = filtrados.filter(p => {
        const nomeCliente = clientesMap[p.clienteId || p.cliente_id] || '';
        return nomeCliente.toLowerCase().includes(clienteFiltro);
      });
    }

    console.log('Pedidos filtrados:', filtrados);

    exibirTabelaPedidosAdmin(filtrados);
  }, 1000);
}

function exibirTabelaPedidosAdmin(pedidos) {
  const container = document.getElementById('admin-pedidos-container');

  if (!pedidos || pedidos.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <p>Nenhum pedido encontrado</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Pedido</th>
          <th>Clientes</th>
          <th>Status</th>
          <th>Data</th>
          <th>Valor Total</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${pedidos.map(pedido => {
          const clienteInfo = pedido.cliente || {};
          const nomeCliente = clienteInfo.nome || 'N/D';
          const clienteId = clienteInfo.id || pedido.clienteId || 'N/D';

          console.log(`Processando pedido ${pedido.id}: Cliente ${clienteId} - ${nomeCliente}`);

          const status = pedido.status?.name || pedido.status;
          const dataPedido = pedido.dataPedido || pedido.data || '';
          const valor = Number(pedido.valorTotal || pedido.valor_total || 0).toFixed(2);
          const motivoDevolucao = pedido.motivoDevolucao || pedido.motivo_devolucao || '';

          return `
            <tr data-pedido-id="${pedido.id}">
              <td>${pedido.id}</td>
              <td class="cliente" data-cliente-id="${clienteId}">${nomeCliente}</td>
              <td class="status"><span class="pedido-status ${getStatusClass(status)}">${formatStatus(status)}</span></td>
              <td class="data">${formatarData(dataPedido)}</td>
              <td class="valor">R$ ${valor}</td>
              <td>
                <div class="acoes-pedido">
                  ${getBotoesAcaoPorStatus({ ...pedido, status })}
                </div>
              </td>
            </tr>
            ${status === 'DEVOLUCAO' && motivoDevolucao ? `
              <tr class="motivo-devolucao-row">
                <td colspan="6" class="motivo-devolucao-texto">
                  <strong>Motivo da Devolução:</strong> ${motivoDevolucao}
                </td>
              </tr>
            ` : ''}
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function getBotoesAcaoPorStatus(pedido) {
  let botoes = '';
  const status = pedido.status;

  if (status === 'EM_PROCESSAMENTO') {
    botoes += `
      <button class="btn btn-aprovar" onclick="atualizarStatusPedido('${pedido.id}', 'EM_TRANSITO')">
        <i class="fas fa-truck"></i> Aprovar
      </button>
    `;
  } else if (status === 'DEVOLUCAO') {
    botoes += `
      <button class="btn btn-aprovar" onclick="atualizarStatusPedido('${pedido.id}', 'DEVOLVIDO')">
        <i class="fas fa-check-double"></i> Aprovar Devolução
      </button>
    `;
  } else if (status === 'CANCELADO') {
    botoes += `
      <button class="btn btn-excluir" onclick="excluirPedidoCancelado('${pedido.id}')">
        <i class="fas fa-trash"></i> Excluir
      </button>
    `;
  }

  return botoes;
}

async function atualizarStatusPedido(pedidoId, novoStatus) {
  try {
    const response = await fetch(`/api/pedidos/${pedidoId}/status`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ novoStatus })
    });

    if (!response.ok) throw new Error('Falha ao atualizar status');

    const pedidoAtualizado = await response.json();

    // Atualiza o cache
    pedidosAdminCache = pedidosAdminCache.map(p => p.id === pedidoId ? pedidoAtualizado : p);

    atualizarLinhaPedido(pedidoAtualizado);

    alert(`Status atualizado para: ${formatStatus(novoStatus)}`);

  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    alert(`Erro: ${error.message}`);
  }
}

function atualizarLinhaPedido(pedido) {
  const row = document.querySelector(`tr[data-pedido-id="${pedido.id}"]`);
  if (!row) {
    filtrarPedidos();
    return;
  }

  const idCliente = pedido.cliente?.id || pedido.clienteId || pedido.cliente_id;
  const nomeCliente = pedido.cliente?.nome || clientesMap[idCliente] || 'N/D';
  const status = pedido.status?.name || pedido.status;
  const dataPedido = pedido.dataPedido || pedido.data || '';
  const valor = Number(pedido.valorTotal || pedido.valor_total || 0).toFixed(2);

  row.querySelector('.cliente').textContent = nomeCliente;
  row.querySelector('.status').innerHTML = `<span class="pedido-status ${getStatusClass(status)}">${formatStatus(status)}</span>`;
  row.querySelector('.data').textContent = formatarData(dataPedido);
  row.querySelector('.valor').textContent = `R$ ${valor}`;
  row.querySelector('.acoes-pedido').innerHTML = getBotoesAcaoPorStatus({ ...pedido, status });
}


async function excluirPedidoCancelado(pedidoId) {
  if (!confirm('Deseja realmente excluir este pedido cancelado?')) return;

  try {
    const response = await fetch(`/api/pedidos/${pedidoId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Falha ao excluir pedido');

    pedidosAdminCache = pedidosAdminCache.filter(p => p.id !== pedidoId);

    filtrarPedidos();

    alert('Pedido excluído com sucesso!');

  } catch (error) {
    console.error('Erro ao excluir pedido:', error);
    alert(`Erro: ${error.message}`);
  }
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

function formatarData(dataString) {
  if (!dataString) return '-';
  const d = new Date(dataString);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('show');
}

function esconderLinksRestritos() {
  const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

  const idsRestritos = [
    'link-usuarios',
    'link-log',
    'link-lucros',
    'link-livros',
    'link-pedidosADMIN'
  ];

  if (!clienteLogado || clienteLogado.perfil !== 'ADMIN') {
    idsRestritos.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  const linkStatusCliente = document.getElementById('link-status-cliente');
  if (clienteLogado && clienteLogado.perfil === 'ADMIN') {
    if (linkStatusCliente) linkStatusCliente.style.display = 'none';
  }

  if (!clienteLogado) {
    if (linkStatusCliente) linkStatusCliente.style.display = 'none';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  esconderLinksRestritos();
});
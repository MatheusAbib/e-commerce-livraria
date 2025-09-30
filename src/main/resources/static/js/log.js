 let allLogs = [];
let currentPage = 1;
const logsPerPage = 10;
let filteredLogs = [];

let usersMap = {};

// Carrega o mapa de usuários (id -> nome)
async function loadUsersMap() {
  const response = await fetch('/api/clientes');
  if (response.ok) {
    const users = await response.json();
    usersMap = {};
    users.forEach(user => {
      usersMap[user.id] = user.nome;
    });
  } else {
    usersMap = {};
  }
}

// Mostra estado de carregamento
function showLoadingState() {
  const tbody = document.querySelector('#log-table tbody');
  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Carregando dados...</p>
      </td>
    </tr>
  `;
}

// Carrega os logs da API ou localStorage
async function loadLogs() {
  try {
    showLoadingState();
    await loadUsersMap();  

    setTimeout(async () => {
      const response = await fetch('/api/logs');
      if (response.ok) {
        allLogs = await response.json();
      } else {
        allLogs = JSON.parse(localStorage.getItem('transactionLogs')) || [];
      }

      allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      filteredLogs = [...allLogs];
      applyFilters();
      populateUserFilter();

    }, 1000);
  } catch (error) {
    console.error('Erro ao carregar logs:', error);
    allLogs = JSON.parse(localStorage.getItem('transactionLogs')) || [];
    filteredLogs = [...allLogs];
    renderLogs();
    populateUserFilter();
  }
}

// Popula o filtro de usuários no select
function populateUserFilter() {
  const userFilter = document.getElementById('filter-user');
  const uniqueUsers = [...new Set(allLogs.map(log => log.userId))];

  // Remove opções existentes, mantendo a primeira (default)
  while (userFilter.options.length > 1) {
    userFilter.remove(1);
  }

  uniqueUsers.forEach(userId => {
    const userName = usersMap[userId];
    if (userName) {  
      const option = document.createElement('option');
      option.value = userId;
      option.textContent = userName;
      userFilter.appendChild(option);
    }
  });
}


// Aplica filtros dos selects e inputs
function applyFilters() {
  const userId = document.getElementById('filter-user').value;
  const action = document.getElementById('filter-action').value;
  const date = document.getElementById('filter-date').value;
  const level = document.getElementById('filter-level').value;

  showLoadingState();

  setTimeout(() => {
    filteredLogs = allLogs.filter(log => {
      if (userId && log.userId != userId) return false;
      if (action && log.action !== action) return false;
      if (date) {
        const logDate = new Date(log.timestamp).toISOString().split('T')[0];
        if (logDate !== date) return false;
      }
      if (level && log.level !== level) return false;
      return true;
    });

    currentPage = 1;
    renderLogs();
    renderPagination();
  }, 1000); // 1 segundo de atraso
}

// Limpa os filtros e reseta a listagem
function clearFilters() {
  document.getElementById('filter-user').value = '';
  document.getElementById('filter-action').value = '';
  document.getElementById('filter-date').value = '';
  document.getElementById('filter-level').value = '';

  showLoadingState();

  setTimeout(() => {
    filteredLogs = [...allLogs];
    currentPage = 1;
    renderLogs();
    renderPagination();
  }, 1000);
}

// Renderiza os logs na tabela
function renderLogs() {
  const tbody = document.querySelector('#log-table tbody');
  tbody.innerHTML = '';

  const startIndex = (currentPage - 1) * logsPerPage;
  const endIndex = startIndex + logsPerPage;
  const logsToShow = filteredLogs.slice(startIndex, endIndex);

  if (logsToShow.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum registro encontrado</td></tr>';
    return;
  }

  logsToShow.forEach(log => {
    const userName = usersMap[log.userId] || log.userName || 'Sistema';
    const date = new Date(log.timestamp);
    const formattedDate = date.toLocaleString('pt-BR');
    const levelClass = `log-level-${log.level || 'info'}`;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formattedDate}</td>
      <td>${userName}</td>
      <td>${translateAction(log.action)}</td>
      <td>${log.details || '-'}</td>
      <td class="${levelClass}">${translateLevel(log.level)}</td>
    `;
    tbody.appendChild(row);
  });
}

// Tradução das ações do log
function translateAction(action) {
  const actions = {
    'login': 'Login',
    'compra': 'Compra',
    'cadastro': 'Cadastro',
    'exclusao': 'Exclusão',
    'transito': 'Em Trânsito',
    'devolucao': 'Em Devolução',
    'devolvido': 'Devolvido',
    'trocado': 'Trocado',
    'cancelado': 'Cancelado',
  };
  return actions[action] || action;
}

// Tradução dos níveis de log
function translateLevel(level) {
  const levels = {
    'info': 'Informação',
    'warning': 'Aviso',
    'error': 'Erro',
    'success': 'Sucesso'
  };
  return levels[level] || level;
}

// Renderiza os botões de paginação
function renderPagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  if (totalPages <= 1) return;

  // Botão Anterior
  const prevButton = document.createElement('button');
  prevButton.innerHTML = '&laquo;';
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderLogs();
      renderPagination();
    }
  };
  pagination.appendChild(prevButton);

  // Páginas numéricas
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    const firstButton = document.createElement('button');
    firstButton.textContent = '1';
    firstButton.onclick = () => {
      currentPage = 1;
      renderLogs();
      renderPagination();
    };
    pagination.appendChild(firstButton);

    if (startPage > 2) {
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '...';
      pagination.appendChild(ellipsis);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.className = i === currentPage ? 'active' : '';
    pageButton.onclick = () => {
      currentPage = i;
      renderLogs();
      renderPagination();
    };
    pagination.appendChild(pageButton);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement('span');
      ellipsis.textContent = '...';
      pagination.appendChild(ellipsis);
    }

    const lastButton = document.createElement('button');
    lastButton.textContent = totalPages;
    lastButton.onclick = () => {
      currentPage = totalPages;
      renderLogs();
      renderPagination();
    };
    pagination.appendChild(lastButton);
  }

  // Botão Próximo
  const nextButton = document.createElement('button');
    nextButton.innerHTML = '&raquo;';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderLogs();
        renderPagination();
      }
    };
    pagination.appendChild(nextButton);
  }

  // Inicialização ao carregar a página
  document.addEventListener('DOMContentLoaded', () => {
    loadLogs();
    window.logAction = logAction;
  });

  function finalizarCompra(pedido) {
    fetch('/api/pedidos/finalizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    })
    .then(res => {
      if (!res.ok) throw new Error('Erro na finalização');
      return res.json();
    })
    .then(data => {
      logAction('COMPRA_FINALIZADA', `Compra finalizada com sucesso. Valor: R$ ${data.valorTotal}`, data.usuarioId);
      alert('Compra finalizada com sucesso!');
      // redirecionar ou atualizar interface
    })
    .catch(err => {
      alert('Erro ao finalizar compra');
      console.error(err);
    });
  }

function logAction(action, details, userId, level = 'info') {
  fetch('/api/logs/registrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      action,
      details,
      userId,
      level
    })
  }).catch(error => console.error('Erro ao registrar log:', error));
}

    let cartoesSelecionados = [];
    let cuponsAplicados = []; // Array para armazenar múltiplos cupons
    let cartTimer = null;
    let cartTimeoutDuration = 15; // segundos
    let temporizadorCarrinho = null;
    let intervaloContador = null;
    const TEMPO_LIMITE_CARRINHO = 5000; 
    let carrinho = obterCarrinhoUsuario();
    let enderecos = [];
    let cartoes = [];

function iniciarTemporizadorCarrinho() {
  clearTimeout(temporizadorCarrinho);
  clearInterval(intervaloContador);

  const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
  if (!cliente) return;

  // Verifica se o carrinho está vazio
  const carrinhosPorUsuario = JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
  const carrinhoUsuario = carrinhosPorUsuario[cliente.id] || [];
  
  if (carrinhoUsuario.length === 0) {
    // Esconde o temporizador se o carrinho estiver vazio
    const cartTimer = document.getElementById('cart-timer');
    if (cartTimer) {
      cartTimer.style.display = 'none';
    }
    return;
  }

  const chaveExpiracao = `carrinhoExpiracaoTimestamp_${cliente.id}`;
  const chaveUltimoAcesso = `carrinhoUltimoAcesso_${cliente.id}`;

  // Restante da função permanece igual...
  let expiracaoTimestamp = parseInt(localStorage.getItem(chaveExpiracao), 10);
  const agora = Date.now();

  if (!expiracaoTimestamp || expiracaoTimestamp < agora) {
    expiracaoTimestamp = agora + TEMPO_LIMITE_CARRINHO * 1000;
    localStorage.setItem(chaveExpiracao, expiracaoTimestamp.toString());
  }

  localStorage.setItem(chaveUltimoAcesso, agora.toString());
  let tempoRestante = Math.floor((expiracaoTimestamp - agora) / 1000);

  if (tempoRestante <= 0) {
    esvaziarCarrinhoPorTempo();
    return;
  }

  atualizarDisplayTemporizador(tempoRestante);

  intervaloContador = setInterval(() => {
    tempoRestante--;
    atualizarDisplayTemporizador(tempoRestante);

    if (tempoRestante <= 0) {
      clearInterval(intervaloContador);
      esvaziarCarrinhoPorTempo();
    }
  }, 1000);
}

function atualizarDisplayTemporizador(tempoRestante) {
  const timerDisplay = document.getElementById('timer-display');
  const cartTimer = document.getElementById('cart-timer');
  
  if (cartTimer) {
    cartTimer.style.display = 'flex';
  }
  
  if (timerDisplay) {
    timerDisplay.textContent = formatarTempo(tempoRestante);
  }
}

function formatarTempo(segundos) {
  const dias = Math.floor(segundos / 86400);
  segundos %= 86400;
  const horas = Math.floor(segundos / 3600);
  segundos %= 3600;
  const minutos = Math.floor(segundos / 60);
  const seg = segundos % 60;

  let partes = [];
  if (dias > 0) partes.push(`${dias}d`);
  if (horas > 0 || dias > 0) partes.push(`${horas}h`);
  partes.push(`${minutos.toString().padStart(2, '0')}m`);
  partes.push(`${seg.toString().padStart(2, '0')}s`);

  return partes.join(' ');
}

function verificarTempoCarrinho() {
  const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
  if (!cliente) return;

  // Verifica se há itens no carrinho
  const carrinhosPorUsuario = JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
  const carrinhoUsuario = carrinhosPorUsuario[cliente.id] || [];
  
  if (carrinhoUsuario.length === 0) return;

  const chaveExpiracao = `carrinhoExpiracaoTimestamp_${cliente.id}`;
  const chaveUltimoAcesso = `carrinhoUltimoAcesso_${cliente.id}`;

  const expiracaoTimestamp = parseInt(localStorage.getItem(chaveExpiracao), 10);
  const ultimoAcesso = parseInt(localStorage.getItem(chaveUltimoAcesso), 10);
  const agora = Date.now();

  if (!expiracaoTimestamp || !ultimoAcesso) return;

  const tempoDecorrido = Math.floor((agora - ultimoAcesso) / 1000);
  const tempoRestanteOriginal = Math.floor((expiracaoTimestamp - ultimoAcesso) / 1000);
  let novoTempoRestante = tempoRestanteOriginal - tempoDecorrido;

  if (novoTempoRestante <= 0) {
    esvaziarCarrinhoPorTempo();
    return;
  }

  const novoExpiracaoTimestamp = agora + (novoTempoRestante * 1000);
  localStorage.setItem(chaveExpiracao, novoExpiracaoTimestamp.toString());
  
  if (window.location.pathname.includes('carrinho.html')) {
    atualizarDisplayTemporizador(novoTempoRestante);
  }
}


// Função para adicionar um novo campo de cartão
function adicionarCartao() {
  const cartoesContainer = document.getElementById('cartoes-container');
  const cartoesDisponiveis = cartoes.filter(cartao => 
    !cartoesSelecionados.some(c => c.id === cartao.id)
  );

  if (cartoesDisponiveis.length === 0) {
    alert('Todos os seus cartões já foram adicionados ou você não tem cartões cadastrados.');
    return;
  }

  const novoId = Date.now(); // ID único para este campo de cartão

  const cartaoHtml = `
    <div class="cartao-pagamento" data-id="${novoId}">
      <button class="remove-cartao" onclick="removerCartao(${novoId})">
        <i class="bi bi-trash"></i>
      </button>
      <select class="form-control select-cartao" onchange="atualizarDetalhesCartao(${novoId}, this.value)">
        <option value="">-- Selecione um cartão --</option>
        ${cartoesDisponiveis.map(cartao => `
          <option value="${cartao.id}">
            ${cartao.bandeira} **** **** **** ${cartao.numero.slice(-4)}
          </option>
        `).join('')}
      </select>
      <div class="detalhes-cartao-${novoId} detalhes-box mt-2" style="display:none;"></div>
      <div class="cartao-valor">
        <span>R$</span>
        <input type="number" class="form-control valor-cartao" 
       placeholder="Mínimo R$ 10,00" min="0.01" step="0.01"
       onchange="atualizarResumoPagamento()">
      </div>
    </div>
  `;

  cartoesContainer.insertAdjacentHTML('beforeend', cartaoHtml);
  document.getElementById('resumo-pagamento').style.display = 'block';
  
  atualizarResumoPagamento();
}

// Recalcula totais de forma consistente
function recalcularTotaisConsistentes() {
  const subtotalText = document.getElementById('subtotal').textContent;
  const subtotal = parseFloat(subtotalText.replace('R$', '').replace(',', '.'));
  
  const freteText = document.getElementById('frete').textContent;
  let frete = parseFloat(freteText.replace('R$', '').replace(',', '.')) || 0;
  
  if (cuponsAplicados.some(cupom => cupom.zerarFrete)) {
    frete = 0;
    document.getElementById('frete').textContent = 'R$ 0,00';
  }
  
  const descontoCupons = cuponsAplicados.reduce((total, cupom) => total + cupom.valorDesconto, 0);
  const totalCompra = Math.max(0, subtotal + frete - descontoCupons);
  
  // Atualiza a exibição do total
  document.getElementById('total').textContent = `R$ ${totalCompra.toFixed(2)}`;
  
  // Atualiza o resumo do pagamento
  atualizarResumoPagamento();
}

// Função para remover um cartão
function removerCartao(id) {
  const elemento = document.querySelector(`.cartao-pagamento[data-id="${id}"]`);
  if (elemento) {
    elemento.remove();
    cartoesSelecionados = cartoesSelecionados.filter(c => c.campoId !== id);
    atualizarResumoPagamento();
  }

  // Esconde o resumo se não houver cartões
  if (document.querySelectorAll('.cartao-pagamento').length === 0) {
    document.getElementById('resumo-pagamento').style.display = 'none';
  }
}

function atualizarDetalhesCartao(campoId, cartaoId) {
  const cartao = cartoes.find(c => c.id == cartaoId);
  const detalhesDiv = document.querySelector(`.detalhes-cartao-${campoId}`);

  if (!cartao) {
    detalhesDiv.style.display = 'none';
    detalhesDiv.innerHTML = '';
    
    // Remove da lista de cartões selecionados
    cartoesSelecionados = cartoesSelecionados.filter(c => c.campoId !== campoId);
    return;
  }

  detalhesDiv.style.display = 'block';
  detalhesDiv.innerHTML = `
    <strong>Cartão ${cartao.bandeira}</strong>
    <div class="detalhes-row"><strong>Nome do Titular:</strong> ${cartao.nomeTitular}</div>
    <div class="detalhes-row"><strong>Validade:</strong> ${cartao.dataValidade}</div>
  `;

  // Adiciona ou atualiza na lista de cartões selecionados
  const index = cartoesSelecionados.findIndex(c => c.campoId === campoId);
  if (index === -1) {
    cartoesSelecionados.push({
      campoId,
      id: cartao.id,
      bandeira: cartao.bandeira,
      ultimosDigitos: cartao.numero.slice(-4),
      valor: 0
    });
  } else {
    cartoesSelecionados[index].id = cartao.id;
    cartoesSelecionados[index].bandeira = cartao.bandeira;
    cartoesSelecionados[index].ultimosDigitos = cartao.numero.slice(-4);
  }

  atualizarResumoPagamento();
}

// Função para atualizar o resumo do pagamento
function atualizarResumoPagamento() {
  const resumoCartoes = document.getElementById('resumo-cartoes');
  const resumoCupons = document.getElementById('resumo-cupons');
  let totalPago = 0;
  let cartoesInvalidos = false;

  // Atualiza os valores nos cartões selecionados
  document.querySelectorAll('.cartao-pagamento').forEach(cartaoDiv => {
    const campoId = parseInt(cartaoDiv.getAttribute('data-id'));
    const valorInput = cartaoDiv.querySelector('.valor-cartao');
    let valor = parseFloat(valorInput.value) || 0;
    
    // Valida valor mínimo
    if (valor > 0 && valor < 10) {
      valorInput.classList.add('is-invalid');
      cartoesInvalidos = true;
    } else {
      valorInput.classList.remove('is-invalid');
    }

    const cartaoIndex = cartoesSelecionados.findIndex(c => c.campoId === campoId);
    if (cartaoIndex !== -1) {
      cartoesSelecionados[cartaoIndex].valor = valor;
      totalPago += valor;
    }
  });

  // Atualiza o resumo dos cartões
  resumoCartoes.innerHTML = cartoesSelecionados
    .filter(c => c.valor > 0)
    .map(cartao => `
      <div class="resumo-cartao-item ${cartao.valor < 10 ? 'text-danger' : ''}">
        <span>${cartao.bandeira} ****${cartao.ultimosDigitos}:</span>
        <span>R$ ${cartao.valor.toFixed(2)} ${cartao.valor < 10 ? '(Mínimo: R$ 10,00)' : ''}</span>
      </div>
    `).join('');

  // Atualiza o resumo dos cupons
  const descontoCupons = cuponsAplicados.reduce((total, cupom) => total + cupom.valorDesconto, 0);
  resumoCupons.innerHTML = cuponsAplicados
    .map(cupom => `
      <div class="resumo-cupom-item text-success">
        <span>${cupom.codigo}:</span>
        <span>-R$ ${cupom.valorDesconto.toFixed(2)}</span>
      </div>
    `).join('');

  const subtotalText = document.getElementById('subtotal').textContent;
  const subtotal = parseFloat(subtotalText.replace('R$', '').replace(',', '.'));
  
  const freteText = document.getElementById('frete').textContent;
  const frete = parseFloat(freteText.replace('R$', '').replace(',', '.')) || 0;
  
  const totalCompra = Math.max(0, subtotal + frete - descontoCupons);
  
  document.getElementById('total-pagamento').textContent = `R$ ${totalPago.toFixed(2)}`;

  // Verifica se o total pago corresponde ao total da compra
  if (cartoesInvalidos) {
    resumoCartoes.innerHTML += `
      <div class="text-danger mt-2">
        Cada cartão deve ter um valor mínimo de R$ 10,00
      </div>
    `;
  } else if (Math.abs(totalPago - totalCompra) > 0.01) { 
    resumoCartoes.innerHTML += `
      <div class="text-danger mt-2">
        Atenção: O total dos cartões (R$ ${totalPago.toFixed(2)}) não corresponde 
        ao valor da compra (R$ ${totalCompra.toFixed(2)})
      </div>
    `;
  }
}
    // Funções para gerenciar carrinho por usuário
function obterCarrinhoUsuario() {
    const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
    if (!clienteLogado) return [];
    
    // USA A MESMA ESTRUTURA DO PRINCIPAL.JS
    const carrinhosPorUsuario = JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
    return carrinhosPorUsuario[clienteLogado.id] || [];
}

function salvarCarrinhoUsuario(carrinho) {
    const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
    if (!clienteLogado) return;
    
    // USA A MESMA ESTRUTURA DO PRINCIPAL.JS
    const carrinhosPorUsuario = JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
    carrinhosPorUsuario[clienteLogado.id] = carrinho;
    localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhosPorUsuario));
    
    // ATUALIZA O CONTADOR GLOBAL
    atualizarContadorCarrinhoGlobal();
}

// Função para atualizar o contador global (chamada do carrinho.js)
function atualizarContadorCarrinhoGlobal() {
    const carrinho = obterCarrinhoUsuario();
    const totalItens = carrinho.reduce((total, item) => total + (item.quantidade || 1), 0);
    
    // Atualiza o contador na página do carrinho (se existir)
    const contadorCarrinho = document.getElementById('cart-count-carrinho');
    if (contadorCarrinho) {
        contadorCarrinho.textContent = totalItens;
        contadorCarrinho.style.display = totalItens > 0 ? 'flex' : 'none';
    }
    
    // Também atualiza o contador principal (para quando voltar à página principal)
    const contadorPrincipal = document.getElementById('cart-count');
    if (contadorPrincipal) {
        contadorPrincipal.textContent = totalItens;
        contadorPrincipal.style.display = totalItens > 0 ? 'flex' : 'none';
    }
}

function limparCarrinho() {
  if (confirm('Tem certeza que deseja limpar seu carrinho?')) {
    carrinho = [];
    atualizarCarrinho();
    clearTimeout(temporizadorCarrinho);
    clearInterval(intervaloContador);

    const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
    if (cliente) {
      localStorage.removeItem(`carrinhoExpiracaoTimestamp_${cliente.id}`);
      localStorage.removeItem(`carrinhoTempoRestante_${cliente.id}`);
    }

    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
      timerDisplay.textContent = 'Carrinho limpo.';
    }
  }
}

    let cupomAplicado = null;

    function calcularFrete(valorSubtotal, estado) {
      const acrescimosPorEstado = {
        'AC': 9.75, 'AL': 6.45, 'AP': 10.00, 'AM': 9.90, 'BA': 5.30,
        'CE': 6.25, 'DF': 4.70, 'ES': 3.60, 'GO': 4.15, 'MA': 7.80,
        'MT': 6.95, 'MS': 5.55, 'MG': 4.85, 'PA': 9.35, 'PB': 6.60,
        'PR': 2.40, 'PE': 6.10, 'PI': 7.35, 'RJ': 5.50, 'RN': 6.75,
        'RS': 2.25, 'RO': 8.20, 'RR': 10.00, 'SC': 2.95, 'SP': 3.35,
        'SE': 5.90, 'TO': 7.10
      };

      let freteBase = 15;
      if (valorSubtotal >= 300) {
        freteBase = 0;
      } else {
        const adicionais = Math.floor(valorSubtotal / 70) * 7;
        freteBase += adicionais;
      }

      return freteBase + (acrescimosPorEstado[estado] || 0);
    }

window.addEventListener('DOMContentLoaded', () => {
  const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
  if (!clienteLogado) {
    alert('Você precisa estar logado para acessar o carrinho');
    window.location.href = 'principal.html';
    return;
  }

  // Verifica o tempo do carrinho
  verificarTempoCarrinho();

  // Carrega o carrinho e itens expirados
  carrinho = obterCarrinhoUsuario();
  carregarCarrinho();
  mostrarItensExpirados();

  // Inicia o temporizador se estiver na página do carrinho
  if (window.location.pathname.includes('carrinho.html')) {
    iniciarTemporizadorCarrinho();
  }

      // Configura notificações
      const notificacaoIcon = document.getElementById('notificacao-icon');
      if (notificacaoIcon) {
        notificacaoIcon.addEventListener('click', exibirNotificacoes);
      }

// Adicione isso no DOMContentLoaded
    document.getElementById('notificacao-icon').addEventListener('click', function(e) {
      e.stopPropagation();
      const dropdown = document.getElementById('notificacao-dropdown');
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      if (dropdown.style.display === 'block') {
        carregarListaNotificacoes();
      }
    });

    window.addEventListener('beforeunload', () => {
      const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
      if (!cliente) return;

      const chaveUltimoAcesso = `carrinhoUltimoAcesso_${cliente.id}`;
      localStorage.setItem(chaveUltimoAcesso, Date.now().toString());
    });

    document.addEventListener('click', function(e) {
      const dropdown = document.getElementById('notificacao-dropdown');
      const icon = document.getElementById('notificacao-icon');
      
      if (dropdown && !dropdown.contains(e.target) && !icon.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
      
      const dropdown = document.getElementById('notificacao-dropdown');
      if (dropdown) {
        dropdown.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      // Atualiza badge
      atualizarBadgeNotificacao();

      // Restante do código de inicialização do carrinho
      carrinho = obterCarrinhoUsuario();
      carregarCarrinho();
      carregarEnderecos();
      carregarCartoes();

      document.getElementById('select-endereco').addEventListener('change', mostrarDetalhesEndereco);
      document.getElementById('select-cartao').addEventListener('change', mostrarDetalhesCartao);
    });

    async function carregarCarrinho() {
      const carrinhoItens = document.getElementById('carrinho-itens');
      const carrinhoVazio = document.getElementById('carrinho-vazio');
      const carrinhoTotal = document.getElementById('carrinho-total');
      const cartActions = document.getElementById('cart-actions');

      // Verifica se o carrinho está vazio
      if (carrinho.length === 0) {
        carrinhoItens.style.display = 'none';
        carrinhoVazio.style.display = 'block';
        carrinhoTotal.style.display = 'none';
        cartActions.style.display = 'none';
        return;
      }

      carrinhoVazio.style.display = 'none';
      carrinhoItens.style.display = 'contents';
      carrinhoTotal.style.display = 'block';
      cartActions.style.display = 'flex';

      try {
        // Carrega os detalhes dos produtos
        const itensDetalhados = await Promise.all(
          carrinho.map(async item => {
            const res = await fetch(`/api/livros/${item.id}`);
            if (!res.ok) throw new Error(`Erro ao buscar produto ${item.id}: ${res.status}`);
            const produto = await res.json();
            return { ...item, produto };
          })
        );

        // Atualiza a lista de itens no carrinho
        carrinhoItens.innerHTML = itensDetalhados.map(item => `
          <tr class="carrinho-item" data-id="${item.id}">
            <td data-label="Produto">
              <div class="d-flex align-items-center">
                <img src="${item.produto.imagemUrl || 'img/livro-placeholder.jpg'}" 
                     alt="${item.produto.titulo}" 
                     class="carrinho-item-imagem me-3">
                <div class="carrinho-item-titulo">${item.produto.titulo}</div>
              </div>
            </td>
            <td data-label="Preço">R$ ${item.produto.precoVenda.toFixed(2)}</td>
            <td data-label="Quantidade">
              <div class="quantity-control">
                <button class="quantity-btn" onclick="alterarQuantidadeCarrinho(${item.id}, -1)">-</button>
                <input type="number" class="carrinho-item-quantidade" 
                       value="${item.quantidade}" min="1" max="${item.produto.estoque}" 
                       onchange="atualizarQuantidadeCarrinho(${item.id}, this.value, ${item.produto.estoque})">
                <button class="quantity-btn" onclick="alterarQuantidadeCarrinho(${item.id}, 1, ${item.produto.estoque})">+</button>
              </div>
            </td>
            <td data-label="Subtotal">R$ ${(item.produto.precoVenda * item.quantidade).toFixed(2)}</td>
            <td>
              <button class="carrinho-item-remover" onclick="removerDoCarrinho(${item.id})">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `).join('');

        // Calcula subtotal e frete
        const subtotal = itensDetalhados.reduce((s, i) => s + (i.produto.precoVenda * i.quantidade), 0);

        const temCupomFreteGratis = cuponsAplicados.some(cupom => cupom.zerarFrete);
        let frete = 0;

        if (!temCupomFreteGratis) {
          // Só calcula o frete se NÃO houver cupom que zera o frete
          const enderecoSelect = document.getElementById('select-endereco');
          let estado = '';
          
          if (enderecoSelect && enderecoSelect.value) {
            const enderecoId = parseInt(enderecoSelect.value);
            const endereco = enderecos.find(e => e.id == enderecoId);
            if (endereco) {
              estado = endereco.estado;
            }
          }
          
          frete = calcularFrete(subtotal, estado);
        }

        document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
        document.getElementById('frete').textContent = `R$ ${frete.toFixed(2)}`;
        // Verifica se há cupom aplicado
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

        if (cuponsAplicados.length > 0 && clienteLogado) {
          const descontoTotal = cuponsAplicados.reduce((total, cupom) => total + cupom.valorDesconto, 0);
          const valorFinal = Math.max(0, subtotal + frete - descontoTotal);
          
          document.getElementById('total').textContent = `R$ ${valorFinal.toFixed(2)}`;
          document.getElementById('valor-desconto').textContent = `-R$ ${descontoTotal.toFixed(2)}`;
          document.getElementById('cupom-line').style.display = 'flex';
          
          if (cuponsAplicados.some(cupom => cupom.zerarFrete)) {
            document.getElementById('frete').textContent = 'R$ 0,00';
            // Recalcula o total com frete zerado
            const novoValorFinal = Math.max(0, subtotal - descontoTotal);
            document.getElementById('total').textContent = `R$ ${novoValorFinal.toFixed(2)}`;
          }
        } else {
          // Sem cupom aplicado
          document.getElementById('total').textContent = `R$ ${(subtotal + frete).toFixed(2)}`;
          document.getElementById('cupom-line').style.display = 'none';
        }

      } catch (error) {
        console.error('Erro ao carregar itens:', error);
        carrinhoItens.innerHTML = '<tr><td colspan="5" class="text-center py-4">Erro ao carregar os produtos. Tente novamente mais tarde.</td></tr>';
      }
      iniciarTemporizadorCarrinho();
        mostrarItensExpirados();

    }

    function alterarQuantidadeCarrinho(idProduto, delta, estoqueMax = Infinity) {
      const item = carrinho.find(i => i.id === idProduto);
      if (!item) return;
      const novaQtd = item.quantidade + delta;
      if (novaQtd < 1 || novaQtd > estoqueMax) return;
      item.quantidade = novaQtd;
      atualizarCarrinho();
    }

    function atualizarQuantidadeCarrinho(idProduto, novaQtd, estoqueMax) {
      const quantidadeNum = parseInt(novaQtd);
      if (isNaN(quantidadeNum)) return;
      const item = carrinho.find(i => i.id === idProduto);
      if (!item) return;
      item.quantidade = Math.max(1, Math.min(quantidadeNum, estoqueMax));
      atualizarCarrinho();
    }

    function removerDoCarrinho(idProduto) {
      carrinho = carrinho.filter(i => i.id !== idProduto);
      atualizarCarrinho();
    }

function atualizarCarrinho() {
    salvarCarrinhoUsuario(carrinho);
    carregarCarrinho();
    atualizarContadorCarrinhoGlobal(); // ADICIONE ESTA LINHA
}

function alterarQuantidadeCarrinho(idProduto, delta, estoqueMax = Infinity) {
    const item = carrinho.find(i => i.id === idProduto);
    if (!item) return;
    const novaQtd = item.quantidade + delta;
    if (novaQtd < 1 || novaQtd > estoqueMax) return;
    item.quantidade = novaQtd;
    atualizarCarrinho();
    atualizarContadorCarrinhoGlobal(); // ADICIONE
}

function atualizarQuantidadeCarrinho(idProduto, novaQtd, estoqueMax) {
    const quantidadeNum = parseInt(novaQtd);
    if (isNaN(quantidadeNum)) return;
    const item = carrinho.find(i => i.id === idProduto);
    if (!item) return;
    item.quantidade = Math.max(1, Math.min(quantidadeNum, estoqueMax));
    atualizarCarrinho();
    atualizarContadorCarrinhoGlobal(); // ADICIONE
}

function removerDoCarrinho(idProduto) {
    carrinho = carrinho.filter(i => i.id !== idProduto);
    atualizarCarrinho();
    atualizarContadorCarrinhoGlobal(); // ADICIONE
}

async function carregarEnderecos() {
  const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
  if (!cliente) return;

  try {
    const res = await fetch(`/api/clientes/${cliente.id}/enderecos`);
    if (!res.ok) throw new Error('Erro ao buscar endereços');
    enderecos = await res.json();

    const selectEnderecos = document.getElementById('select-endereco');
    selectEnderecos.innerHTML = '<option value="">-- Selecione um endereço --</option>';

    const enderecosEntrega = enderecos.filter(e => e.tipo === 'ENTREGA');

    enderecosEntrega.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.id;
      // Inclui o nome do endereço se existir
      const nome = e.nomeEndereco ? `${e.nomeEndereco} - ` : '';
      opt.textContent = `${nome}${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade}`;
      selectEnderecos.appendChild(opt);
    });
  } catch (e) {
    console.error(e);
  }
}

async function carregarCartoes() {
  const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
  if (!cliente) return;

  try {
    const res = await fetch(`/api/clientes/${cliente.id}/cartoes`);
    if (!res.ok) throw new Error('Erro ao buscar cartões');
    cartoes = await res.json();

    // Ordena cartões: preferenciais primeiro
    cartoes.sort((a, b) => (b.preferencial ? 1 : 0) - (a.preferencial ? 1 : 0));

    // Inicializa com um campo de cartão se houver cartões disponíveis
    const cartoesContainer = document.getElementById('cartoes-container');
    if (cartoes.length > 0 && cartoesContainer.children.length === 0) {
      adicionarCartao();
      
      // Seleciona automaticamente o cartão preferencial se existir
      const cartaoPreferencial = cartoes.find(c => c.preferencial);
      if (cartaoPreferencial) {
        setTimeout(() => {
          const primeiroSelect = document.querySelector('.select-cartao');
          if (primeiroSelect) {
            primeiroSelect.value = cartaoPreferencial.id;
            const campoId = primeiroSelect.closest('.cartao-pagamento').dataset.id;
            atualizarDetalhesCartao(parseInt(campoId), cartaoPreferencial.id);
          }
        }, 100);
      }
    }
  } catch (e) {
    console.error(e);
  }
}

 function mostrarDetalhesEndereco() {
  const select = document.getElementById('select-endereco');
  const detalhesDiv = document.getElementById('detalhes-endereco');
  const endereco = enderecos.find(e => e.id == select.value);

  if (!endereco) {
    detalhesDiv.style.display = 'none';
    detalhesDiv.innerHTML = '';
    return;
  }

  detalhesDiv.style.display = 'block';
  detalhesDiv.innerHTML = `
    <strong>${endereco.nomeEndereco || 'Endereço de Entrega'}</strong>
    <div class="detalhes-row"><strong>Rua:</strong> ${endereco.tipoLogradouro ? endereco.tipoLogradouro + ' ' : ''}${endereco.rua}, Nº ${endereco.numero}${endereco.complemento ? ' - ' + endereco.complemento : ''}</div>
    <div class="detalhes-row"><strong>Bairro:</strong> ${endereco.bairro}</div>
    <div class="detalhes-row"><strong>Cidade/Estado:</strong> ${endereco.cidade} / ${endereco.estado}</div>
    <div class="detalhes-row"><strong>CEP:</strong> ${endereco.cep}</div>
    <div class="detalhes-row"><strong>Tipo Residência:</strong> ${endereco.tipoResidencia || 'Não informado'}</div>
    <div class="detalhes-row"><strong>País:</strong> ${endereco.pais || 'Brasil'}</div>
  `;

  const subtotalSpan = document.getElementById('subtotal');
  const freteSpan = document.getElementById('frete');
  const totalSpan = document.getElementById('total');

  if (subtotalSpan && freteSpan && totalSpan) {
    const subtotal = parseFloat(subtotalSpan.textContent.replace('R$', '').replace(',', '.'));
    
    const temCupomFreteGratis = cuponsAplicados.some(cupom => cupom.zerarFrete);
    
    let frete = 0;
    if (!temCupomFreteGratis) {
      // Só calcula o frete se NÃO houver cupom que zera o frete
      frete = calcularFrete(subtotal, endereco.estado);
    }
    // Se tem cupom que zera frete, mantém frete = 0

    freteSpan.textContent = `R$ ${frete.toFixed(2)}`;
    
    if (cuponsAplicados.length > 0) {
      const descontoTotal = cuponsAplicados.reduce((total, cupom) => total + cupom.valorDesconto, 0);
      const valorFinal = Math.max(0, subtotal + frete - descontoTotal);
      totalSpan.textContent = `R$ ${valorFinal.toFixed(2)}`;
      
      // Mantém a exibição do desconto
      document.getElementById('valor-desconto').textContent = `-R$ ${descontoTotal.toFixed(2)}`;
      document.getElementById('cupom-line').style.display = 'flex';
    } else {
      totalSpan.textContent = `R$ ${(subtotal + frete).toFixed(2)}`;
    }
  }
  
  atualizarResumoPagamento();
}

    function mostrarDetalhesCartao() {
      const select = document.getElementById('select-cartao');
      const detalhesDiv = document.getElementById('detalhes-cartao');
      const cartao = cartoes.find(c => c.id == select.value);
      if (!cartao) {
        detalhesDiv.style.display = 'none';
        detalhesDiv.innerHTML = '';
        return;
      }

      detalhesDiv.style.display = 'block';
      detalhesDiv.innerHTML = `
        <strong>Cartão ${cartao.bandeira}</strong>
        <div class="detalhes-row"><strong>Número:</strong> **** **** **** ${cartao.numero.slice(-4)}</div>
        <div class="detalhes-row"><strong>Nome do Titular:</strong> ${cartao.nomeTitular}</div>
        <div class="detalhes-row"><strong>Validade:</strong> ${cartao.dataValidade}</div>
      `;
    }

    /* Seção de Cupons */
 function aplicarCupom() {
      const codigoCupom = document.getElementById('input-cupom').value.trim();
      if (!codigoCupom) {
        alert('Por favor, digite um código de cupom');
        return;
      }

      const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
      if (!clienteLogado) {
        alert('Você precisa estar logado para usar um cupom');
        openModalLogin();
        return;
      }

      // Verifica se o cupom já foi aplicado
      if (cuponsAplicados.some(c => c.codigo === codigoCupom)) {
        alert('Este cupom já foi aplicado');
        return;
      }

      const subtotalText = document.getElementById('subtotal').textContent;
      const subtotal = parseFloat(subtotalText.replace('R$', '').replace(',', '.'));

      const validacao = validarCupom(codigoCupom, subtotal, clienteLogado.id);
      
      if (!validacao.valido) {
        alert(validacao.mensagem);
        return;
      }

      // Adiciona o cupom à lista de cupons aplicados
      cuponsAplicados.push(validacao.cupom);
      
      // Atualiza a UI para mostrar os cupons aplicados
      atualizarCuponsAplicadosUI();
      
      // Atualiza o total
      if (validacao.zerarFrete) {
        document.getElementById('frete').textContent = 'R$ 0,00';
      }
      
      // Limpa o campo de input
      document.getElementById('input-cupom').value = '';
      
      // Recalcula o total com todos os cupons aplicados
        recalcularTotaisConsistentes();

      
      if (validacao.mensagem) {
        alert(validacao.mensagem + (validacao.zerarFrete ? "\n\nFrete grátis aplicado!" : ""));
      }
    }

    // Função para atualizar a UI dos cupons aplicados
    function atualizarCuponsAplicadosUI() {
      const container = document.getElementById('cupons-aplicados-container');
      
      if (cuponsAplicados.length === 0) {
        container.innerHTML = '';
        return;
      }
      
      container.innerHTML = cuponsAplicados.map(cupom => `
        <div class="cupom-aplicado-item" data-codigo="${cupom.codigo}">
          <div class="cupom-aplicado-header">
            <strong>${cupom.codigo}</strong>
            <span class="cupom-aplicado-valor">-R$ ${cupom.valorDesconto.toFixed(2)}</span>
          </div>
          <div class="cupom-aplicado-detalhes">
            <small>${cupom.tipo === 'percent' ? `${cupom.desconto}% de desconto` : 'Cupom de troca'}</small>
            <button class="btn btn-sm btn-link p-0 text-danger" onclick="removerCupomAplicado('${cupom.codigo}')">
              <i class="bi bi-trash"></i> Remover
            </button>
          </div>
        </div>
      `).join('');
    }

      function removerCupomAplicado(codigoCupom) {
  // Encontra o cupom a ser removido
  const cupomIndex = cuponsAplicados.findIndex(c => c.codigo === codigoCupom);
  if (cupomIndex === -1) return;
  
  const cupomRemovido = cuponsAplicados[cupomIndex];
  
  // Remove o cupom do array
  cuponsAplicados.splice(cupomIndex, 1);
  
  // Atualiza a UI
  atualizarCuponsAplicadosUI();
  
  const aindaTemFreteGratis = cuponsAplicados.some(c => c.zerarFrete);
  
  if (!aindaTemFreteGratis) {
    // Só recalcula o frete se NÃO houver mais cupons que zeram o frete
    const subtotalText = document.getElementById('subtotal').textContent;
    const subtotal = parseFloat(subtotalText.replace('R$', '').replace(',', '.'));
    const enderecoSelect = document.getElementById('select-endereco');
    
    if (enderecoSelect && enderecoSelect.value) {
      const enderecoId = parseInt(enderecoSelect.value);
      const endereco = enderecos.find(e => e.id == enderecoId);
      
      if (endereco) {
        const frete = calcularFrete(subtotal, endereco.estado);
        document.getElementById('frete').textContent = `R$ ${frete.toFixed(2)}`;
      }
    }
  }
  
  // Recalcula o total
  recalcularTotaisConsistentes();
}

        function recalcularTotalComCupons() {
      const subtotalText = document.getElementById('subtotal').textContent;
      const subtotal = parseFloat(subtotalText.replace('R$', '').replace(',', '.'));
      
      const freteText = document.getElementById('frete').textContent;
      let frete = parseFloat(freteText.replace('R$', '').replace(',', '.'));
      
      // Calcula o desconto total de todos os cupons
      const descontoTotal = cuponsAplicados.reduce((total, cupom) => total + cupom.valorDesconto, 0);
      
      // Calcula o valor final (nunca menor que zero)
      const valorFinal = Math.max(0, subtotal + frete - descontoTotal);
      
      // Atualiza a exibição
      document.getElementById('total').textContent = `R$ ${valorFinal.toFixed(2)}`;
      document.getElementById('valor-desconto').textContent = `-R$ ${descontoTotal.toFixed(2)}`;
      
      // Mostra ou esconde a linha de desconto
      document.getElementById('cupom-line').style.display = descontoTotal > 0 ? 'flex' : 'none';
      
      // Atualiza o resumo do pagamento
      atualizarResumoPagamento();
    }

   function validarCupom(codigoCupom, valorSubtotal, userId) {
  // Verifica se o código do cupom está no formato esperado
  if (!codigoCupom || (!codigoCupom.startsWith('CUPOM') && !codigoCupom.startsWith('TROCA-'))) {
    return { valido: false, mensagem: 'Formato de cupom inválido' };
  }

  // Obtém todos os cupons do usuário
  const cuponsPorUsuario = JSON.parse(localStorage.getItem('cuponsPorUsuario')) || {};
  const cuponsUsuario = cuponsPorUsuario[userId] || [];
  
  // Encontra o cupom pelo código (case insensitive)
  const cupom = cuponsUsuario.find(c => 
    c.codigo.toUpperCase() === codigoCupom.toUpperCase()
  );
  
  if (!cupom) {
    return { valido: false, mensagem: 'Cupom não encontrado' };
  }
  
  // Verifica se o cupom já foi aplicado anteriormente
  if (cuponsAplicados.some(c => c.codigo === cupom.codigo)) {
    return { valido: false, mensagem: 'Este cupom já foi aplicado' };
  }
  
  // Verifica se já foi usado completamente (exceto para crédito que pode ser parcial)
  if (cupom.usado && cupom.tipo !== 'credito' && cupom.tipo !== 'troca') {
    return { valido: false, mensagem: 'Este cupom já foi utilizado' };
  }
  
  // Verifica se expirou
  const dataExpiracao = new Date(cupom.dataExpiracao);
  const hoje = new Date();
  if (dataExpiracao < hoje) {
    return { valido: false, mensagem: 'Este cupom está expirado' };
  }
  
  // Verifica o valor mínimo para cupons percentuais
  if (cupom.tipo === 'percent' && valorSubtotal < cupom.valorMinimo) {
    return { 
      valido: false, 
      mensagem: `Este cupom requer um valor mínimo de R$ ${cupom.valorMinimo.toFixed(2)}` 
    };
  }
  
  // Calcula o desconto ou crédito disponível
  let valorDisponivel = 0;
  let mensagem = '';
  let usadoCompleto = true;
  
  const freteText = document.getElementById('frete').textContent;
  const frete = parseFloat(freteText.replace('R$', '').replace(',', '.'));
  const totalCompra = valorSubtotal + frete;
  
  // Calcula o desconto total já aplicado por outros cupons
  const descontoExistente = cuponsAplicados.reduce((total, c) => total + c.valorDesconto, 0);
  const valorRestante = Math.max(0, totalCompra - descontoExistente);
  
  if (cupom.tipo === 'percent') {
    // Cupom percentual: aplica porcentagem sobre o subtotal
    valorDisponivel = valorSubtotal * (cupom.desconto / 100);
    valorDisponivel = Math.min(valorDisponivel, valorRestante);
    mensagem = `Cupom de ${cupom.desconto}% de desconto aplicado`;
    
  } else if (cupom.tipo === 'credito') {
    // Cupom de crédito: valor fixo que pode ser usado parcialmente
    valorDisponivel = cupom.valor - (cupom.valorUsado || 0);
    valorDisponivel = Math.min(valorDisponivel, valorRestante);
    
    if (valorDisponivel < cupom.valor - (cupom.valorUsado || 0)) {
      usadoCompleto = false;
      mensagem = `Cupom de crédito aplicado parcialmente (R$ ${valorDisponivel.toFixed(2)} de R$ ${(cupom.valor - (cupom.valorUsado || 0)).toFixed(2)} disponíveis)`;
    } else {
      mensagem = `Cupom de crédito aplicado (R$ ${valorDisponivel.toFixed(2)})`;
    }
    
  } else if (cupom.tipo === 'troca') {
    // Cupom de troca: valor fixo que cobre parte ou toda a compra
    valorDisponivel = Math.min(cupom.valor, valorRestante);
    
    if (valorDisponivel < cupom.valor) {
      usadoCompleto = false;
      mensagem = `Cupom de troca aplicado parcialmente (R$ ${valorDisponivel.toFixed(2)} de R$ ${cupom.valor.toFixed(2)})`;
    } else {
      mensagem = `Cupom de troca aplicado (R$ ${valorDisponivel.toFixed(2)})`;
    }
    
  } else {
    // Cupom de desconto fixo
    valorDisponivel = Math.min(cupom.desconto, valorRestante);
    mensagem = `Cupom de desconto de R$ ${valorDisponivel.toFixed(2)} aplicado`;
  }
  
  // Verifica se o valor disponível é maior que zero
  if (valorDisponivel <= 0) {
    return { 
      valido: false, 
      mensagem: 'Este cupom não possui valor disponível para esta compra' 
    };
  }
  
  // Prepara o objeto do cupom aplicado
  const cupomAplicado = {
    id: cupom.id,
    codigo: cupom.codigo,
    tipo: cupom.tipo,
    valorDesconto: valorDisponivel,
    valorOriginal: cupom.tipo === 'credito' || cupom.tipo === 'troca' ? cupom.valor : cupom.desconto,
    usadoCompleto: usadoCompleto,
    zerarFrete: cupom.zerarFrete || false,
    valorUsadoAnteriormente: cupom.valorUsado || 0
  };
  
  // Para cupons de crédito, adiciona informação do saldo anterior
  if (cupom.tipo === 'credito') {
    cupomAplicado.saldoAnterior = cupom.valor - (cupom.valorUsado || 0);
    cupomAplicado.saldoRestante = cupomAplicado.saldoAnterior - valorDisponivel;
  }
  
  // Para cupons de troca, adiciona informação do valor total
  if (cupom.tipo === 'troca') {
    cupomAplicado.valorTotal = cupom.valor;
    cupomAplicado.saldoRestante = cupom.valor - valorDisponivel;
  }

  return {
    valido: true,
    cupom: cupomAplicado,
    valorDesconto: valorDisponivel,
    valorFinal: Math.max(0, totalCompra - descontoExistente - valorDisponivel),
    zerarFrete: cupom.zerarFrete || false,
    mensagem: mensagem
  };
}

function atualizarTotalComCupom(subtotal, desconto, zerarFrete = false) {
  const freteText = document.getElementById('frete').textContent;
  let frete = parseFloat(freteText.replace('R$', '').replace(',', '.'));
  
  // Zera o frete se o cupom tiver essa propriedade
  if (zerarFrete) {
    frete = 0;
    document.getElementById('frete').textContent = 'R$ 0,00';
  }
  
  // Calcula o valor total sem desconto
  const totalSemDesconto = subtotal + frete;
  
  // Ajusta o desconto para não ultrapassar o valor total
  const descontoAplicado = Math.min(desconto, totalSemDesconto);
  
  // Calcula o valor final (nunca menor que zero)
  const valorFinal = Math.max(0, totalSemDesconto - descontoAplicado);
  
  // Atualiza a exibição
  document.getElementById('total').textContent = `R$ ${valorFinal.toFixed(2)}`;
  document.getElementById('valor-desconto').textContent = `-R$ ${descontoAplicado.toFixed(2)}`;
  
  // Mostra a linha de desconto
  document.getElementById('cupom-line').style.display = 'flex';
}

function removerCupom() {
  const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
  if (!clienteLogado) return;

  // Restaura o frete original se o cupom zerava o frete
  if (cupomAplicado && cupomAplicado.zerarFrete) {
    const subtotalText = document.getElementById('subtotal').textContent;
    const subtotal = parseFloat(subtotalText.replace('R$', '').replace(',', '.'));
    
    // Obtém o endereço selecionado para recalcular o frete
    const enderecoSelect = document.getElementById('select-endereco');
    if (enderecoSelect && enderecoSelect.value) {
      const enderecoId = parseInt(enderecoSelect.value);
      const endereco = enderecos.find(e => e.id == enderecoId);
      
      if (endereco) {
        const frete = calcularFrete(subtotal, endereco.estado);
        document.getElementById('frete').textContent = `R$ ${frete.toFixed(2)}`;
      }
    }
  }

  cupomAplicado = null;
  document.getElementById('cupom-aplicado').style.display = 'none';
  document.getElementById('input-cupom').value = '';
  document.getElementById('cupom-line').style.display = 'none';
  
  // Recalcula o total
  const subtotalText = document.getElementById('subtotal').textContent;
  const subtotal = parseFloat(subtotalText.replace('R$', '').replace(',', '.'));
  const freteText = document.getElementById('frete').textContent;
  const frete = parseFloat(freteText.replace('R$', '').replace(',', '.'));
  
  document.getElementById('total').textContent = `R$ ${(subtotal + frete).toFixed(2)}`;
}

    /* Notificações */
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
    lida: false
  };
  
  notificacoes.unshift(novaNotificacao);
  salvarNotificacoesUsuario(notificacoes);
  atualizarBadgeNotificacao();
  
  if (document.visibilityState === 'visible') {
    mostrarNotificacaoToast(novaNotificacao);
  }
  
  return novaNotificacao;
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

    function exibirNotificacoes(event) {
      event.stopPropagation();
      const dropdown = document.getElementById('notificacao-dropdown');
      if (!dropdown) return;

      dropdown.classList.toggle('show');
      if (dropdown.classList.contains('show')) {
        carregarListaNotificacoes();
      }
    }

function carregarListaNotificacoes() {
  const list = document.getElementById('notificacao-list');
  if (!list) return;
  
  const notificacoes = obterNotificacoesUsuario();

  if (notificacoes.length === 0) {
    list.innerHTML = '<div class="notificacao-item">Nenhuma notificação.</div>';
    return;
  }

  list.innerHTML = notificacoes.map(n => `
    <div class="notificacao-item ${n.lida ? '' : 'unread'}" 
         onclick="marcarComoLida(${n.id}, this)">
      <div class="notificacao-titulo">${n.titulo}</div>
      <div class="notificacao-mensagem">${n.mensagem}</div>
      <div class="notificacao-data">${formatarData(n.data)}</div>
    </div>
  `).join('');
}

    function formatarData(dataISO) {
      const data = new Date(dataISO);
      return data.toLocaleString('pt-BR');
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

  function esvaziarCarrinhoPorTempo() {
  const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
  if (!cliente) return;

  const carrinhosPorUsuario = JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
  const carrinhoExpirado = carrinhosPorUsuario[cliente.id] || [];

  // Salva os itens expirados no localStorage com timestamp
  const itensExpirados = {
    items: carrinhoExpirado,
    expiredAt: new Date().toISOString()
  };
  localStorage.setItem(`itensExpirados_${cliente.id}`, JSON.stringify(itensExpirados));

  // Limpa o carrinho
  delete carrinhosPorUsuario[cliente.id];
  localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhosPorUsuario));

  // Remove os timers
  localStorage.removeItem(`carrinhoExpiracaoTimestamp_${cliente.id}`);
  localStorage.removeItem(`carrinhoUltimoAcesso_${cliente.id}`);

  carrinho = [];
  carregarCarrinho();
  mostrarItensExpirados();
  showNotification('Tempo esgotado! O carrinho foi esvaziado.', 'danger');

  const timerDisplay = document.getElementById('timer-display');
  if (timerDisplay) {
    timerDisplay.textContent = 'Carrinho expirado!';
  }
}

function restaurarCarrinhoExpirado() {
  const carrinhoSalvo = JSON.parse(localStorage.getItem('ultimoCarrinhoExpirado'));
  if (carrinhoSalvo && Array.isArray(carrinhoSalvo)) {
    carrinho = carrinhoSalvo;
    atualizarCarrinho();

    // Salvar novamente como carrinho ativo
    const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
    if (cliente) {
      const carrinhosPorUsuario = JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
      carrinhosPorUsuario[cliente.id] = carrinho;
      localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhosPorUsuario));
    }

    showNotification('Carrinho restaurado com sucesso!', 'success');
    localStorage.removeItem('ultimoCarrinhoExpirado');
    document.getElementById('btn-restaurar-carrinho').style.display = 'none';

    // Reiniciar o temporizador com o tempo completo
    const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
    if (clienteLogado) {
      const chaveExpiracao = `carrinhoExpiracaoTimestamp_${clienteLogado.id}`;
      localStorage.removeItem(chaveExpiracao);
      localStorage.removeItem(`carrinhoTempoRestante_${clienteLogado.id}`);
    }
    
    iniciarTemporizadorCarrinho();
  }
}
function mostrarBotaoRestaurarCarrinho() {
  const existe = localStorage.getItem('ultimoCarrinhoExpirado');
  if (existe) {
    document.getElementById('btn-restaurar-carrinho').style.display = 'inline-block';
  }
}


const style = document.createElement('style');
style.textContent = `
  .valor-cartao.is-invalid {
    border-color: #dc3545;
    background-color: #fff3f3;
  }
  
  .resumo-cartao-item.text-danger {
    color: #dc3545 !important;
  }
`;
document.head.appendChild(style);

const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
  .notificacao-icon-container {
    position: relative;
    display: inline-block;
    margin-left: 15px;
  }
  
  .notificacao-dropdown {
    position: absolute;
    right: 0;
    top: 100%;
    width: 350px;
    max-height: 500px;
    overflow-y: auto;
    background: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 1000;
    display: none;
  }
  
  .notificacao-header {
    padding: 10px 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .notificacao-header h3 {
    margin: 0;
    font-size: 1rem;
  }
  
  .notificacao-header button {
    background: none;
    border: none;
    color: var(--primary-color);
    cursor: pointer;
    font-size: 0.8rem;
  }
  
  .notificacao-list {
    padding: 0;
  }
  
  .notificacao-item {
    padding: 10px 15px;
    border-bottom: 1px solid #f5f5f5;
    cursor: pointer;
  }
  
  .notificacao-item:hover {
    background-color: #f9f9f9;
  }
  
  .notificacao-item.unread {
    background-color: #f0f7ff;
  }
  
  .notificacao-titulo {
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .notificacao-mensagem {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 5px;
    white-space: pre-line;
  }
  
  .notificacao-data {
    font-size: 0.75rem;
    color: #999;
  }
  
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
    z-index: 1100;
    max-width: 300px;
    border-left: 4px solid var(--primary-color);
  }
  
  .notificacao-toast.show {
    transform: translateX(0);
  }
  
  .notificacao-toast.success {
    border-left-color: #28a745;
  }
  
  .notificacao-toast.error {
    border-left-color: #dc3545;
  }
  
  .notificacao-toast.payment {
    border-left-color: #17a2b8;
  }
  
  .notificacao-toast.pedido {
    border-left-color: #6f42c1;
  }
  
  .notificacao-toast.cupom {
    border-left-color: #fd7e14;
  }
`;
document.head.appendChild(notificationStyle);


function mostrarItensExpirados() {
  const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
  if (!cliente) return;

  const dadosExpirados = JSON.parse(localStorage.getItem(`itensExpirados_${cliente.id}`));
  const itensExpirados = dadosExpirados?.items || [];
  
  const container = document.getElementById('expired-items-container');
  const tbody = document.getElementById('expired-items');

  if (itensExpirados.length === 0) {
    container.style.display = 'none';
    return;
  }

  // Calcula há quanto tempo os itens expiraram
  const expiredAt = new Date(dadosExpirados.expiredAt);
  const agora = new Date();
  const horasDesdeExpiracao = Math.floor((agora - expiredAt) / (1000 * 60 * 60));

  Promise.all(
    itensExpirados.map(async item => {
      const res = await fetch(`/api/livros/${item.id}`);
      if (!res.ok) throw new Error(`Erro ao buscar produto ${item.id}`);
      const produto = await res.json();
      return { ...item, produto };
    })
  ).then(itensDetalhados => {
    tbody.innerHTML = itensDetalhados.map(item => `
      <tr class="expired-item" data-id="${item.id}">
        <td data-label="Produto">
          <div class="d-flex align-items-center">
            <img src="${item.produto.imagemUrl || 'img/livro-placeholder.jpg'}" 
                 alt="${item.produto.titulo}" 
                 class="carrinho-item-imagem me-3">
            <div class="carrinho-item-titulo">${item.produto.titulo}</div>
          </div>
        </td>
        <td data-label="Preço">R$ ${item.produto.precoVenda.toFixed(2)}</td>
        <td data-label="Quantidade">${item.quantidade}</td>
        <td data-label="Motivo">
          Expirado há ${horasDesdeExpiracao} ${horasDesdeExpiracao === 1 ? 'hora' : 'horas'}
        </td>
        <td>
          <button class="carrinho-item-remover" onclick="restaurarItemExpirado(${item.id})" title="Restaurar para o carrinho">
            <i class="bi bi-arrow-counterclockwise"></i>
          </button>
        </td>
      </tr>
    `).join('');

    container.style.display = 'block';
  }).catch(error => {
    console.error('Erro ao carregar itens expirados:', error);
    container.style.display = 'none';
  });
}

function restaurarItemExpirado(idProduto) {
  const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
  if (!cliente) return;

  const dadosExpirados = JSON.parse(localStorage.getItem(`itensExpirados_${cliente.id}`));
  if (!dadosExpirados) return;

  const itensExpirados = dadosExpirados.items || [];
  const item = itensExpirados.find(i => i.id === idProduto);
  
  if (!item) {
    showNotification('Item não encontrado para restauração', 'danger');
    return;
  }

  // Adiciona o item de volta ao carrinho
  const carrinhosPorUsuario = JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
  const carrinhoUsuario = carrinhosPorUsuario[cliente.id] || [];
  
  // Verifica se o item já está no carrinho
  const itemExistente = carrinhoUsuario.find(i => i.id === idProduto);
  
  if (itemExistente) {
    itemExistente.quantidade += item.quantidade;
  } else {
    carrinhoUsuario.push(item);
  }
  
  carrinhosPorUsuario[cliente.id] = carrinhoUsuario;
  localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhosPorUsuario));

  // Remove o item da lista de expirados
  const novosExpirados = itensExpirados.filter(i => i.id !== idProduto);
  
  if (novosExpirados.length > 0) {
    localStorage.setItem(`itensExpirados_${cliente.id}`, JSON.stringify({
      items: novosExpirados,
      expiredAt: dadosExpirados.expiredAt
    }));
  } else {
    localStorage.removeItem(`itensExpirados_${cliente.id}`);
  }

  // Atualiza a exibição
  carrinho = carrinhoUsuario;
  carregarCarrinho();
  mostrarItensExpirados();
  showNotification('Item restaurado ao carrinho!', 'success');

  // Reinicia o temporizador
  iniciarTemporizadorCarrinho();
}

function limparItensExpirados() {
  const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
  if (!cliente) return;

  if (confirm('Tem certeza que deseja remover permanentemente todos os itens expirados?')) {
    localStorage.removeItem(`itensExpirados_${cliente.id}`);
    document.getElementById('expired-items-container').style.display = 'none';
    showNotification('Itens expirados removidos permanentemente', 'info');
  }
}

function toggleCuponsDisponiveis() {
      const container = document.getElementById('cupons-disponiveis');
      container.style.display = container.style.display === 'block' ? 'none' : 'block';
      
      if (container.style.display === 'block') {
        carregarCuponsDisponiveis();
      }
    }

      function carregarCuponsDisponiveis() {
      const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
      if (!clienteLogado) return;
      
      const cuponsPorUsuario = JSON.parse(localStorage.getItem('cuponsPorUsuario')) || {};
      const cuponsUsuario = cuponsPorUsuario[clienteLogado.id] || [];
      
      // Filtra apenas cupons de troca não utilizados e não expirados
      const cuponsDisponiveis = cuponsUsuario.filter(cupom => 
        cupom.tipo === 'troca' && 
        !cupom.usado && 
        new Date(cupom.dataExpiracao) > new Date()
      );
      
      const listaCupons = document.getElementById('lista-cupons-disponiveis');
      
      if (cuponsDisponiveis.length === 0) {
        listaCupons.innerHTML = '<p>Nenhum cupom de troca disponível.</p>';
        return;
      }
      
      listaCupons.innerHTML = cuponsDisponiveis.map(cupom => `
        <div class="cupom-disponivel-item" onclick="selecionarCupomDisponivel('${cupom.codigo}')">
          <strong>${cupom.codigo}</strong> - R$ ${cupom.valor.toFixed(2)}
          <br><small>Válido até: ${new Date(cupom.dataExpiracao).toLocaleDateString('pt-BR')}</small>
        </div>
      `).join('');
    }

     // Função para selecionar um cupom da lista de disponíveis
    function selecionarCupomDisponivel(codigoCupom) {
      document.getElementById('input-cupom').value = codigoCupom;
      document.getElementById('cupons-disponiveis').style.display = 'none';
      aplicarCupom();
    }

 async function finalizarCompra() {
  try {
    const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
    if (!cliente) {
      alert('Faça login para finalizar sua compra.');
      window.location.href = 'principal.html';
      return;
    }

    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    const enderecoId = parseInt(document.getElementById('select-endereco').value);
    if (!enderecoId) {
      alert('Selecione um endereço de entrega');
      return;
    }

    const subtotalText = document.getElementById('subtotal').textContent;
    const subtotal = parseFloat(subtotalText.replace('R$', '').replace(',', '.'));
    
    const freteText = document.getElementById('frete').textContent;
    const frete = parseFloat(freteText.replace('R$', '').replace(',', '.'));
    
    const totalCompraText = document.getElementById('total').textContent;
    const totalCompra = parseFloat(totalCompraText.replace('R$', '').replace(',', '.'));
    
    const descontoCupons = cuponsAplicados.reduce((total, cupom) => total + cupom.valorDesconto, 0);

    let valorRestante = (subtotal + frete) - descontoCupons;
    if (valorRestante < 0) {
      valorRestante = 0;
    }

    if (valorRestante > 0) {
      const totalCartoes = cartoesSelecionados.reduce((sum, cartao) => sum + (cartao.valor || 0), 0);

      if (Math.abs(totalCartoes - valorRestante) > 0.01) {
        alert(`O valor dos cartões (R$ ${totalCartoes.toFixed(2)}) deve ser igual ao valor restante após os cupons (R$ ${valorRestante.toFixed(2)})`);
        return;
      }

      const cartoesComValorInvalido = cartoesSelecionados.some(c => c.valor > 0 && c.valor < 10);
      if (cartoesComValorInvalido) {
        alert('Cada cartão deve ter um valor mínimo de R$ 10,00');
        return;
      }
    }

    const itensCompletos = await Promise.all(
      carrinho.map(async item => {
        try {
          const response = await fetch(`/api/livros/${item.id}`);
          if (!response.ok) throw new Error(`Erro ao buscar produto ${item.id}`);
          const produto = await response.json();
          return {
            livroId: item.id,
            quantidade: item.quantidade,
            precoUnitario: produto.precoVenda,
            titulo: produto.titulo
          };
        } catch (error) {
          console.error('Erro ao carregar produto:', error);
          return {
            livroId: item.id,
            quantidade: item.quantidade,
            precoUnitario: 0,
            titulo: 'Produto não disponível'
          };
        }
      })
    );

    const pedido = {
      clienteId: cliente.id,
      itens: itensCompletos,
      enderecoId: enderecoId,
      subtotal: subtotal,
      valorFrete: frete,
      valorTotal: totalCompra,
      status: 'PENDENTE',
      dataPedido: new Date().toISOString(),
    };

    if (valorRestante > 0 && cartoesSelecionados.length > 0) {
      pedido.pagamentos = cartoesSelecionados
        .filter(c => c.id && c.valor > 0)
        .map(cartao => ({
          cartaoId: cartao.id,
          valor: cartao.valor,
          bandeira: cartao.bandeira,
          ultimosDigitos: cartao.ultimosDigitos,
          nomeTitular: cartoes.find(c => c.id === cartao.id)?.nomeTitular || ''
        }));
    } else if (valorRestante === 0 && cartoesSelecionados.length > 0) {
      const cartaoPrincipal = cartoesSelecionados[0];
      pedido.pagamentos = [{
        cartaoId: cartaoPrincipal.id,
        valor: 0,
        bandeira: cartaoPrincipal.bandeira,
        ultimosDigitos: cartaoPrincipal.ultimosDigitos,
        nomeTitular: cartoes.find(c => c.id === cartaoPrincipal.id)?.nomeTitular || ''
      }];
    }

    if (cartoesSelecionados.length > 0 && cuponsAplicados.length > 0) {
      pedido.metodoPagamento = 'Cartões e Cupons';
    } else if (cartoesSelecionados.length > 1) {
      pedido.metodoPagamento = 'Múltiplos cartões';
    } else if (cartoesSelecionados.length === 1) {
      pedido.metodoPagamento = `${cartoesSelecionados[0].bandeira}`;
    } else if (cuponsAplicados.length > 0) {
      pedido.metodoPagamento = 'Cupons de troca';
    } else {
      pedido.metodoPagamento = 'Não especificado';
    }

    if (cuponsAplicados.length > 0) {
      pedido.cupons = cuponsAplicados.map(cupom => ({
        cupomId: cupom.id,
        codigoCupom: cupom.codigo,
        valorDesconto: cupom.valorDesconto,
        tipo: cupom.tipo,
        usadoCompleto: cupom.usadoCompleto || false
      }));
      pedido.valorDesconto = descontoCupons;
    }

    console.log('Dados do pedido:', pedido);

    const response = await fetch('/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(pedido)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro da API:', errorData);
      let errorMessage = 'Erro ao processar pedido';
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (response.status === 400) {
        errorMessage = 'Selecione ao menos um cartão';
      } else if (response.status === 500) {
        errorMessage = 'Erro interno do servidor';
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (cuponsAplicados.length > 0) {
      const cuponsPorUsuario = JSON.parse(localStorage.getItem('cuponsPorUsuario')) || {};
      if (cuponsPorUsuario[cliente.id]) {
        cuponsAplicados.forEach(cupomAplicado => {
          const cupomIndex = cuponsPorUsuario[cliente.id].findIndex(c => c.id === cupomAplicado.id);
          if (cupomIndex !== -1) {
            let cupom = cuponsPorUsuario[cliente.id][cupomIndex];
            if (cupom.tipo === 'credito') {
              cupom.valorUsado = (cupom.valorUsado || 0) + cupomAplicado.valorDesconto;
              if (cupom.valorUsado >= cupom.valor) {
                cupom.usado = true;
                cupom.valorUsado = cupom.valor;
              }
            } else if (cupom.tipo === 'troca') {
              cupom.usado = true;
              cupom.dataUso = new Date().toISOString();
            } else {
              cupom.usado = true;
            }
            cuponsPorUsuario[cliente.id][cupomIndex] = cupom;
          }
        });
        localStorage.setItem('cuponsPorUsuario', JSON.stringify(cuponsPorUsuario));
      }
    }

    clearTimeout(temporizadorCarrinho);
    clearInterval(intervaloContador);
    
    const timerDisplay = document.getElementById('cart-timer');
    if (timerDisplay) timerDisplay.style.display = 'none';

    const notificacao = document.getElementById('notificacao-sucesso');
    if (notificacao) {
      notificacao.style.display = 'block';
    }

    let infoPagamento = '';
    if (cartoesSelecionados.length > 0 && cartoesSelecionados.some(c => c.valor > 0)) {
      infoPagamento = cartoesSelecionados
        .filter(c => c.valor > 0)
        .map(c => `${c.bandeira} (****${c.ultimosDigitos}): R$ ${c.valor.toFixed(2)}`)
        .join('\n');
    }
    
    if (cuponsAplicados.length > 0) {
      const infoCupons = cuponsAplicados
        .map(c => `Cupom ${c.codigo}: -R$ ${c.valorDesconto.toFixed(2)}`)
        .join('\n');
      infoPagamento = infoPagamento ? `${infoPagamento}\n${infoCupons}` : infoCupons;
    }

    adicionarNotificacao(
      'Compra realizada!', 
      `Pedido #${data.id || 'N/A'} confirmado.\n${infoPagamento ? '\n' + infoPagamento + '\n' : ''}\nTotal: R$ ${totalCompra.toFixed(2)}`,
      'success'
    );

    setTimeout(() => {
      cartoesSelecionados.filter(c => c.valor > 0).forEach(cartao => {
        adicionarNotificacao(
          'Pagamento aprovado', 
          `Pagamento de R$ ${cartao.valor.toFixed(2)} no ${cartao.bandeira} ****${cartao.ultimosDigitos} aprovado`,
          'payment'
        );
      });
      if (cuponsAplicados.length > 0) {
        adicionarNotificacao(
          'Cupons processados', 
          `${cuponsAplicados.length} cupom(ns) de troca aplicado(s) com sucesso`,
          'cupom'
        );
      }
      setTimeout(() => {
        adicionarNotificacao(
          'Pedido em processamento', 
          `Seu pedido #${data.id} está sendo preparado para envio`,
          'pedido'
        );
      }, 1500);
    }, 2000);

    limparCarrinhoAposCompra(cliente.id);

    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
      btnFinalizar.textContent = 'Ver Compras';
      btnFinalizar.onclick = function() {
        window.location.href = `pedidos.html?clienteId=${cliente.id}`;
      };
    }

    setTimeout(() => {
      if (notificacao) {
        notificacao.style.display = 'none';
      }
    }, 3000);

  } catch (error) {
    console.error('Erro ao finalizar compra:', error);
    let errorMessage = 'Erro ao finalizar compra. ';
    if (error.message.includes('Failed to fetch')) {
      errorMessage += 'Erro de conexão com o servidor.';
    } else {
      errorMessage += error.message;
    }
    adicionarNotificacao('Falha na compra', errorMessage, 'error');
    alert(`${errorMessage}\n\nPor favor, selecione um cartão e tente novamente.`);
  }
}

// Função auxiliar para limpar o carrinho após compra
function limparCarrinhoAposCompra(clienteId) {
  // Limpa o carrinho
  const carrinhosPorUsuario = JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
  delete carrinhosPorUsuario[clienteId];
  localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhosPorUsuario));
  
  // Limpa os cartões selecionados
  cartoesSelecionados = [];
  const cartoesContainer = document.getElementById('cartoes-container');
  if (cartoesContainer) cartoesContainer.innerHTML = '';
  
  const resumoPagamento = document.getElementById('resumo-pagamento');
  if (resumoPagamento) resumoPagamento.style.display = 'none';
  
  // Limpa os cupons aplicados
  cuponsAplicados = [];
  const cuponsContainer = document.getElementById('cupons-aplicados-container');
  if (cuponsContainer) cuponsContainer.innerHTML = '';
  
  const inputCupom = document.getElementById('input-cupom');
  if (inputCupom) inputCupom.value = '';
  
  const cupomLine = document.getElementById('cupom-line');
  if (cupomLine) cupomLine.style.display = 'none';
  
  // Recarrega o carrinho para atualizar a UI
  carrinho = [];
  carregarCarrinho();
}

// Função para abrir o modal de novo endereço
function abrirModalNovoEndereco() {
  // Limpa o formulário
  document.getElementById('form-novo-endereco').reset();
  document.getElementById('novo-endereco-pais').value = 'Brasil';
  
  // Abre o modal
  const modal = new bootstrap.Modal(document.getElementById('modalNovoEndereco'));
  modal.show();
}

// Função para salvar o novo endereço
async function salvarNovoEndereco() {
  try {
    const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
    if (!cliente) {
      alert('Você precisa estar logado para adicionar um endereço');
      return;
    }

    // Coleta os dados do formulário
    const novoEndereco = {
      nomeEndereco: document.getElementById('novo-endereco-nome').value.trim(),
      cep: document.getElementById('novo-endereco-cep').value,
      rua: document.getElementById('novo-endereco-rua').value,
      numero: document.getElementById('novo-endereco-numero').value,
      complemento: document.getElementById('novo-endereco-complemento').value || null,
      bairro: document.getElementById('novo-endereco-bairro').value,
      cidade: document.getElementById('novo-endereco-cidade').value,
      estado: document.getElementById('novo-endereco-estado').value,
      pais: document.getElementById('novo-endereco-pais').value,
      tipoResidencia: document.getElementById('novo-endereco-tipo-residencia').value,
      tipoLogradouro: document.getElementById('novo-endereco-tipo-logradouro').value,
      logradouro: document.getElementById('novo-endereco-logradouro').value,
      tipo: 'ENTREGA',
      cliente: { id: cliente.id } // Inclui o cliente no objeto
    };

    // Validação básica
    const camposObrigatorios = [
      'nomeEndereco', 'cep', 'rua', 'numero',
      'bairro', 'cidade', 'estado',
      'tipoResidencia', 'tipoLogradouro', 'logradouro'
    ];
    for (const campo of camposObrigatorios) {
      if (!novoEndereco[campo]) {
        alert(`O campo ${campo.replace('novo-endereco-', '').replace(/-/g, ' ')} é obrigatório`);
        return;
      }
    }

    // Envia para a API
    const response = await fetch(`/api/enderecos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoEndereco)
    });

    if (!response.ok) {
      throw new Error('Erro ao salvar endereço');
    }

    const enderecoSalvo = await response.json();

    // Fecha o modal de cadastro
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovoEndereco'));
    modal.hide();

    // Recarrega a lista de endereços
    await carregarEnderecos();

    // Seleciona automaticamente o novo endereço
    document.getElementById('select-endereco').value = enderecoSalvo.id;
    mostrarDetalhesEndereco();

    // Abre o modal de sucesso
  const modalSucesso = new bootstrap.Modal(document.getElementById('modalSucessoEndereco'));
  modalSucesso.show();


  } catch (error) {
    console.error('Erro ao salvar endereço:', error);
    alert('Erro ao salvar endereço. Tente novamente.');
  }
}


// Máscara para CEP e busca automática
document.addEventListener('DOMContentLoaded', function () {
  // Máscara para CEP no modal de endereço
  const cepInput = document.getElementById('novo-endereco-cep');
  cepInput?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    e.target.value = value.substring(0, 9);
  });
  cepInput?.addEventListener('blur', function (e) {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) buscarEnderecoPorCEP(cep);
  });

  // Máscara para número do cartão no modal de cartão
  const numeroCartaoInput = document.getElementById('novo-cartao-numero');
  numeroCartaoInput?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.match(/.{1,4}/g)?.join(' ') || '';
    e.target.value = value.substring(0, 19);
  });

  // Máscara para CVV
  const cvvInput = document.getElementById('novo-cartao-cvv');
  cvvInput?.addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
  });

});


// Função para buscar endereço via CEP
async function buscarEnderecoPorCEP(cep) {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (response.ok) {
      const data = await response.json();
      if (!data.erro) {
        document.getElementById('novo-endereco-rua').value = data.logradouro || '';
        document.getElementById('novo-endereco-bairro').value = data.bairro || '';
        document.getElementById('novo-endereco-cidade').value = data.localidade || '';
        document.getElementById('novo-endereco-estado').value = data.uf || '';
        document.getElementById('novo-endereco-logradouro').value = data.logradouro || '';
        document.getElementById('novo-endereco-tipo-logradouro').value = obterTipoLogradouro(data.logradouro);
      }
    }
  } catch (error) {
    console.log('Erro ao buscar CEP:', error);
  }
}

// Função auxiliar para determinar tipo de logradouro
function obterTipoLogradouro(logradouro) {
  if (!logradouro) return '';
  const primeiraPalavra = logradouro.split(' ')[0].toLowerCase();
  const tipos = ['rua', 'avenida', 'av', 'alameda', 'praça', 'travessa', 'rodovia', 'estrada'];
  for (const tipo of tipos) {
    if (primeiraPalavra.includes(tipo)) {
      return tipo.charAt(0).toUpperCase() + tipo.slice(1);
    }
  }
  return 'Rua';
}

// Função para abrir o modal de novo cartão
function abrirModalNovoCartao() {
  // Limpa o formulário
  document.getElementById('form-novo-cartao').reset();
  
  // Define a data mínima como o mês atual
  const hoje = new Date();
  const mesAtual = hoje.toISOString().slice(0, 7);
  document.getElementById('novo-cartao-validade').min = mesAtual;
  
  // Abre o modal
  const modal = new bootstrap.Modal(document.getElementById('modalNovoCartao'));
  modal.show();
}

// Função para salvar o novo cartão
async function salvarNovoCartao() {
  try {
    const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
    if (!cliente) {
      alert('Você precisa estar logado para adicionar um cartão');
      return;
    }

    // Coleta os dados do formulário
    const novoCartao = {
      numero: document.getElementById('novo-cartao-numero').value.replace(/\s/g, ''),
      nomeTitular: document.getElementById('novo-cartao-nome').value.trim(),
      bandeira: document.getElementById('novo-cartao-bandeira').value,
      cvv: document.getElementById('novo-cartao-cvv').value,
      dataValidade: document.getElementById('novo-cartao-validade').value,
      preferencial: document.getElementById('novo-cartao-preferencial').checked
    };

    // Validação básica
    const camposObrigatorios = ['numero', 'nomeTitular', 'bandeira', 'cvv', 'dataValidade'];
    for (const campo of camposObrigatorios) {
      if (!novoCartao[campo]) {
        alert(`O campo ${campo.replace('novo-cartao-', '').replace(/-/g, ' ')} é obrigatório`);
        return;
      }
    }

    // Validação do número do cartão
    if (novoCartao.numero.length < 13 || novoCartao.numero.length > 19) {
      alert('Número do cartão inválido. Deve ter entre 13 e 19 dígitos.');
      return;
    }

    // Validação do CVV
    if (novoCartao.cvv.length < 3 || novoCartao.cvv.length > 4) {
      alert('CVV inválido. Deve ter 3 ou 4 dígitos.');
      return;
    }

    // Validação da data de validade
    const dataValidade = new Date(novoCartao.dataValidade + '-01');
    const hoje = new Date();
    if (dataValidade < hoje) {
      alert('Cartão expirado. Por favor, insira uma data de validade futura.');
      return;
    }

    // Envia para a API
    const response = await fetch(`/api/clientes/${cliente.id}/cartoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoCartao)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao salvar cartão');
    }

    const cartaoSalvo = await response.json();
    
    // Fecha o modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovoCartao'));
    modal.hide();

    // Recarrega a lista de cartões
    await carregarCartoes();
    
    // Adiciona automaticamente o novo cartão à seleção
    adicionarCartaoSelecionado(cartaoSalvo.id);

    // Exibe o modal de sucesso
    const modalSucesso = new bootstrap.Modal(document.getElementById('modalSucessoCartao'));
    modalSucesso.show();


  } catch (error) {
    console.error('Erro ao salvar cartão:', error);
    alert('Erro ao salvar cartão: ' + error.message);
  }
}

// Função para adicionar automaticamente o cartão recém-criado
function adicionarCartaoSelecionado(cartaoId) {
  const cartoesContainer = document.getElementById('cartoes-container');
  const cartao = cartoes.find(c => c.id === cartaoId);
  
  if (!cartao) return;

  const novoId = Date.now();
  
  const cartaoHtml = `
    <div class="cartao-pagamento" data-id="${novoId}">
      <button class="remove-cartao" onclick="removerCartao(${novoId})">
        <i class="bi bi-trash"></i>
      </button>
      <select class="form-control select-cartao" onchange="atualizarDetalhesCartao(${novoId}, this.value)">
        <option value="">-- Selecione um cartão --</option>
        ${cartoes.map(c => `
          <option value="${c.id}" ${c.id === cartaoId ? 'selected' : ''}>
            ${c.bandeira} **** **** **** ${c.numero.slice(-4)}
          </option>
        `).join('')}
      </select>
      <div class="detalhes-cartao-${novoId} detalhes-box mt-2"></div>
      <div class="cartao-valor">
        <span>R$</span>
        <input type="number" class="form-control valor-cartao" 
               placeholder="Mínimo R$ 10,00" min="0.01" step="0.01"
               onchange="atualizarResumoPagamento()">
      </div>
    </div>
  `;

  cartoesContainer.insertAdjacentHTML('beforeend', cartaoHtml);
  
  // Atualiza os detalhes do cartão selecionado
  atualizarDetalhesCartao(novoId, cartaoId);
  
  document.getElementById('resumo-pagamento').style.display = 'block';
}
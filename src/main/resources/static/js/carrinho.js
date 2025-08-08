    let cartoesSelecionados = [];

    let cartTimer = null;
    let cartTimeoutDuration = 15; // segundos

    let temporizadorCarrinho = null;
    let intervaloContador = null;
    const TEMPO_LIMITE_CARRINHO = 5000; 

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

  // Atualiza o resumo
  resumoCartoes.innerHTML = cartoesSelecionados
    .filter(c => c.valor > 0)
    .map(cartao => `
      <div class="resumo-cartao-item ${cartao.valor < 10 ? 'text-danger' : ''}">
        <span>${cartao.bandeira} ****${cartao.ultimosDigitos}:</span>
        <span>R$ ${cartao.valor.toFixed(2)} ${cartao.valor < 10 ? '(Mínimo: R$ 10,00)' : ''}</span>
      </div>
    `).join('');

  document.getElementById('total-pagamento').textContent = `R$ ${totalPago.toFixed(2)}`;

  // Verifica se o total pago corresponde ao total da compra
  const totalCompraText = document.getElementById('total').textContent;
  const totalCompra = parseFloat(totalCompraText.replace('R$', '').replace(',', '.'));
  
  if (cartoesInvalidos) {
    resumoCartoes.innerHTML += `
      <div class="text-danger mt-2">
        Cada cartão deve ter um valor mínimo de R$ 10,00
      </div>
    `;
  } else if (totalPago.toFixed(2) !== totalCompra.toFixed(2)) {
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
      
      const carrinhosPorUsuario = JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
      return carrinhosPorUsuario[clienteLogado.id] || [];
    }

    function salvarCarrinhoUsuario(carrinho) {
      const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
      if (!clienteLogado) return;
      
      const carrinhosPorUsuario = JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
      carrinhosPorUsuario[clienteLogado.id] = carrinho;
      localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhosPorUsuario));
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



    let carrinho = obterCarrinhoUsuario();
    let enderecos = [];
    let cartoes = [];
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
        const frete = calcularFrete(subtotal, '');

        document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
        document.getElementById('frete').textContent = `R$ ${frete.toFixed(2)}`;

        // Verifica se há cupom aplicado
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
        if (cupomAplicado && clienteLogado) {
          const validacao = validarCupom(cupomAplicado.codigo, subtotal, clienteLogado.id);
          
          if (validacao.valido) {
            // Atualiza a UI do cupom
            document.getElementById('cupom-codigo').textContent = cupomAplicado.codigo;
            document.getElementById('cupom-aplicado').style.display = 'block';
            document.getElementById('input-cupom').value = cupomAplicado.codigo;
            
            // Atualiza o total com desconto
            atualizarTotalComCupom(subtotal, validacao.valorDesconto);
          } else {
            // Cupom inválido (pode ter expirado ou valor mínimo não atingido)
            removerCupom();
            document.getElementById('total').textContent = `R$ ${(subtotal + frete).toFixed(2)}`;
          }
        } else {
          // Sem cupom aplicado
          document.getElementById('total').textContent = `R$ ${(subtotal + frete).toFixed(2)}`;
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
    }

async function finalizarCompra() {
  try {
    const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
    if (!cliente) {
      alert('Faça login para finalizar sua compra.');
      window.location.href = 'principal.html';
      return;
    }

    // Verifica se há itens no carrinho
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

      const cartoesComValorInvalido = cartoesSelecionados.some(c => 
      c.valor > 0 && c.valor < 10
    );
    
    if (cartoesComValorInvalido) {
      alert('Cada cartão deve ter um valor mínimo de R$ 10,00');
      return;
    }

    // Valida endereço selecionado
    const enderecoId = parseInt(document.getElementById('select-endereco').value);
    if (!enderecoId) {
      alert('Selecione um endereço de entrega');
      return;
    }

    // Validação dos cartões
    const totalCompraText = document.getElementById('total').textContent;
    const totalCompra = parseFloat(totalCompraText.replace('R$', '').replace(',', '.'));
    
    const totalCartoes = cartoesSelecionados.reduce((sum, cartao) => sum + (cartao.valor || 0), 0);
    
    if (cartoesSelecionados.length === 0 || cartoesSelecionados.some(c => !c.id)) {
      alert('Adicione e selecione pelo menos um cartão para pagamento');
      return;
    }
    
    if (Math.abs(totalCartoes - totalCompra) > 0.01) { // Permite pequena diferença de arredondamento
      alert(`O valor total dos cartões (R$ ${totalCartoes.toFixed(2)}) deve ser igual ao valor da compra (R$ ${totalCompra.toFixed(2)})`);
      return;
    }

    // Carrega os detalhes completos dos produtos
    const itensCompletos = await Promise.all(
      carrinho.map(async item => {
        const response = await fetch(`/api/livros/${item.id}`);
        if (!response.ok) throw new Error(`Erro ao buscar produto ${item.id}`);
        const produto = await response.json();
        return {
          livroId: item.id,
          quantidade: item.quantidade,
          precoUnitario: produto.precoVenda,
          titulo: produto.titulo
        };
      })
    );

    // Calcula valores
    const subtotal = itensCompletos.reduce((total, item) => total + (item.precoUnitario * item.quantidade), 0);
    const freteText = document.getElementById('frete').textContent;
    const frete = parseFloat(freteText.replace('R$', '').replace(',', '.'));

    // Monta o objeto do pedido com múltiplos cartões
    const pedido = {
      clienteId: cliente.id,
      itens: itensCompletos,
      enderecoId: enderecoId,
      pagamentos: cartoesSelecionados.filter(c => c.id).map(cartao => ({
        cartaoId: cartao.id,
        valor: cartao.valor,
        bandeira: cartao.bandeira,
        ultimosDigitos: cartao.ultimosDigitos,
        nomeTitular: cartoes.find(c => c.id === cartao.id)?.nomeTitular || ''
      })),
      subtotal: subtotal,
      valorFrete: frete,
      valorTotal: totalCompra,
      status: 'PENDENTE',
      dataPedido: new Date().toISOString(),
      metodoPagamento: cartoesSelecionados.length > 1 ? 
        'Múltiplos cartões' : `${cartoesSelecionados[0].bandeira}`
    };

    // Adiciona informações do cupom se aplicado
    if (cupomAplicado) {
      const valorDesconto = subtotal - (totalCompra - frete);
      
      pedido.cupomId = cupomAplicado.id;
      pedido.codigoCupom = cupomAplicado.codigo;
      pedido.valorDesconto = valorDesconto;
      
      // Atualiza o cupom no localStorage
      const cuponsPorUsuario = JSON.parse(localStorage.getItem('cuponsPorUsuario')) || {};
      if (cuponsPorUsuario[cliente.id]) {
        const cupomIndex = cuponsPorUsuario[cliente.id].findIndex(c => c.id === cupomAplicado.id);
        if (cupomIndex !== -1) {
          const cupom = cuponsPorUsuario[cliente.id][cupomIndex];
          
          if (cupom.tipo === 'credito') {
            // Para cupons de crédito, atualiza o valor usado
            cupom.valorUsado = (cupom.valorUsado || 0) + valorDesconto;
            
            // Verifica se todo o crédito foi utilizado
            if (cupom.valorUsado >= cupom.valor) {
              cupom.usado = true;
              cupom.valorUsado = cupom.valor; // Garante que não ultrapasse
            }
            
            // Mensagem de notificação específica para cupons de crédito
            const saldoRestante = cupom.valor - cupom.valorUsado;
            const mensagem = saldoRestante > 0 ?
              `Cupom ${cupomAplicado.codigo} utilizado parcialmente (R$ ${saldoRestante.toFixed(2)} restantes)` :
              `Cupom ${cupomAplicado.codigo} totalmente utilizado`;
            
            adicionarNotificacao('Cupom utilizado', mensagem, 'cupom');
          } else {
            // Para outros tipos de cupom, marca como usado
            cupom.usado = true;
            adicionarNotificacao(
              'Cupom utilizado',
              `Cupom ${cupomAplicado.codigo} aplicado no pedido`,
              'cupom'
            );
          }
          
          // Atualiza o cupom no array
          cuponsPorUsuario[cliente.id][cupomIndex] = cupom;
          localStorage.setItem('cuponsPorUsuario', JSON.stringify(cuponsPorUsuario));
        }
      }
    }

    // Envia o pedido para a API
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
      throw new Error(errorData.message || 'Erro ao processar pedido');
    }

    const data = await response.json();

    // Limpa temporizador do carrinho
    clearTimeout(temporizadorCarrinho);
    clearInterval(intervaloContador);
    const timerDisplay = document.getElementById('cart-timer');
    if (timerDisplay) timerDisplay.style.display = 'none';

    // Notificação de sucesso
    const notificacao = document.getElementById('notificacao-sucesso');
    notificacao.style.display = 'block';
    
    // Notificação detalhada
    const infoPagamento = cartoesSelecionados.map(c => 
      `${c.bandeira} (****${c.ultimosDigitos}): R$ ${c.valor.toFixed(2)}`
    ).join('\n');
    
    adicionarNotificacao(
      'Compra realizada!', 
      `Pedido #${data.id} confirmado.\n\nFormas de pagamento:\n${infoPagamento}\n\nTotal: R$ ${data.valorTotal.toFixed(2)}`,
      'success'
    );
    
    // Simulação de processamento de pagamento
    setTimeout(() => {
      cartoesSelecionados.forEach(cartao => {
        adicionarNotificacao(
          'Pagamento aprovado', 
          `Pagamento de R$ ${cartao.valor.toFixed(2)} no ${cartao.bandeira} ****${cartao.ultimosDigitos} aprovado`,
          'payment'
        );
      });
      
      setTimeout(() => {
        adicionarNotificacao(
          'Pedido em processamento', 
          `Seu pedido #${data.id} está sendo preparado para envio`,
          'pedido'
        );
      }, 1500);
    }, 2000);

    // Limpa o carrinho
    const carrinhosPorUsuario = JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
    delete carrinhosPorUsuario[cliente.id];
    localStorage.setItem('carrinhosPorUsuario', JSON.stringify(carrinhosPorUsuario));
    
    // Limpa os cartões selecionados
    cartoesSelecionados = [];
    document.getElementById('cartoes-container').innerHTML = '';
    document.getElementById('resumo-pagamento').style.display = 'none';
    
    // Limpa o cupom aplicado
    cupomAplicado = null;
    document.getElementById('cupom-aplicado').style.display = 'none';
    document.getElementById('input-cupom').value = '';
    document.getElementById('cupom-line').style.display = 'none';
    
    // Atualiza o botão para "Ver Compras"
    const btnFinalizar = document.getElementById('btn-finalizar');
    btnFinalizar.textContent = 'Ver Compras';
    btnFinalizar.onclick = function() {
      window.location.href = `pedidos.html?clienteId=${cliente.id}`;
    };

    // Esconde a notificação após 3 segundos
    setTimeout(() => {
      notificacao.style.display = 'none';
    }, 3000);

  } catch (error) {
    console.error('Erro ao finalizar compra:', error);
    
    let errorMessage = 'Erro ao finalizar compra';
    if (error.message.includes('Failed to fetch')) {
      errorMessage = 'Erro de conexão com o servidor';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    adicionarNotificacao(
      'Falha na compra', 
      errorMessage,
      'error'
    );
    
    alert(`${errorMessage}\n\nPor favor, tente novamente.`);
  }
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
          opt.textContent = `${e.rua}, ${e.numero} - ${e.bairro}, ${e.cidade}`;
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

    // Inicializa com um campo de cartão se houver cartões disponíveis
    if (cartoes.length > 0) {
      adicionarCartao();
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
        const frete = calcularFrete(subtotal, endereco.estado);

        freteSpan.textContent = `R$ ${frete.toFixed(2)}`;
        
        // Recalcula o total considerando o cupom se existir
        if (cupomAplicado) {
          const validacao = validarCupom(cupomAplicado.codigo, subtotal, JSON.parse(localStorage.getItem('clienteLogado')).id);
          if (validacao.valido) {
            atualizarTotalComCupom(subtotal, validacao.valorDesconto);
          } else {
            removerCupom();
            totalSpan.textContent = `R$ ${(subtotal + frete).toFixed(2)}`;
          }
        } else {
          totalSpan.textContent = `R$ ${(subtotal + frete).toFixed(2)}`;
        }
      }
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

  const subtotalText = document.getElementById('subtotal').textContent;
  const subtotal = parseFloat(subtotalText.replace('R$', '').replace(',', '.'));

  const validacao = validarCupom(codigoCupom, subtotal, clienteLogado.id);
  
  if (!validacao.valido) {
    alert(validacao.mensagem);
    return;
  }

  // Armazena o cupom aplicado
  cupomAplicado = validacao.cupom;
  
  // Atualiza a UI para mostrar o cupom aplicado
  document.getElementById('cupom-codigo').textContent = cupomAplicado.codigo;
  document.getElementById('cupom-aplicado').style.display = 'block';
  
  // Mostra informações adicionais para cupons de crédito
  if (cupomAplicado.tipo === 'credito') {
    const valorDisponivel = cupomAplicado.valor - (cupomAplicado.valorUsado || 0);
    const valorAplicado = Math.min(valorDisponivel, subtotal);
    
    document.getElementById('cupom-aplicado').innerHTML = `
      <div class="d-flex justify-content-between">
        <span>Cupom aplicado: <strong id="cupom-codigo">${cupomAplicado.codigo}</strong></span>
        <button onclick="removerCupom()" style="background: none; border: none; color: #ff4757; cursor: pointer;">Remover</button>
      </div>
      <div class="cupom-info">
        <small>Valor disponível: R$ ${valorDisponivel.toFixed(2)}</small><br>
        <small>Valor aplicado: R$ ${valorAplicado.toFixed(2)}</small>
      </div>
    `;
  }
  
  // Atualiza o total
 if (validacao.zerarFrete) {
    document.getElementById('frete').textContent = 'R$ 0,00';
  }
  
  atualizarTotalComCupom(subtotal, validacao.valorDesconto, validacao.zerarFrete);
  
  if (validacao.mensagem) {
    alert(validacao.mensagem + (validacao.zerarFrete ? "\n\nFrete grátis aplicado!" : ""));
  }
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
  
  // Verifica se já foi usado completamente
  if (cupom.usado && cupom.tipo !== 'credito') {
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
  if (cupom.tipo === 'percent') {
    valorDisponivel = valorSubtotal * (cupom.desconto / 100);
  } else if (cupom.tipo === 'credito') {
    valorDisponivel = cupom.valor - (cupom.valorUsado || 0);
    
    if (cupom.valorUsado > 0) {
      return {
        valido: true,
        cupom: cupom,
        valorDesconto: Math.min(valorDisponivel, valorSubtotal),
        valorFinal: valorSubtotal - Math.min(valorDisponivel, valorSubtotal),
        zerarFrete: cupom.zerarFrete || false, // Inclui a propriedade zerarFrete
        mensagem: `Cupom de crédito aplicado parcialmente (R$ ${valorDisponivel.toFixed(2)} disponíveis)`
      };
    }
  } else {
    valorDisponivel = cupom.desconto;
  }

  const freteText = document.getElementById('frete').textContent;
  const frete = parseFloat(freteText.replace('R$', '').replace(',', '.'));
  const totalCompra = valorSubtotal + frete;
  
  valorDisponivel = Math.min(valorDisponivel, totalCompra);

  return {
    valido: true,
    cupom: cupom,
    valorDesconto: valorDisponivel,
    valorFinal: Math.max(0, totalCompra - valorDisponivel), // Garante que não fique negativo
    zerarFrete: cupom.zerarFrete || false,
    mensagem: cupom.tipo === 'credito' ? 
      `Cupom de crédito aplicado (R$ ${valorDisponivel.toFixed(2)} utilizado de R$ ${cupom.valor.toFixed(2)})` : 
      `Cupom de desconto aplicado`
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
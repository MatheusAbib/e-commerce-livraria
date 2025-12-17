   let contadorEntrega = 1;
    let contadorCartao = 1;

    function adicionarEnderecoEntrega(endereco = {}) {
      const container = document.getElementById('enderecos-entrega-container');
      const div = document.createElement('div');
      div.className = 'endereco-entrega';
      div.style.border = '1px solid #ccc';
      div.style.marginBottom = '15px';
      div.style.padding = '10px';

      const estadoSelecionado = endereco.estado || '';

      const opcoesEstado = [
        "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT",
        "MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS",
        "RO","RR","SC","SP","SE","TO"
      ];

      const selectEstadoHTML = `
        <select name="entrega-estado" required>
          <option value="">Selecione</option>
          ${opcoesEstado.map(uf => `
            <option value="${uf}" ${uf === estadoSelecionado ? 'selected' : ''}>${uf}</option>
          `).join('')}
        </select>
      `;

      div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="margin: 0;">
            Endereço de Entrega Adicional
          </h4>
          <button type="button" onclick="removerEnderecoEntrega(this)" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px;">Remover</button>
        </div>

        <!-- Linha 1 -->
        <div class="form-row">
          <div><label>Bairro</label><input type="text" name="entrega-bairro" value="${endereco.bairro ?? ''}" required /></div>
          <div><label>Cidade</label><input type="text" name="entrega-cidade" value="${endereco.cidade ?? ''}" required /></div>
          <div><label>País</label><input type="text" name="entrega-pais" value="${endereco.pais ?? 'Brasil'}" disabled /></div>
          <div>
            <label>Estado</label>
            ${selectEstadoHTML}
          </div>
        </div>

        <!-- Linha 2 -->
        <div class="form-row">
          <div><label>Número</label><input type="text" name="entrega-numero" value="${endereco.numero ?? ''}" required /></div>
          <div><label>Complemento</label><input type="text" name="entrega-complemento" value="${endereco.complemento ?? ''}" /></div>
          <div><label>CEP</label><input type="text" name="entrega-cep" value="${endereco.cep ?? ''}" required /></div>
          <div><label>Rua</label><input type="text" name="entrega-rua" value="${endereco.rua ?? ''}" required /></div>
        </div>

        <!-- Linha 3 -->
        <div class="form-row">
          <div><label>Tipo de Residência</label><input type="text" name="entrega-tipo-residencia" value="${endereco.tipoResidencia ?? ''}" required /></div>
          <div><label>Tipo de Logradouro</label><input type="text" name="entrega-tipo-logradouro" value="${endereco.tipoLogradouro ?? ''}" required /></div>
          <div><label>Logradouro</label><input type="text" name="entrega-logradouro" value="${endereco.logradouro ?? ''}" required /></div>
        </div>
      `;

      container.appendChild(div);
    }

    function removerEnderecoEntrega(botao) {
      botao.closest('.endereco-entrega').remove();
    }

    function adicionarCartao(cartao = {}) {
      const container = document.getElementById('cartao-container');
      const div = document.createElement('div');
      div.className = 'cartao';
      
      div.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="margin: 0;">Cartão de Crédito Adicional</h4>
          <button type="button" onclick="removerCartao(this)" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px;">Remover</button>
        </div>
        <div class="form-row">
          <div>
            <label>Nº do Cartão</label>
            <input type="text" name="cartao-numero" value="${cartao.numero || ''}" required />
          </div>
          <div>
            <label>Nome no Cartão</label>
            <input type="text" name="cartao-nome" value="${cartao.nomeTitular || ''}" required />
          </div>
          <div>
            <label>Bandeira</label>
            <select name="cartao-bandeira" required>
              <option value="">Selecione</option>
              <option value="Visa" ${cartao.bandeira === 'Visa' ? 'selected' : ''}>Visa</option>
              <option value="Mastercard" ${cartao.bandeira === 'Mastercard' ? 'selected' : ''}>Mastercard</option>
              <option value="Elo" ${cartao.bandeira === 'Elo' ? 'selected' : ''}>Elo</option>
              <option value="American Express" ${cartao.bandeira === 'American Express' ? 'selected' : ''}>American Express</option>
            </select>
          </div>
          <div>
            <label>CVV</label>
            <input type="text" name="cartao-cvv" value="${cartao.cvv || ''}" required maxlength="4" />
          </div>
          <div>
            <label>Validade</label>
            <input type="month" name="cartao-validade" value="${cartao.dataValidade || ''}" required />
          </div>
          <div>
            <label>
              <input type="checkbox" name="cartao-preferencial" ${cartao.preferencial ? 'checked' : ''} />
              Preferencial
            </label>
          </div>
        </div>
      `;

      div.querySelector('[name="cartao-preferencial"]').addEventListener('change', function() {
        if (this.checked) {
          document.querySelectorAll('[name="cartao-preferencial"]').forEach(cb => {
            if (cb !== this) cb.checked = false;
          });
        }
      });

      container.appendChild(div);
    }

    function removerCartao(botao) {
      botao.closest('.cartao').remove();
    }

    function coletarCartoes() {
      const cartoes = [];
      const cartoesElements = document.querySelectorAll('.cartao');

      cartoesElements.forEach((cartaoDiv, index) => {
        const isPreferencial = cartaoDiv.querySelector('[name="cartao-preferencial"]').checked;
        
        if (isPreferencial) {
          cartoes.forEach(c => c.preferencial = false);
        }

        if (index === 0) {
          cartoes.push({
            numero: document.getElementById('cartao-numero').value.replace(/\s/g, ''),
            nomeTitular: document.getElementById('cartao-nome').value,
            bandeira: document.getElementById('cartao-bandeira').value,
            cvv: document.getElementById('cartao-cvv').value,
            dataValidade: document.getElementById('cartao-validade').value,
            preferencial: isPreferencial
          });
        } else {
          cartoes.push({
            numero: cartaoDiv.querySelector('[name="cartao-numero"]').value.replace(/\s/g, ''),
            nomeTitular: cartaoDiv.querySelector('[name="cartao-nome"]').value,
            bandeira: cartaoDiv.querySelector('[name="cartao-bandeira"]').value,
            cvv: cartaoDiv.querySelector('[name="cartao-cvv"]').value,
            dataValidade: cartaoDiv.querySelector('[name="cartao-validade"]').value,
            preferencial: isPreferencial
          });
        }
      });

      if (cartoes.length > 0 && !cartoes.some(c => c.preferencial)) {
        cartoes[0].preferencial = true;
      }

      return cartoes;
    }

    function coletarEnderecosEntrega() {
      const enderecosEntrega = [];
      const enderecosElements = document.querySelectorAll('.endereco-entrega');

      enderecosElements.forEach((enderecoDiv, index) => {
        const nomeEndereco = enderecoDiv.querySelector('.nome-endereco')?.value || `Endereço #${index + 1}`;
        
        if (index === 0) {
          enderecosEntrega.push({
            nomeEndereco: nomeEndereco,
            cep: document.getElementById('entrega-cep').value,
            rua: document.getElementById('entrega-rua').value,
            numero: document.getElementById('entrega-numero').value,
            complemento: document.getElementById('entrega-complemento').value,
            bairro: document.getElementById('entrega-bairro').value,
            cidade: document.getElementById('entrega-cidade').value,
            estado: document.getElementById('entrega-estado').value,
            pais: document.getElementById('entrega-pais').value,
            tipoResidencia: document.getElementById('entrega-tipo-residencia').value,
            tipoLogradouro: document.getElementById('entrega-tipo-logradouro').value,
            logradouro: document.getElementById('entrega-logradouro').value,
            tipo: 'ENTREGA'
          });
        } else {
          enderecosEntrega.push({
            nomeEndereco: nomeEndereco,
            cep: enderecoDiv.querySelector('[name="entrega-cep"]').value,
            rua: enderecoDiv.querySelector('[name="entrega-rua"]').value,
            numero: enderecoDiv.querySelector('[name="entrega-numero"]').value,
            complemento: enderecoDiv.querySelector('[name="entrega-complemento"]').value,
            bairro: enderecoDiv.querySelector('[name="entrega-bairro"]').value,
            cidade: enderecoDiv.querySelector('[name="entrega-cidade"]').value,
            estado: enderecoDiv.querySelector('[name="entrega-estado"]').value,
            pais: enderecoDiv.querySelector('[name="entrega-pais"]').value,
            tipoResidencia: enderecoDiv.querySelector('[name="entrega-tipo-residencia"]').value,
            tipoLogradouro: enderecoDiv.querySelector('[name="entrega-tipo-logradouro"]').value,
            logradouro: enderecoDiv.querySelector('[name="entrega-logradouro"]').value,
            tipo: 'ENTREGA'
          });
        }
      });

      return enderecosEntrega;
    }

    function limparFormularioCompleto() {
      document.getElementById('form-cliente').reset();
      
      const containerEntrega = document.getElementById('enderecos-entrega-container');
      while (containerEntrega.children.length > 1) {
        containerEntrega.removeChild(containerEntrega.lastChild);
      }
      
      const camposEntrega = [
        'entrega-cep', 'entrega-rua', 'entrega-numero', 'entrega-complemento',
        'entrega-bairro', 'entrega-cidade', 'entrega-estado', 'entrega-pais',
        'entrega-tipo-residencia', 'entrega-tipo-logradouro', 'entrega-logradouro'
      ];
      camposEntrega.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.value = '';
      });
      
      const selectEstadoEntrega = document.getElementById('entrega-estado');
      if (selectEstadoEntrega) selectEstadoEntrega.selectedIndex = 0;
      
      const containerCartao = document.getElementById('cartao-container');
      while (containerCartao.children.length > 1) {
        containerCartao.removeChild(containerCartao.lastChild);
      }
      
      const camposCartao = [
        'cartao-numero', 'cartao-nome', 'cartao-cvv', 'cartao-validade'
      ];
      camposCartao.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) campo.value = '';
      });
      
      const selectBandeira = document.getElementById('cartao-bandeira');
      if (selectBandeira) selectBandeira.selectedIndex = 0;
      
      const preferencialCheckbox = document.querySelector('[name="cartao-preferencial"]');
      if (preferencialCheckbox) preferencialCheckbox.checked = false;
    }

    function mostrarCamposSenha() {
      const senhaInput = document.getElementById('senha');
      const confirmarSenhaInput = document.getElementById('confirmar-senha-cadastro');
      const labelSenha = document.querySelector('label[for="senha"]');
      const labelConfirmarSenha = document.querySelector('label[for="confirmar-senha-cadastro"]');

      senhaInput.style.display = '';
      confirmarSenhaInput.style.display = '';
      labelSenha.style.display = '';
      labelConfirmarSenha.style.display = '';

      senhaInput.disabled = false;
      confirmarSenhaInput.disabled = false;
    }

    function esconderCamposSenha() {
      const senhaInput = document.getElementById('senha');
      const confirmarSenhaInput = document.getElementById('confirmar-senha-cadastro');
      const labelSenha = document.querySelector('label[for="senha"]');
      const labelConfirmarSenha = document.querySelector('label[for="confirmar-senha-cadastro"]');

      senhaInput.style.display = 'none';
      confirmarSenhaInput.style.display = 'none';
      labelSenha.style.display = 'none';
      labelConfirmarSenha.style.display = 'none';

      senhaInput.disabled = true;
      confirmarSenhaInput.disabled = true;
    }

   document.getElementById('form-cliente').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('cliente-id').value;
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmar-senha-cadastro').value;

  if (!id) {
    if (senha !== confirmarSenha) {
      mostrarErro('As senhas não coincidem. Por favor, digite a mesma senha nos dois campos.');
      document.getElementById('confirmar-senha-cadastro').focus();
      return;
    }

    // requisitos da senha
    const hasMinLength = senha.length >= 6;
    const hasNumber = /\d/.test(senha);
    const hasUpper = /[A-Z]/.test(senha);
    const hasLower = /[a-z]/.test(senha);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
    
    if (!hasMinLength || !hasNumber || !hasUpper || !hasLower || !hasSpecial) {
      mostrarErro('A senha não atende a todos os requisitos de segurança. Por favor, verifique as regras abaixo do campo de senha.');
      document.getElementById('senha').focus();
      return;
    }
  }

  // Validação de campos obrigatórios
  const camposObrigatorios = [
    'nome', 'email', 'cartao-numero', 'cartao-nome', 'cartao-bandeira', 'cartao-cvv', 'cartao-validade',
    'cobranca-cep', 'cobranca-rua', 'cobranca-numero', 'cobranca-bairro', 'cobranca-cidade', 'cobranca-estado',
    'entrega-cep', 'entrega-rua', 'entrega-numero', 'entrega-bairro', 'entrega-cidade', 'entrega-estado',
    'cobranca-tipo-residencia', 'cobranca-tipo-logradouro', 'cobranca-logradouro',
    'entrega-tipo-residencia', 'entrega-tipo-logradouro', 'entrega-logradouro'
  ];

  if (!id) {
    camposObrigatorios.push('senha', 'confirmar-senha-cadastro');
  }

  for (const campoId of camposObrigatorios) {
    const campo = document.getElementById(campoId);
    if (campo && !campo.value.trim()) {
      const label = campo.previousElementSibling?.textContent?.replace(' *', '') || 'Campo';
      mostrarErro(`${label} é obrigatório. Por favor, preencha este campo.`);
      campo.focus();
      return;
    }
  }

  // Construção do objeto cliente
  const cliente = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    telefone: document.getElementById('telefone').value,
    tipotelefone: document.getElementById('tipotelefone').value,
    cpf: document.getElementById('cpf').value,
    nascimento: document.getElementById('nascimento')?.value || null,
    genero: document.getElementById('genero')?.value || null,
    ativo: true
  };

  if (!id && senha) {
    cliente.senha = senha;
  }

  // Endereço de cobrança
  const enderecoCobranca = {
    cep: document.getElementById('cobranca-cep').value,
    rua: document.getElementById('cobranca-rua').value,
    numero: document.getElementById('cobranca-numero').value,
    complemento: document.getElementById('cobranca-complemento').value || null,
    bairro: document.getElementById('cobranca-bairro').value,
    cidade: document.getElementById('cobranca-cidade').value,
    estado: document.getElementById('cobranca-estado').value,
    pais: document.getElementById('cobranca-pais').value,
    tipoResidencia: document.getElementById('cobranca-tipo-residencia').value,
    tipoLogradouro: document.getElementById('cobranca-tipo-logradouro').value,
    logradouro: document.getElementById('cobranca-logradouro').value,
    tipo: 'COBRANCA'
  };

  // Endereços de entrega e cartões
  const enderecosEntrega = coletarEnderecosEntrega();
  const cartoes = coletarCartoes();

  // Validação do cartão preferencial
  const cartoesPreferenciais = cartoes.filter(c => c.preferencial).length;
  if (cartoesPreferenciais !== 1) {
    mostrarErro('Deve haver exatamente um cartão marcado como preferencial. Por favor, selecione um cartão principal.');
    return;
  }

  cliente.enderecos = [enderecoCobranca, ...enderecosEntrega];
  cliente.cartoes = cartoes;

  // Configuração da requisição
  const url = id ? `/api/clientes/${id}` : '/api/clientes';
  const method = id ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(cliente)
    });

    if (response.ok) {
      mostrarNotificacaoSucesso();
      limparFormularioCompleto();
      document.getElementById('cliente-id').value = '';
      mostrarCamposSenha();
    } else {
      const error = await response.json();
      mostrarErro(error.message || 'Ocorreu um erro ao salvar o cliente. Por favor, tente novamente.');
    }
  } catch (error) {
    console.error('Erro:', error);
    mostrarErro('Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.');
  }
});

    document.addEventListener('DOMContentLoaded', function () {
      const telefoneInput = document.getElementById('telefone');
      const tipotelefoneSelect = document.getElementById('tipotelefone');

      if (!telefoneInput || !tipotelefoneSelect) {
        console.error('Elemento telefone ou tipo não encontrado.');
        return;
      }

      tipotelefoneSelect.addEventListener('change', function () {
        telefoneInput.value = '';
        telefoneInput.placeholder = this.value === 'celular'
          ? '(00) 00000-0000'
          : '(00) 0000-0000';
      });

      telefoneInput.addEventListener('input', function (e) {
        const tipo = tipotelefoneSelect.value;
        let valor = e.target.value.replace(/\D/g, '');

        if (tipo === 'celular') {
          valor = valor.slice(0, 11);
          valor = valor.replace(/^(\d{0,2})(\d{0,5})(\d{0,4})/, (_, ddd, p1, p2) => {
            let res = '';
            if (ddd) res += `(${ddd}`;
            if (ddd.length === 2) res += ') ';
            if (p1) res += p1;
            if (p2) res += '-' + p2;
            return res;
          });
        } else {
          valor = valor.slice(0, 10);
          valor = valor.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})/, (_, ddd, p1, p2) => {
            let res = '';
            if (ddd) res += `(${ddd}`;
            if (ddd.length === 2) res += ') ';
            if (p1) res += p1;
            if (p2) res += '-' + p2;
            return res;
          });
        }

        telefoneInput.value = valor;
      });
    });

    document.getElementById('cpf').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      
      e.target.value = value.substring(0, 14);
    });

    document.getElementById('cobranca-cep').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
      
      e.target.value = value.substring(0, 9);
    });

    document.getElementById('entrega-cep').addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
      
      e.target.value = value.substring(0, 9);
    });

    document.addEventListener('input', function(e) {
      if (e.target.matches('[name="cartao-numero"], #cartao-numero')) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value.substring(0, 19);
      }
      
      if (e.target.matches('[name="cartao-cvv"], #cartao-cvv')) {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
      }
    });

    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('show');
    }

    function handleAuthClick() {
      console.log('Botão de autenticação clicado');
    }

    function handleLogout() {
      // Implementar lógica de logout
      console.log('Botão de logout clicado');
    }

        window.addEventListener('scroll', function() {
      const header = document.getElementById('main-header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

    document.getElementById('senha').addEventListener('input', function(e) {
  const senha = e.target.value;
  const errorElement = document.querySelector('#senha + .error-message');
  
  // Verifica os requisitos da senha
  const hasMinLength = senha.length >= 6;
  const hasNumber = /\d/.test(senha);
  const hasUpper = /[A-Z]/.test(senha);
  const hasLower = /[a-z]/.test(senha);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
  
  let errorMessage = [];
  
  if (!hasMinLength) errorMessage.push('Mínimo 6 caracteres');
  if (!hasNumber) errorMessage.push('Pelo menos 1 número');
  if (!hasUpper) errorMessage.push('Pelo menos 1 letra maiúscula');
  if (!hasLower) errorMessage.push('Pelo menos 1 letra minúscula');
  if (!hasSpecial) errorMessage.push('Pelo menos 1 caractere especial');
  
  if (errorMessage.length > 0) {
    errorElement.innerHTML = '<strong>Requisitos da senha:</strong><br>' + 
      errorMessage.map(item => `• ${item}`).join('<br>');
    errorElement.style.display = 'block';
    e.target.classList.add('error');
  } else {
    errorElement.style.display = 'none';
    e.target.classList.remove('error');
  }
});

function mostrarNotificacaoSucesso() {
  const modal = document.getElementById('modal-sucesso');
  modal.style.display = 'flex';
  
  setTimeout(() => {
    modal.style.display = 'none';
  }, 3000);
}


function fecharModalSucesso() {
  document.getElementById('modal-sucesso').style.display = 'none';
}

function mostrarErro(mensagem) {
  const modal = document.getElementById('modal-erro');
  const mensagemElement = document.getElementById('erro-mensagem');
  
  mensagemElement.textContent = mensagem;
  modal.style.display = 'flex';
  
  setTimeout(() => {
    fecharModalErro();
  }, 5000);
}

function fecharModalErro() {
  document.getElementById('modal-erro').style.display = 'none';
}


 function esconderLinksRestritos() {
  const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

  const linksRestritos = [
    'usuarios.html',
    'log.html',
    'lucros.html',
    'livros.html',
    'pedidosADMIN.html'
  ];

  if (!clienteLogado || clienteLogado.perfil !== 'ADMIN') {
    linksRestritos.forEach(href => {
      const link = document.querySelector(`.sidebar a[href="${href}"]`);
      if (link) link.style.display = 'none';
    });
  }

  const linkStatusCliente = document.querySelector(`.sidebar a[href="pedidos.html"]`);
  if (!clienteLogado || clienteLogado.perfil === 'ADMIN') {
    if (linkStatusCliente) linkStatusCliente.style.display = 'none';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  esconderLinksRestritos();
});


  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
  } 
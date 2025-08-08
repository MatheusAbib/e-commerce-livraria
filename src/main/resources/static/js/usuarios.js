 // Variável global para armazenar todos os clientes
let todosClientes = [];

// Variáveis para controle do status
let clienteStatusId = null;
let novoStatus = null;

function abrirModalStatus(clienteId, acao) {
  const cliente = todosClientes.find(c => c.id == clienteId);
  if (!cliente) return;

  clienteStatusId = clienteId;
  novoStatus = acao === 'ativar';
  
  const acaoTexto = novoStatus ? 'ativar' : 'inativar';
  const msg = `Tem certeza que deseja ${acaoTexto} o cliente "${cliente.nome}"?`;
  
  document.getElementById('modal-status-msg').textContent = msg;
  document.getElementById('motivo-status').value = '';
  document.getElementById('modal-status').style.display = 'flex';
}

function fecharModalStatus() {
  document.getElementById('modal-status').style.display = 'none';
}

// Configura o evento de confirmação quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btn-confirmar-status').addEventListener('click', confirmarAlterarStatus);
});

async function confirmarAlterarStatus() {
  const motivo = document.getElementById('motivo-status').value.trim();
  
  if (!motivo) {
    exibirNotificacao('Por favor, informe o motivo da alteração de status.', 'warning');
    return;
  }

  try {
    const response = await fetch(`/api/clientes/change-status/${clienteStatusId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({ 
        ativo: novoStatus,
        motivo: motivo
      })
    });

    if (response.ok) {
      exibirNotificacao(`Status do cliente alterado com sucesso!`, 'success');
      fecharModalStatus();
      carregarClientes();
    } else {
      const erro = await response.text();
      exibirNotificacao('Erro: ' + erro, 'error');
    }
  } catch (error) {
    console.error('Erro:', error);
    exibirNotificacao('Erro ao conectar com o servidor: ' + error.message, 'error');
  }
}

async function carregarClientes(filtros = {}) {
    try {
        const params = new URLSearchParams();
        
        // Adiciona os parâmetros de filtro
        if (filtros.nome) params.append('nome', filtros.nome);
        if (filtros.email) params.append('email', filtros.email);
        if (filtros.cpf) params.append('cpf', filtros.cpf);
        if (filtros.genero) params.append('genero', filtros.genero);
        if (filtros.ativo !== null && filtros.ativo !== undefined) {
            params.append('ativo', filtros.ativo);
        }
        const url = '/api/clientes/consulta?' + params.toString();
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const resultado = await response.json();
        
        // Verifica se a resposta tem a estrutura esperada
        const clientes = Array.isArray(resultado) ? resultado : 
                        (resultado.clientes || resultado.data || []);
        
        todosClientes = clientes;
        
        // Atualiza a contagem
        const countFiltered = clientes.length;
        const countTotal = resultado.countTotal || clientes.length;
        
        const infoDiv = document.getElementById('info-contagem');
        if (infoDiv) {
            infoDiv.innerHTML = `<i class="fas fa-info-circle"></i> Mostrando ${countFiltered} clientes de um total de ${countTotal}`;
        }
        
        // Preenche a tabela
        preencherTabelaClientes(clientes);
        
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        exibirNotificacao(`Erro ao carregar clientes: ${error.message}`, 'error');
        
        // Mostra mensagem na tabela
        const tbody = document.getElementById('clientes-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="7"><i class="fas fa-exclamation-triangle"></i> Erro ao carregar clientes. Tente novamente.</td></tr>';
        }
    }
}

function preencherTabelaClientes(clientes) {
    const tbody = document.getElementById('clientes-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (!clientes || clientes.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 20px;">
              <i class="fas fa-user-slash"></i> Nenhum cliente encontrado
            </td>
          </tr>
        `;
        return;
    }

    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        const statusClass = cliente.ativo ? 'status-ativo' : 'status-inativo';
        const statusIcon = cliente.ativo ? 'fa-check-circle' : 'fa-times-circle';
        const statusText = cliente.ativo ? 'Ativo' : 'Inativo';

const btnAcao = cliente.ativo
    ? `<button class="btn-icon btn-status" onclick="abrirModalStatus(${cliente.id}, 'inativar')" title="Inativar">
          <i class="fas fa-toggle-on"></i>
       </button>`
    : `<button class="btn-icon btn-status" onclick="abrirModalStatus(${cliente.id}, 'ativar')" title="Ativar">
          <i class="fas fa-toggle-off"></i>
       </button>`;

        tr.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.nome || '-'}</td>
            <td>${cliente.email || '-'}</td>
            <td>${cliente.telefone || '-'}</td>
            <td>${cliente.cpf || '-'}</td>
            <td class="${statusClass}"><i class="fas ${statusIcon}"></i> ${statusText}</td>
            <td class="acoes-cell">
                <button class="btn-icon btn-password" onclick="abrirModalSenha(${cliente.id})" title="Alterar Senha">
                    <i class="fas fa-key"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="confirmarExclusaoCliente(${cliente.id})" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn-icon btn-login" onclick="abrirModalLogin(${cliente.id}, '${cliente.email || ''}')" title="Entrar como Cliente">
                    <i class="fas fa-sign-in-alt"></i>
                </button>
                ${btnAcao}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function aplicarFiltros() {
    // Obter todos os valores dos filtros
    const filtros = {
        nome: document.getElementById('filtro-nome').value.trim(),
        email: document.getElementById('filtro-email').value.trim(),
        cpf: document.getElementById('filtro-cpf').value.trim(),
        genero: document.getElementById('filtro-genero').value,
        ativo: document.getElementById('filtro-status').value
    };

    const filtrosLimpos = Object.fromEntries(
        Object.entries(filtros).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    );

    if (filtrosLimpos.ativo) {
        filtrosLimpos.ativo = filtrosLimpos.ativo === 'ativo';
    }

    // Mostra uma mensagem de carregamento
    const tbody = document.getElementById('clientes-tbody');
    if (tbody) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align:center; font-style: italic; padding: 15px;">
              <i class="fas fa-spinner fa-spin"></i> Carregando resultados...
            </td>
          </tr>
        `;
    }

    setTimeout(() => {
        carregarClientes(filtrosLimpos);
    }, 1000);
}

function limparFiltros() {
    // Limpa todos os campos de filtro
    document.querySelectorAll('.filtros-container input').forEach(input => {
        input.value = '';
    });
    
    document.getElementById('filtro-genero').value = '';
    document.getElementById('filtro-status').value = '';
    
    // Recarrega os clientes sem filtros
    carregarClientes();
}

// Adiciona event listeners para aplicar filtros ao pressionar Enter
document.querySelectorAll('.filtros-container input').forEach(input => {
    input.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            aplicarFiltros();
        }
    });
});

// Carrega os clientes quando a página é aberta
window.addEventListener('DOMContentLoaded', () => {
    carregarClientes();
});

document.getElementById('form-filtro-clientes').addEventListener('submit', function (e) {
  e.preventDefault();
  aplicarFiltros();
});

let clienteAlterarSenhaId = null;

function abrirModalSenha(id) {
  clienteAlterarSenhaId = id;
  document.getElementById('nova-senha').value = '';
  document.getElementById('confirmar-senha').value = '';
  document.getElementById('modal-senha').style.display = 'flex';
}

function fecharModalSenha() {
  document.getElementById('modal-senha').style.display = 'none';
}

async function confirmarAlterarSenha() {
  const novaSenha = document.getElementById('nova-senha').value;
  const confirmarSenha = document.getElementById('confirmar-senha').value;

  if (novaSenha === '' || confirmarSenha === '') {
    exibirNotificacao('Preencha os dois campos.', 'warning');
    return;
  }
  if (novaSenha !== confirmarSenha) {
    exibirNotificacao('Senhas não conferem.', 'error');
    return;
  }

  try {
    const response = await fetch(`/api/clientes/${clienteAlterarSenhaId}/change-password`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ senha: novaSenha, confirmacaoSenha: confirmarSenha })
    });

    if (response.ok) {
      exibirNotificacao('Senha alterada com sucesso!', 'success');
      fecharModalSenha();
    } else {
      const msg = await response.text();
      exibirNotificacao('Erro: ' + msg, 'error');
    }
  } catch (error) {
    console.error('Erro:', error);
    exibirNotificacao('Erro ao conectar com o servidor', 'error');
  }
}

function confirmarExclusaoCliente(id) {
  const cliente = todosClientes.find(c => c.id == id);
  if (!cliente) return;

  const modalMsg = `Tem certeza que deseja excluir permanentemente o cliente "${cliente.nome}"? Esta ação não pode ser desfeita.`;
  
  document.getElementById('modal-msg').textContent = modalMsg;
  document.getElementById('btn-confirmar-excluir').onclick = function() {
    excluirCliente(id);
  };
  
  document.getElementById('modal-excluir').style.display = 'flex';
}

async function excluirCliente(id) {
  try {
    const response = await fetch(`/api/clientes/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      exibirNotificacao('Cliente excluído com sucesso.', 'success');
      document.getElementById('modal-excluir').style.display = 'none';
      carregarClientes();
    } else {
      const erro = await response.text();
      exibirNotificacao('Erro ao excluir cliente: ' + erro, 'error');
    }
  } catch (error) {
    console.error(error);
    exibirNotificacao('Erro na comunicação com o servidor.', 'error');
  }
}

function preencherDadosEndereco(endereco, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <div><strong><i class="fas fa-map-pin"></i> CEP:</strong> ${endereco.cep || '-'}</div>
      <div><strong><i class="fas fa-road"></i> Rua:</strong> ${endereco.rua || '-'}</div>
      <div><strong><i class="fas fa-hashtag"></i> Número:</strong> ${endereco.numero || '-'}</div>
      <div><strong><i class="fas fa-building"></i> Complemento:</strong> ${endereco.complemento || '-'}</div>
      <div><strong><i class="fas fa-map-marked-alt"></i> Bairro:</strong> ${endereco.bairro || '-'}</div>
      <div><strong><i class="fas fa-city"></i> Cidade:</strong> ${endereco.cidade || '-'}</div>
      <div><strong><i class="fas fa-flag"></i> Estado:</strong> ${endereco.estado || '-'}</div>
      <div><strong><i class="fas fa-globe-americas"></i> País:</strong> ${endereco.pais || 'Brasil'}</div>
      <div><strong><i class="fas fa-home"></i> Tipo Residência:</strong> ${endereco.tipoResidencia || '-'}</div>
      <div><strong><i class="fas fa-route"></i> Tipo Logradouro:</strong> ${endereco.tipoLogradouro || '-'}</div>
      <div><strong><i class="fas fa-map-signs"></i> Logradouro:</strong> ${endereco.logradouro || '-'}</div>
    </div>
  `;
}

let activeAddressForm = null;

async function editarEndereco(enderecoId, tipo, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  if (activeAddressForm) {
    activeAddressForm.remove();
    activeAddressForm = null;
  }

  let endereco;
  
  if (enderecoId && enderecoId !== 'null') {
    const response = await fetch(`/api/enderecos/${enderecoId}`);
    if (!response.ok) {
      exibirNotificacao('Erro ao carregar endereço', 'error');
      return;
    }
    endereco = await response.json();
  } else {
    endereco = {
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: 'Brasil',
      tipoResidencia: '',
      tipoLogradouro: '',
      logradouro: '',
      tipo: tipo
    };
  }

  const containerId = tipo === 'COBRANCA' 
    ? `endereco-cobranca-${enderecoId || '0'}` 
    : `endereco-${enderecoId}`;
  
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <form id="form-editar-endereco-${enderecoId || 'novo'}" 
        onsubmit="salvarEndereco(event, ${enderecoId || 'null'}, '${tipo}'); return false;">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div>
          <label><i class="fas fa-map-pin"></i> CEP</label>
          <input type="text" name="cep" value="${endereco.cep || ''}" required>
        </div>
        <div>
          <label><i class="fas fa-road"></i> Rua</label>
          <input type="text" name="rua" value="${endereco.rua || ''}" required>
        </div>
        <div>
          <label><i class="fas fa-hashtag"></i> Número</label>
          <input type="text" name="numero" value="${endereco.numero || ''}" required>
        </div>
        <div>
          <label><i class="fas fa-building"></i> Complemento</label>
          <input type="text" name="complemento" value="${endereco.complemento || ''}">
        </div>
        <div>
          <label><i class="fas fa-map-marked-alt"></i> Bairro</label>
          <input type="text" name="bairro" value="${endereco.bairro || ''}" required>
        </div>
        <div>
          <label><i class="fas fa-city"></i> Cidade</label>
          <input type="text" name="cidade" value="${endereco.cidade || ''}" required>
        </div>
        <div>
          <label><i class="fas fa-flag"></i> Estado</label>
          <select name="estado" required>
            <option value="">Selecione</option>
            ${['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT',
               'MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS',
               'RO','RR','SC','SP','SE','TO'].map(uf => `
              <option value="${uf}" ${uf === endereco.estado ? 'selected' : ''}>${uf}</option>
            `).join('')}
          </select>
        </div>
        <div>
          <label><i class="fas fa-globe-americas"></i> País</label>
          <input type="text" name="pais" value="${endereco.pais || 'Brasil'}" readonly>
        </div>
        <div>
          <label><i class="fas fa-home"></i> Tipo Residência</label>
          <input type="text" name="tipoResidencia" value="${endereco.tipoResidencia || ''}" required>
        </div>
        <div>
          <label><i class="fas fa-route"></i> Tipo Logradouro</label>
          <input type="text" name="tipoLogradouro" value="${endereco.tipoLogradouro || ''}" required>
        </div>
        <div>
          <label><i class="fas fa-map-signs"></i> Logradouro</label>
          <input type="text" name="logradouro" value="${endereco.logradouro || ''}" required>
        </div>
      </div>
      <div style="margin-top: 15px; display: flex; gap: 10px;">
        <button type="submit" class="btn btn-primary">
          <i class="fas fa-save"></i> Salvar
        </button>
        <button type="button" onclick="cancelarEdicaoEndereco('${containerId}', ${enderecoId || 'null'}, '${tipo}')" class="btn btn-outline">
          <i class="fas fa-times"></i> Cancelar
        </button>
      </div>
    </form>
  `;
  
  activeAddressForm = document.getElementById(`form-editar-endereco-${enderecoId || 'novo'}`);
}

async function salvarEndereco(event, enderecoId, tipo) {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  
  const form = event.target;
  const formData = new FormData(form);
  
  const enderecoAtualizado = {
    cep: formData.get('cep'),
    rua: formData.get('rua'),
    numero: formData.get('numero'),
    complemento: formData.get('complemento'),
    bairro: formData.get('bairro'),
    cidade: formData.get('cidade'),
    estado: formData.get('estado'),
    pais: formData.get('pais'),
    tipoResidencia: formData.get('tipoResidencia'),
    tipoLogradouro: formData.get('tipoLogradouro'),
    logradouro: formData.get('logradouro'),
    tipo: tipo
  };

  try {
    let response;
    const clienteId = document.querySelector('.cliente-info').dataset.clienteId;
    
    if (enderecoId && enderecoId !== 'null') {
      response = await fetch(`/api/enderecos/${enderecoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enderecoAtualizado)
      });
    } else {
      enderecoAtualizado.clienteId = clienteId;
      response = await fetch('/api/enderecos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enderecoAtualizado)
      });
    }

    if (response.ok) {
      const enderecoSalvo = await response.json();
      exibirNotificacao('Endereço salvo com sucesso!', 'success');
      
      const containerId = tipo === 'COBRANCA' 
        ? `endereco-cobranca-${enderecoSalvo.id || '0'}` 
        : `endereco-${enderecoSalvo.id}`;
      
      preencherDadosEndereco(enderecoSalvo, containerId);
      activeAddressForm = null;
    } else {
      const error = await response.text();
      exibirNotificacao(`Erro ao salvar endereço: ${error}`, 'error');
    }
  } catch (error) {
    console.error('Erro:', error);
    exibirNotificacao('Erro ao conectar com o servidor', 'error');
  }
}

function cancelarEdicaoEndereco(containerId, enderecoId, tipo) {
  if (enderecoId && enderecoId !== 'null') {
    fetch(`/api/enderecos/${enderecoId}`)
      .then(res => res.json())
      .then(endereco => {
        preencherDadosEndereco(endereco, containerId);
        activeAddressForm = null;
      })
      .catch(err => {
        console.error('Erro ao carregar endereço:', err);
        document.getElementById(containerId).innerHTML = '';
        activeAddressForm = null;
      });
  } else {
    document.getElementById(containerId).innerHTML = '';
    activeAddressForm = null;
  }
}

async function editarNomeEndereco(idEndereco) {
  const spanNome = document.getElementById(`nome-endereco-${idEndereco}`);
  const nomeAtual = spanNome.textContent;

  const novoNome = prompt("Digite o novo nome para este endereço:", nomeAtual);

  if (novoNome !== null && novoNome.trim() !== '' && novoNome !== nomeAtual) {
    try {
      const response = await fetch(`/api/enderecos/${idEndereco}/nome`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomeEndereco: novoNome.trim() })
      });

      if (response.ok) {
        spanNome.textContent = novoNome.trim();
        exibirNotificacao("Nome do endereço atualizado com sucesso!", 'success');
      } else {
        const error = await response.text();
        exibirNotificacao(`Erro ao atualizar nome: ${error}`, 'error');
      }
    } catch (error) {
      console.error('Erro:', error);
      exibirNotificacao('Erro ao conectar com o servidor', 'error');
    }
  }
}

function editarCliente(id) {
  window.location.href = `formulario_cadastro.html?id=${id}`;
}

let clienteLoginId = null;

function abrirModalLogin(id, email) {
  clienteLoginId = id;
  document.getElementById('login-cliente-id').value = id;
  document.getElementById('login-email').value = email;
  document.getElementById('login-senha').value = '';
  document.getElementById('modal-login').style.display = 'flex';
}

function fecharModalLogin() {
  document.getElementById('modal-login').style.display = 'none';
}

document.getElementById('form-login').addEventListener('submit', async function(e) {
  e.preventDefault();

  const senha = document.getElementById('login-senha').value;
  const email = document.getElementById('login-email').value;

  if (!senha) {
    exibirNotificacao('Por favor, informe a senha', 'warning');
    return;
  }

  // Verificar se o cliente está inativo
  const cliente = todosClientes.find(c => c.id == clienteLoginId);
  if (!cliente) {
    exibirNotificacao('Cliente não encontrado.', 'error');
    return;
  }

  if (!cliente.ativo) {
    mostrarModalInativo();
    fecharModalLogin();
    return;
  }

  try {
    const response = await fetch('/api/clientes/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    if (response.ok) {
      const clienteLogado = await response.json();
      localStorage.setItem('clienteLogado', JSON.stringify(clienteLogado));
      exibirNotificacao('Login realizado com sucesso!', 'success');
      setTimeout(() => {
        window.location.href = 'principal.html';
      }, 1000);
    } else {
      const erro = await response.text();
      exibirNotificacao('Erro ao fazer login: ' + erro, 'error');
    }
  } catch (error) {
    console.error('Erro:', error);
    exibirNotificacao('Erro ao conectar com o servidor', 'error');
  }
});

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('show');
}

document.addEventListener('DOMContentLoaded', function() {
  // Máscara para CPF
  const cpfInput = document.getElementById('filtro-cpf');
  if (cpfInput) {
      cpfInput.addEventListener('input', function(e) {
          let value = e.target.value.replace(/\D/g, '');
          value = value.replace(/(\d{3})(\d)/, '$1.$2');
          value = value.replace(/(\d{3})(\d)/, '$1.$2');
          value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
          e.target.value = value.substring(0, 14);
      });
  }

  carregarClientes();
});

function mostrarModalInativo(mensagem = 'Não foi possível entrar, usuário inativado.') {
  document.getElementById('mensagem-inativo').textContent = mensagem;
  document.getElementById('modal-inativo').style.display = 'flex';
}

function fecharModalInativo() {
  document.getElementById('modal-inativo').style.display = 'none';
}

// Função para exibir notificações
function exibirNotificacao(mensagem, tipo = 'info') {
  const tipos = {
    success: { icon: 'fa-check-circle', color: 'var(--success-color)' },
    error: { icon: 'fa-exclamation-circle', color: 'var(--danger-color)' },
    warning: { icon: 'fa-exclamation-triangle', color: 'var(--warning-color)' },
    info: { icon: 'fa-info-circle', color: 'var(--info-color)' }
  };

  const notificacao = document.createElement('div');
  notificacao.style.position = 'fixed';
  notificacao.style.bottom = '20px';
  notificacao.style.right = '20px';
  notificacao.style.padding = '15px 20px';
  notificacao.style.backgroundColor = 'white';
  notificacao.style.borderLeft = `5px solid ${tipos[tipo].color}`;
  notificacao.style.borderRadius = 'var(--border-radius)';
  notificacao.style.boxShadow = 'var(--box-shadow)';
  notificacao.style.display = 'flex';
  notificacao.style.alignItems = 'center';
  notificacao.style.gap = '10px';
  notificacao.style.zIndex = '10000';
  notificacao.style.animation = 'fadeIn 0.3s ease-in-out';
  notificacao.innerHTML = `
    <i class="fas ${tipos[tipo].icon}" style="color: ${tipos[tipo].color}; font-size: 1.2em;"></i>
    <span>${mensagem}</span>
  `;

  document.body.appendChild(notificacao);

  setTimeout(() => {
    notificacao.style.animation = 'fadeOut 0.3s ease-in-out';
    setTimeout(() => {
      notificacao.remove();
    }, 300);
  }, 3000);
}

// Modal de Confirmação de Ação (Ativar/Inativar)
let acaoId = null;
let acaoTipo = null;

function abrirModalConfirmacao(clienteId, acao) {
  const cliente = todosClientes.find(c => c.id === clienteId);
  if (!cliente) return;

  const acaoTexto = acao === 'inativar' ? 'inativar' : 'ativar';
  const modalMsg = `Tem certeza que deseja ${acaoTexto} o cliente "${cliente.nome}"?`;

  document.getElementById('modal-msg').textContent = modalMsg;
  document.getElementById('btn-confirmar-excluir').onclick = function () {
    alterarStatusCliente(clienteId, acao === 'ativar');
  };

  document.getElementById('modal-excluir').style.display = 'flex';
}

async function alterarStatusCliente(clienteId, novoStatusAtivo) {
  try {
    const response = await fetch(`/api/clientes/${clienteId}/change-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ativo: novoStatusAtivo })
    });

    if (response.ok) {
      exibirNotificacao('Status do cliente atualizado com sucesso.', 'success');
      document.getElementById('modal-excluir').style.display = 'none';
      carregarClientes();
    } else {
      const erro = await response.text();
      exibirNotificacao('Erro ao atualizar status: ' + erro, 'error');
    }
  } catch (error) {
    console.error(error);
    exibirNotificacao('Erro na comunicação com o servidor.', 'error');
  }
}



function fecharModalConfirmacao() {
  document.getElementById('modal-confirmacao').style.display = 'none';
}

document.getElementById('btn-confirmar-acao').addEventListener('click', async function() {
  const motivo = document.getElementById('motivoInput').value.trim();
  if (!motivo) {
    exibirNotificacao('Por favor, informe o motivo.', 'warning');
    return;
  }

  try {
    if (acaoTipo === 'inativar') {
      await mudarStatusCliente(acaoId, false, motivo);
    } else {
      await mudarStatusCliente(acaoId, true, motivo);
    }
    fecharModalConfirmacao();
    carregarClientes();
  } catch (error) {
    console.error('Erro:', error);
    exibirNotificacao('Erro ao processar ação', 'error');
  }
});

async function mudarStatusCliente(id, ativo, motivo) {
  try {
    const response = await fetch(`/api/clientes/change-status/${id}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ ativo, motivo })
    });

    if (response.ok) {
      exibirNotificacao(`Cliente ${ativo ? 'ativado' : 'inativado'} com sucesso!`, 'success');
      return true;
    } else {
      const erro = await response.text();
      exibirNotificacao(erro || 'Erro ao alterar status do cliente.', 'error');
      throw new Error(erro);
    }
  } catch (error) {
    console.error('Erro:', error);
    exibirNotificacao('Erro na comunicação com o servidor.', 'error');
    throw error;
  }
}
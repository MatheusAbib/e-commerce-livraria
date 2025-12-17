 $(document).ready(function(){
      $('.hero-carousel').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 3500,
        arrows: true
      });
    });

    window.addEventListener('scroll', function() {
      const header = document.getElementById('main-header');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });

      function openChatbotPopup() {
    window.open(
      'chatbot.html',
      'Chatbot',
      'width=400,height=600,left=100,top=100'
    );
  }

    function showModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function hideModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }

    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('show');
    }

    window.addEventListener('click', function(event) {
      const modals = document.querySelectorAll('.modal, .profile-modal, .modal-produto');
      modals.forEach(modal => {
        if (event.target === modal) {
          hideModal(modal.id);
        }
      });
    });

    let clienteLogado = null;

    async function carregarDadosCliente() {
      try {
        const response = await fetch(`/api/clientes/${clienteLogado.id}`);
        if (!response.ok) throw new Error('Falha ao carregar dados');
        
        const dadosAtualizados = await response.json();
        clienteLogado = dadosAtualizados;
        
        // Garante que tipoTelefone existe no objeto
        if (!clienteLogado.hasOwnProperty('tipotelefone')) {
          clienteLogado.tipotelefone = ''; 
        }
        
        exibirDadosCliente();
        exibirEnderecosCartoes();
      } catch (error) {
        console.error('Erro:', error);
      }
    }

    // Exibe os dados principais do cliente
    function exibirDadosCliente() {
      const divDados = document.getElementById('dados-cliente');
      
      divDados.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div><strong>Nome:</strong> ${clienteLogado.nome}</div>
          <div><strong>Email:</strong> ${clienteLogado.email}</div>
          <div><strong>Telefone:</strong> ${formatarTipotelefone(clienteLogado.tipotelefone)} ${clienteLogado.telefone || '-'}</div>
          <div><strong>CPF:</strong> ${clienteLogado.cpf || '-'}</div>
          <div><strong>Nascimento:</strong> ${formatarData(clienteLogado.nascimento) || '-'}</div>
          <div><strong>Gênero:</strong> ${formatarGenero(clienteLogado.genero) || '-'}</div>
          <div><strong>Status:</strong> ${clienteLogado.ativo ? 'Ativo' : 'Inativo'}</div>
        </div>
      `;
    }

    // Função auxiliar para formatar o tipo de telefone
    function formatarTipotelefone(tipo) {
      if (!tipo) return '';
      return tipo === 'celular' ? '(Cel)' : '(Fixo)';
    }

    // Funções auxiliares para formatar os dados
    function formatarData(data) {
      if (!data) return '';
      return new Date(data).toLocaleDateString('pt-BR');
    }

    function formatarGenero(genero) {
      const generos = {
        'MASCULINO': 'Masculino',
        'FEMININO': 'Feminino',
        'PREFIRO_NAO_INFORMAR': 'Prefiro não informar'
      };
      return generos[genero] || genero;
    }

    function validarDataNascimento(dataString) {
      if (!dataString) return true; // Permite campo vazio
      
      // Verifica o formato básico (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dataString)) {
        console.log('Formato inválido');
        return false;
      }
      
      const dataNasc = new Date(dataString);
      const hoje = new Date();
      
      hoje.setHours(0, 0, 0, 0);
      
      if (isNaN(dataNasc.getTime())) {
        console.log('Data inválida');
        return false;
      }
      
      if (dataNasc > hoje) {
        console.log('Data futura');
        return false;
      }
      
      return true;
    }

    // Exibe endereços e cartões
   function exibirEnderecosCartoes() {
  const divEnderecosCartoes = document.getElementById('enderecos-cartoes');
  
  let html = '';
  
  // Endereço de cobrança
  const enderecoCobranca = clienteLogado.enderecos?.find(e => e.tipo === 'COBRANCA') || {};
  html += `
    <div class="modal-section" style="margin-bottom: 30px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3>Endereço de Cobrança</h3>
        <button onclick="editarEndereco(${enderecoCobranca.id || 'null'}, 'COBRANCA')" class="btn btn-primary btn-sm">
          <i class="fas fa-edit"></i> Editar
        </button>
      </div>
      <div class="endereco-info" id="endereco-cobranca-${enderecoCobranca.id || '0'}" style="padding: 15px; background: #f8f9fa; border-radius: 5px;">
        ${formatarEndereco(enderecoCobranca)}
      </div>
    </div>
  `;
  
  // Endereços de entrega
  const enderecosEntrega = clienteLogado.enderecos?.filter(e => e.tipo === 'ENTREGA') || [];
  if (enderecosEntrega.length > 0) {
    html += `<div class="modal-section" style="margin-bottom: 30px;"><h3>Endereço(s) de Entrega</h3>`;
    
    enderecosEntrega.forEach((e) => {
      html += `
        <div class="endereco-container" style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h4 style="margin: 0;">
              <span id="nome-endereco-${e.id}">${e.nomeEndereco || 'Endereço de Entrega'}</span>
              <button onclick="editarNomeEndereco(${e.id})" class="btn-icon" style="background: none; border: none; cursor: pointer; margin-left: 5px;">
                <i class="fas fa-edit"></i>
              </button>
            </h4>
            <div>
              <button onclick="editarEndereco(${e.id}, 'ENTREGA')" class="btn btn-primary btn-sm">
                <i class="fas fa-edit"></i> Editar
              </button>
              <button onclick="confirmarExclusaoEndereco(${e.id})" class="btn btn-danger btn-sm" style="margin-left: 5px;">
                <i class="fas fa-trash"></i> Excluir
              </button>
            </div>
          </div>
          <div class="endereco-info" id="endereco-${e.id}">
            ${formatarEndereco(e)}
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
  }
  
  // Botão para adicionar novo endereço de entrega
  html += `
    <div style="margin-bottom: 30px;">
      <button onclick="adicionarNovoEndereco()" class="btn btn-accent">
        <i class="fas fa-plus"></i> Adicionar Endereço de Entrega
      </button>
    </div>
  `;
  
  // Cartões de crédito
  if (clienteLogado.cartoes && clienteLogado.cartoes.length > 0) {
      html += `<div class="modal-section" style="margin-bottom: 30px;"><h3>Cartões de Crédito</h3>`;
      
      clienteLogado.cartoes.forEach((cartao, index) => {
          const classeCartao = cartao.preferencial ? 'cartao-info preferencial' : 'cartao-info';

          html += `
              <div id="cartao-container-${index}" class="${classeCartao}" style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 5px; position: relative;">
                  ${cartao.preferencial ? '<div class="badge-preferencial">PREFERENCIAL</div>' : ''}
                  <div id="cartao-view-${index}">
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                          <div>
                              <p><strong>Cartão ${index + 1}:</strong> ${cartao.bandeira || 'Sem bandeira'}</p>
                              <p><strong>Número:</strong> **** **** **** ${cartao.numero ? cartao.numero.slice(-4) : '****'}</p>
                              <p><strong>Nome:</strong> ${cartao.nomeTitular || '-'}</p>
                              <p><strong>Validade:</strong> ${cartao.dataValidade || '-'}</p>
                          </div>
                          <div>
                              <button onclick="editarCartao(${index})" class="btn btn-primary btn-sm">
                                <i class="fas fa-edit"></i> Editar
                              </button>
                              <button onclick="confirmarExclusaoCartao(${cartao.id})" class="btn btn-danger btn-sm" style="margin-left: 5px;  ">
                                <i class="fas fa-trash"></i> Excluir
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          `;
      });
      
      html += `</div>`;
  }
  
  // Botão para adicionar novo cartão
  html += `
    <div>
      <button onclick="adicionarNovoCartao()" class="btn btn-accent">
        <i class="fas fa-plus"></i> Adicionar Cartão de Crédito
      </button>
    </div>
  `;
  
  divEnderecosCartoes.innerHTML = html;
}

    // Formata um endereço para exibição
    function formatarEndereco(endereco) {
      return `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div><strong>CEP:</strong> ${endereco.cep || '-'}</div>
          <div><strong>Rua:</strong> ${endereco.rua || '-'}</div>
          <div><strong>Número:</strong> ${endereco.numero || '-'}</div>
          <div><strong>Complemento:</strong> ${endereco.complemento || '-'}</div>
          <div><strong>Bairro:</strong> ${endereco.bairro || '-'}</div>
          <div><strong>Cidade:</strong> ${endereco.cidade || '-'}</div>
          <div><strong>Estado:</strong> ${endereco.estado || '-'}</div>
          <div><strong>País:</strong> ${endereco.pais || 'Brasil'}</div>
          <div><strong>Tipo Residência:</strong> ${endereco.tipoResidencia || '-'}</div>
          <div><strong>Tipo Logradouro:</strong> ${endereco.tipoLogradouro || '-'}</div>
          <div><strong>Logradouro:</strong> ${endereco.logradouro || '-'}</div>
        </div>
      `;
    }

    // Função para editar os dados principais do cliente
    function editarMeusDados() {
      const modal = document.getElementById('modal-editar');
      if (!modal) return;

      document.getElementById('cliente-id').value = clienteLogado.id;
      document.getElementById('editar-nome').value = clienteLogado.nome;
      document.getElementById('editar-email').value = clienteLogado.email;
      document.getElementById('editar-telefone').value = clienteLogado.telefone || '';
      document.getElementById('editar-cpf').value = clienteLogado.cpf || '';
      document.getElementById('editar-nascimento').value = clienteLogado.nascimento || '';
      document.getElementById('editar-genero').value = clienteLogado.genero || '';

      const tipotelefone = clienteLogado.tipotelefone || '';
      const selectTipo = document.getElementById('editar-tipotelefone');

      if (selectTipo) {
        selectTipo.value = tipotelefone;
      }

      // Atualiza o placeholder conforme o tipo
      if (tipotelefone) {
        document.getElementById('editar-telefone').placeholder = 
          tipotelefone === 'celular' ? '(00) 00000-0000' : '(00) 0000-0000';
      }

      showModal('modal-editar');
    }

    // Fecha o modal de edição
    function fecharModalEditar() {
      hideModal('modal-editar');
    }

    // Submissão do formulário de edição
    document.getElementById('form-editar-cliente').addEventListener('submit', async function(e) {
      e.preventDefault();

      const dadosAtualizados = {
        nome: document.getElementById('editar-nome').value,
        email: document.getElementById('editar-email').value,
        telefone: document.getElementById('editar-telefone').value,
        tipotelefone: document.getElementById('editar-tipotelefone').value || null,
        cpf: document.getElementById('editar-cpf').value,
        nascimento: document.getElementById('editar-nascimento').value || null,
        genero: document.getElementById('editar-genero').value || null
      };

      try {
        const response = await fetch(`/api/clientes/${clienteLogado.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
          alert('Dados atualizados com sucesso!');
          await carregarDadosCliente();
          fecharModalEditar();
        } else {
          const error = await response.json();
          alert(`Erro: ${error.message || 'Falha ao atualizar dados'}`);
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
      }
    });

    // Funções para alteração de senha
    function abrirModalSenha() {
      showModal('modal-senha');
    }

    function fecharModalSenha() {
      hideModal('modal-senha');
    }

    document.getElementById('form-alterar-senha').addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const novaSenha = document.getElementById('nova-senha').value;
      const confirmarSenha = document.getElementById('confirmar-senha').value;
      
      if (novaSenha !== confirmarSenha) {
        alert('As senhas não conferem!');
        return;
      }
      
      try {
        const response = await fetch(`/api/clientes/${clienteLogado.id}/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senha: novaSenha,
            confirmacaoSenha: confirmarSenha
          })
        });
        
        if (response.ok) {
          alert('Senha alterada com sucesso!');
          fecharModalSenha();
        } else {
          const error = await response.json();
          alert(`Erro: ${error.message || 'Falha ao alterar senha'}`);
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
      }
    });

    // Funções para endereços
    async function editarEndereco(enderecoId, tipo) {
      let endereco;
      
      if (enderecoId && enderecoId !== 'null') {
        const response = await fetch(`/api/enderecos/${enderecoId}`);
        if (!response.ok) {
          alert('Erro ao carregar endereço');
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
          tipo: tipo,
          tipoResidencia: '',
          tipoLogradouro: '',
          logradouro: ''
        };
      }
      
      const containerId = tipo === 'COBRANCA' 
        ? `endereco-cobranca-${enderecoId || '0'}` 
        : `endereco-${enderecoId}`;
      
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = `
        <form id="form-editar-endereco" onsubmit="salvarEndereco(${enderecoId || 'null'}, '${tipo}'); return false;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label>CEP</label>
              <input type="text" name="cep" value="${endereco.cep || ''}" required>
            </div>
            <div>
              <label>Rua</label>
              <input type="text" name="rua" value="${endereco.rua || ''}" required>
            </div>
            <div>
              <label>Número</label>
              <input type="text" name="numero" value="${endereco.numero || ''}" required>
            </div>
            <div>
              <label>Complemento</label>
              <input type="text" name="complemento" value="${endereco.complemento || ''}">
            </div>
            <div>
              <label>Bairro</label>
              <input type="text" name="bairro" value="${endereco.bairro || ''}" required>
            </div>
            <div>
              <label>Cidade</label>
              <input type="text" name="cidade" value="${endereco.cidade || ''}" required>
            </div>
            <div>
              <label>Estado</label>
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
              <label>País</label>
              <input type="text" name="pais" value="${endereco.pais || 'Brasil'}" readonly>
            </div>
            <!-- Campos adicionados -->
            <div>
              <label>Tipo de Residência</label>
              <input type="text" name="tipoResidencia" value="${endereco.tipoResidencia || ''}">
            </div>
            <div>
              <label>Tipo de Logradouro</label>
              <input type="text" name="tipoLogradouro" value="${endereco.tipoLogradouro || ''}">
            </div>
            <div>
              <label>Logradouro</label>
              <input type="text" name="logradouro" value="${endereco.logradouro || ''}">
            </div>
          </div>
          <div style="margin-top: 15px; display: flex; gap: 10px;">
            <button type="submit" class="btn btn-salvar">Salvar</button>
            <button type="button" class="btn btn-cancelar" onclick="cancelarEdicaoEndereco('${containerId}', ${enderecoId || 'null'}, '${tipo}')">Cancelar</button>
          </div>
        </form>
      `;
    }

    async function salvarEndereco(enderecoId, tipo) {
      const form = document.getElementById('form-editar-endereco');
      const formData = new FormData(form);
      
      const enderecoAtualizado = {
        cep: formData.get('cep').replace(/\D/g, ''),
        rua: formData.get('rua'),
        numero: formData.get('numero'),
        complemento: formData.get('complemento'),
        bairro: formData.get('bairro'),
        cidade: formData.get('cidade'),
        estado: formData.get('estado'),
        pais: formData.get('pais'),
        tipo: tipo,
        tipoResidencia: formData.get('tipoResidencia'),
        tipoLogradouro: formData.get('tipoLogradouro'),
        logradouro: formData.get('logradouro')
      };

      try {
        let response;
        
        if (enderecoId && enderecoId !== 'null') {
          response = await fetch(`/api/enderecos/${enderecoId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(enderecoAtualizado)
          });
        } else {
          enderecoAtualizado.clienteId = clienteLogado.id;
          if (tipo === 'ENTREGA') {
            enderecoAtualizado.nomeEndereco = `Endereço de Entrega ${new Date().toLocaleString()}`;
          }
          
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
          alert('Endereço salvo com sucesso!');
          await carregarDadosCliente();
        } else {
          const error = await response.text();
          alert(`Erro ao salvar endereço: ${error}`);
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
      }
    }

    function cancelarEdicaoEndereco(containerId, enderecoId, tipo) {
      if (enderecoId && enderecoId !== 'null') {
        fetch(`/api/enderecos/${enderecoId}`)
          .then(res => res.json())
          .then(endereco => {
            document.getElementById(containerId).innerHTML = formatarEndereco(endereco);
          })
          .catch(err => {
            console.error('Erro ao carregar endereço:', err);
            document.getElementById(containerId).innerHTML = '';
          });
      } else {
        document.getElementById(containerId).innerHTML = '';
      }
    }

    async function editarNomeEndereco(enderecoId) {
      const spanNome = document.getElementById(`nome-endereco-${enderecoId}`);
      const nomeAtual = spanNome.textContent;

      const novoNome = prompt("Digite o novo nome para este endereço:", nomeAtual);

      if (novoNome !== null && novoNome.trim() !== '' && novoNome !== nomeAtual) {
        try {
          const response = await fetch(`/api/enderecos/${enderecoId}/nome`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nomeEndereco: novoNome.trim() })
          });

          if (response.ok) {
            spanNome.textContent = novoNome.trim();
            alert("Nome do endereço atualizado com sucesso!");
          } else {
            const error = await response.text();
            alert(`Erro ao atualizar nome: ${error}`);
          }
        } catch (error) {
          console.error('Erro:', error);
          alert('Erro ao conectar com o servidor');
        }
      }
    }

    function adicionarNovoEndereco() {
      // Limpa o formulário
      document.getElementById('form-novo-endereco').reset();
      document.getElementById('novo-endereco-pais').value = 'Brasil';
      
      // Abre o modal
      showModal('modal-endereco');
    }

async function confirmarExclusaoEndereco(enderecoId) {
  if (!confirm('Tem certeza que deseja excluir este endereço?')) {
    return;
  }

  try {
    const response = await fetch(`/api/enderecos/${enderecoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      alert('Endereço excluído com sucesso!');
      await carregarDadosCliente();
    } else {
      const errorText = await response.text();
      let errorMessage = 'Erro ao excluir endereço';
      
      if (response.status === 400) {
        errorMessage = 'Não é possível excluir o endereço de cobrança principal';
      } else if (response.status === 404) {
        errorMessage = 'Endereço não encontrado';
      } else if (response.status === 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      }
      
      alert(`${errorMessage}: ${errorText}`);
    }
  } catch (error) {
    console.error('Erro completo:', error);
    alert('Erro de conexão. Verifique sua internet e tente novamente.');
  }
}

async function debugExclusaoEndereco(enderecoId) {
  try {
    console.log('Tentando excluir endereço ID:', enderecoId);
    
    const response = await fetch(`/api/enderecos/${enderecoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Status da resposta:', response.status);
    console.log('Status text:', response.statusText);
    
    const responseText = await response.text();
    console.log('Corpo da resposta:', responseText);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }

    return responseText;
  } catch (error) {
    console.error('Erro detalhado:', error);
    throw error;
  }
}

async function confirmarExclusaoEnderecoDebug(enderecoId) {
  if (confirm('Tem certeza que deseja excluir este endereço?')) {
    try {
      await debugExclusaoEndereco(enderecoId);
      alert('Endereço excluído com sucesso!');
      await carregarDadosCliente();
    } catch (error) {
      console.error('Erro na exclusão:', error);
      alert('Erro ao excluir endereço. Verifique o console para detalhes.');
    }
  }
}
    // Funções para cartões
    async function editarCartao(indexCartao) {
      const cartao = clienteLogado.cartoes[indexCartao];
      const cartaoView = document.getElementById(`cartao-view-${indexCartao}`);
      
      if (!cartaoView) return;

      cartaoView.innerHTML = `
          <form id="form-editar-cartao-${indexCartao}" onsubmit="salvarCartao(${indexCartao}); return false;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                  <div>
                      <label>Número do Cartão</label>
                      <input type="text" name="numero" value="${cartao.numero || ''}" required>
                  </div>
                  <div>
                      <label>Nome no Cartão</label>
                      <input type="text" name="nomeTitular" value="${cartao.nomeTitular || ''}" required>
                  </div>
                  <div>
                      <label>Bandeira</label>
                      <select name="bandeira" required>
                          <option value="">Selecione</option>
                          <option value="Visa" ${cartao.bandeira === 'Visa' ? 'selected' : ''}>Visa</option>
                          <option value="Mastercard" ${cartao.bandeira === 'Mastercard' ? 'selected' : ''}>Mastercard</option>
                          <option value="Elo" ${cartao.bandeira === 'Elo' ? 'selected' : ''}>Elo</option>
                          <option value="American Express" ${cartao.bandeira === 'American Express' ? 'selected' : ''}>American Express</option>
                      </select>
                  </div>
                  <div>
                      <label>CVV</label>
                      <input type="text" name="cvv" value="${cartao.cvv || ''}" required maxlength="4">
                  </div>
                  <div>
                      <label>Validade (MM/AAAA)</label>
                      <input type="text" name="dataValidade" value="${cartao.dataValidade || ''}" placeholder="MM/AAAA" required>
                  </div>
                  <div>
                      <label>
                          <input type="checkbox" name="preferencial" ${cartao.preferencial ? 'checked' : ''}>
                          Cartão Preferencial
                      </label>
                  </div>
              </div>
              <div style="margin-top: 15px; display: flex; gap: 10px;">
                  <button type="submit" class="btn btn-salvar">Salvar</button>
                  <button type="button" class="btn btn-cancelar" onclick="cancelarEdicaoCartao(${indexCartao})">Cancelar</button>
              </div>
          </form>
      `;
      
      // Aplica máscara ao número do cartão
      const numeroInput = cartaoView.querySelector(`input[name="numero"]`);
      if (numeroInput) {
          numeroInput.addEventListener('input', function(e) {
              let value = e.target.value.replace(/\D/g, '');
              value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
              e.target.value = value.substring(0, 19);
          });
      }
      
      // Aplica máscara à validade (MM/AAAA)
      const validadeInput = cartaoView.querySelector(`input[name="dataValidade"]`);
      if (validadeInput) {
          validadeInput.addEventListener('input', function(e) {
              let value = e.target.value.replace(/\D/g, '');
              if (value.length > 2) {
                  value = value.substring(0, 2) + '/' + value.substring(2, 6);
              }
              e.target.value = value.substring(0, 7);
          });
      }
    }

    async function salvarCartao(indexCartao) {
        const form = document.getElementById(`form-editar-cartao-${indexCartao}`);
        if (!form) return;
        
        const formData = new FormData(form);
        
        const cartaoAtualizado = {
            numero: formData.get('numero').replace(/\s/g, ''),
            nomeTitular: formData.get('nomeTitular'),
            bandeira: formData.get('bandeira'),
            cvv: formData.get('cvv'),
            dataValidade: formData.get('dataValidade'),
            preferencial: formData.get('preferencial') === 'on'
        };

        try {
          const cartao = clienteLogado.cartoes[indexCartao];
          const cartaoId = cartao.id;  

          const response = await fetch(`/api/clientes/${clienteLogado.id}/cartoes/${cartaoId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(cartaoAtualizado)
          });

          if (response.ok) {
              await carregarDadosCliente();
          } else {
              const error = await response.text();
              alert(`Erro ao atualizar cartão: ${error}`);
          }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao conectar com o servidor');
        }
    }

    function cancelarEdicaoCartao(indexCartao) {
        // Recarrega apenas o cartão específico em vez de recarregar tudo
        const cartao = clienteLogado.cartoes[indexCartao];
        const cartaoView = document.getElementById(`cartao-view-${indexCartao}`);
        
        if (cartaoView) {
            cartaoView.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p><strong>Cartão ${indexCartao + 1}:</strong> ${cartao.bandeira || 'Sem bandeira'}</p>
                        <p><strong>Número:</strong> **** **** **** ${cartao.numero ? cartao.numero.slice(-4) : '****'}</p>
                        <p><strong>Nome:</strong> ${cartao.nomeTitular || '-'}</p>
                        <p><strong>Validade:</strong> ${cartao.dataValidade || '-'}</p>
                    </div>
                    <div>
                        <button onclick="editarCartao(${indexCartao})" class="btn btn-primary btn-sm">Editar</button>
                        <button onclick="confirmarExclusaoCartao(${cartao.id})" class="btn btn-danger btn-sm" style="margin-left: 5px;">Excluir</button>
                    </div>
                </div>
            `;
        }
    }

    function formatarDataValidade(data) {
        if (!data) return '';
        // Assume que a data pode estar no formato MM/AAAA ou AAAA-MM
        if (data.includes('/')) {
            return data;
        } else {
            const parts = data.split('-');
            if (parts.length === 2) {
                return `${parts[1]}/${parts[0]}`; // Converte de AAAA-MM para MM/AAAA
            }
            return data;
        }
    }

    function adicionarNovoCartao() {
      // Limpa o formulário
      document.getElementById('form-novo-cartao').reset();
      document.getElementById('novo-cartao-preferencial').checked = false;
      
      // Abre o modal
      showModal('modal-cartao');
    }

    function fecharModalCartao() {
      hideModal('modal-cartao');
    }

   async function adicionarCartao(event) {
  event.preventDefault();
  
  const numeroCartao = document.getElementById('novo-cartao-numero').value.replace(/\s/g, '');
  const nomeTitular = document.getElementById('novo-cartao-nome').value;
  const bandeira = document.getElementById('novo-cartao-bandeira').value;
  const cvv = document.getElementById('novo-cartao-cvv').value;
  const dataValidade = document.getElementById('novo-cartao-validade').value;
  const preferencial = document.getElementById('novo-cartao-preferencial').checked;

  // Validações
  if (!numeroCartao || numeroCartao.length < 16) {
    alert('Número do cartão inválido. Deve ter 16 dígitos.');
    return;
  }

  if (!nomeTitular || nomeTitular.trim().length < 3) {
    alert('Nome no cartão é obrigatório e deve ter pelo menos 3 caracteres.');
    return;
  }

  if (!bandeira) {
    alert('Selecione a bandeira do cartão.');
    return;
  }

  // Validação do CVV conforme bandeira
  const cvvLength = bandeira === 'American Express' ? 4 : 3;
  if (!cvv || cvv.length !== cvvLength || !/^\d+$/.test(cvv)) {
    alert(`CVV inválido. Deve ter ${cvvLength} dígitos.`);
    return;
  }

  if (!dataValidade) {
    alert('Data de validade é obrigatória.');
    return;
  }

  // Formata a data (MM/AAAA)
  const [ano, mes] = dataValidade.split('-');
  const dataValidadeFormatada = `${mes}/${ano}`;

  // Valida se a data não está expirada
  const dataAtual = new Date();
  const anoAtual = dataAtual.getFullYear();
  const mesAtual = dataAtual.getMonth() + 1;
  
  if (parseInt(ano) < anoAtual || (parseInt(ano) === anoAtual && parseInt(mes) < mesAtual)) {
    alert('Cartão expirado. Verifique a data de validade.');
    return;
  }

  const novoCartao = {
    numero: numeroCartao,
    nomeTitular: nomeTitular,
    bandeira: bandeira,
    cvv: cvv,
    dataValidade: dataValidadeFormatada,
    preferencial: preferencial,
    clienteId: clienteLogado.id
  };

  try {
    const response = await fetch(`/api/clientes/${clienteLogado.id}/cartoes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(novoCartao)
    });
    
    if (response.ok) {
      alert('Cartão adicionado com sucesso!');
      fecharModalCartao();
      await carregarDadosCliente();
    } else {
      const error = await response.json();
      alert(`Erro ao adicionar cartão: ${error.message || 'Erro desconhecido'}`);
    }
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao conectar com o servidor');
  }
}

async function adicionarEndereco(event) {
  event.preventDefault();
  
  try {
    // 1. Coletar e formatar os dados corretamente
const formData = {
  nomeEndereco: document.getElementById('novo-endereco-nome').value.trim(),
  cep: document.getElementById('novo-endereco-cep').value.replace(/\D/g, ''),
  rua: document.getElementById('novo-endereco-rua').value.trim(),
  logradouro: document.getElementById('novo-endereco-logradouro').value.trim(),
  numero: document.getElementById('novo-endereco-numero').value.trim(),
  complemento: document.getElementById('novo-endereco-complemento').value.trim(),
  bairro: document.getElementById('novo-endereco-bairro').value.trim(),
  cidade: document.getElementById('novo-endereco-cidade').value.trim(),
  estado: document.getElementById('novo-endereco-estado').value,
  pais: document.getElementById('novo-endereco-pais').value.trim(),
  tipoResidencia: document.getElementById('novo-endereco-tipo-residencia').value.trim(),
  tipoLogradouro: document.getElementById('novo-endereco-tipo-logradouro').value.trim(),
  tipo: 'ENTREGA',
  cliente: { id: clienteLogado.id } 
};


    // 2. Validações reforçadas
    if (!formData.nomeEndereco) {
      alert('Dê um nome ao endereço (ex: Casa, Trabalho)');
      return;
    }

    if (!/^\d{8}$/.test(formData.cep)) {
      alert('CEP deve conter 8 dígitos');
      return;
    }

    if (!formData.rua || formData.rua.length < 3) {
      alert('Rua deve ter pelo menos 3 caracteres');
      return;
    }

    if (!formData.numero) {
      alert('Número é obrigatório');
      return;
    }

    if (!formData.bairro || formData.bairro.length < 3) {
      alert('Bairro deve ter pelo menos 3 caracteres');
      return;
    }

    if (!formData.cidade || formData.cidade.length < 3) {
      alert('Cidade deve ter pelo menos 3 caracteres');
      return;
    }

    if (!formData.estado || formData.estado.length !== 2) {
      alert('Selecione um estado válido');
      return;
    }

    // 3. Converter sigla do estado para UF (PE, SP, etc.)
    const estadoMap = {
      'Pernambuco': 'PE',
      'São Paulo': 'SP'
      // Adicione outros estados conforme necessário
    };
    
    formData.estado = estadoMap[formData.estado] || formData.estado;

    // 4. Enviar para a API
    const response = await fetch('/api/enderecos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(formData)
    });

    // 5. Processar resposta
    const responseData = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      const errorMsg = responseData.message || 
                      (responseData.errors ? JSON.stringify(responseData.errors) : null) ||
                      `Erro ${response.status}: ${response.statusText}`;
      throw new Error(errorMsg);
    }

    // 6. Sucesso
    alert('Endereço cadastrado com sucesso!');
    fecharModalEndereco();
    await carregarDadosCliente();

  } catch (error) {
    console.error('Erro completo:', error);
    
    let errorMessage = 'Erro ao cadastrar endereço';
    if (error.message.includes('400')) {
      errorMessage = 'Dados inválidos: ' + error.message.replace('400: ', '');
    } else if (error.message) {
      errorMessage += ': ' + error.message;
    }
    
    alert(errorMessage);
  }
}

function fecharModalEndereco() {
  hideModal('modal-endereco');
  // Limpa o formulário
  document.getElementById('form-novo-endereco').reset();
  document.getElementById('novo-endereco-pais').value = 'Brasil';
}

    async function confirmarExclusaoCartao(idCartaoReal) {
      try {
        const responseCheck = await fetch(`/api/cartoes/${idCartaoReal}/pedidos`);
        const hasPedidos = await responseCheck.json();
        
        if (hasPedidos) {
          const opcao = confirm('Este cartão está associado a pedidos. Deseja:\n\n' +
                             'OK - Desvincular os pedidos e excluir o cartão\n' +
                             'Cancelar - Manter o cartão');
          
          if (!opcao) return; // Usuário cancelou
        }

        // Prossegue com a exclusão
        const response = await fetch(`/api/clientes/${clienteLogado.id}/cartoes/${idCartaoReal}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Cartão excluído com sucesso!');
          await carregarDadosCliente();
        } else {
          const error = await response.text();
          alert(`Erro ao excluir cartão: ${error}`);
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
      }
    }

    // Máscaras para campos
    document.addEventListener('DOMContentLoaded', function() {
      // Máscara para CPF
      const cpfInput = document.getElementById('editar-cpf');
      if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
          let value = e.target.value.replace(/\D/g, '');
          
          value = value.replace(/(\d{3})(\d)/, '$1.$2');
          value = value.replace(/(\d{3})(\d)/, '$1.$2');
          value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
          
          e.target.value = value.substring(0, 14);
        });
      }

      // Validação e máscara para data de nascimento
      const nascimentoInput = document.getElementById('editar-nascimento');
      if (nascimentoInput) {
        // Define a data máxima como hoje
        const hoje = new Date();
        const hojeFormatado = hoje.toISOString().split('T')[0];
        nascimentoInput.max = hojeFormatado;
        
        nascimentoInput.addEventListener('change', function() {
          if (this.value && !validarDataNascimento(this.value)) {
            alert('Data de nascimento inválida! Deve ser uma data válida e não pode ser futura.');
            this.value = '';
          }
        });
      }
      
      // Máscara para CEP
      const cepInput = document.getElementById('editar-cep');
      if (cepInput) {
        cepInput.addEventListener('input', function(e) {
          let value = e.target.value.replace(/\D/g, '');
          value = value.replace(/^(\d{5})(\d)/, '$1-$2');
          e.target.value = value.substring(0, 9);
        });
      }
      
      const telefoneInput = document.getElementById('editar-telefone');
      const tipotelefoneSelect = document.getElementById('editar-tipotelefone');
      
      if (telefoneInput && tipotelefoneSelect) {
        tipotelefoneSelect.addEventListener('change', function() {
          telefoneInput.value = '';
          telefoneInput.placeholder = this.value === 'celular' ? '(00) 00000-0000' : '(00) 0000-0000';
        });

        telefoneInput.addEventListener('input', function(e) {
          const tipo = tipotelefoneSelect.value;
          let valor = e.target.value.replace(/\D/g, '');

          if (tipo === 'celular') {
            // Celular (11 dígitos)
            if (valor.length > 11) valor = valor.substring(0, 11);
            valor = valor.replace(/^(\d{0,2})(\d{0,5})(\d{0,4})/, function(_, ddd, p1, p2) {
              let res = "";
              if (ddd) res += "(" + ddd;
              if (ddd.length === 2) res += ") ";
              if (p1) res += p1;
              if (p2) res += "-" + p2;
              return res;
            });
          } else {
            // Fixo (10 dígitos)
            if (valor.length > 10) valor = valor.substring(0, 10);
            valor = valor.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})/, function(_, ddd, p1, p2) {
              let res = "";
              if (ddd) res += "(" + ddd;
              if (ddd.length === 2) res += ") ";
              if (p1) res += p1;
              if (p2) res += "-" + p2;
              return res;
            });
          }

          telefoneInput.value = valor;
        });

        telefoneInput.addEventListener('keydown', function(e) {
          const pos = telefoneInput.selectionStart;
          const val = telefoneInput.value;

          if (
            e.key === "Backspace" &&
            pos > 0 &&
            [" ", "-", ")", "("].includes(val[pos - 1])
          ) {
            e.preventDefault();
            telefoneInput.setSelectionRange(pos - 1, pos - 1);
          }
        });
      }
const numeroCartaoInput = document.getElementById('novo-cartao-numero');
if (numeroCartaoInput) {
  numeroCartaoInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value.substring(0, 19);
  });
}

const cvvInput = document.getElementById('novo-cartao-cvv');
if (cvvInput) {
  cvvInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    const bandeira = document.getElementById('novo-cartao-bandeira').value;
    
    // American Express tem 4 dígitos
    const maxLength = bandeira === 'American Express' ? 4 : 3;
    e.target.value = value.substring(0, maxLength);
  });
}

// Atualiza o maxlength do CVV quando a bandeira muda
const bandeiraSelect = document.getElementById('novo-cartao-bandeira');
if (bandeiraSelect) {
  bandeiraSelect.addEventListener('change', function() {
    const cvvInput = document.getElementById('novo-cartao-cvv');
    if (this.value === 'American Express') {
      cvvInput.maxLength = 4;
      cvvInput.placeholder = '4 dígitos';
    } else {
      cvvInput.maxLength = 3;
      cvvInput.placeholder = '3 dígitos';
    }
    // Limpa o CVV quando muda a bandeira
    cvvInput.value = '';
  });
}


    });

    // Função para alternar entre login/logout
    function toggleAuth() {
      const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
      
      if (clienteLogado) {
        logout();
      } else {
        mostrarFormularioLogin();
      }
    }

    // Mostra o formulário de login
    function mostrarFormularioLogin() {
      document.getElementById('login-container').style.display = 'block';
      document.getElementById('btn-auth').style.display = 'none';
      document.querySelector('.profile-icon').style.display = 'none';
    }

    // Esconde o formulário de login
    function esconderFormularioLogin() {
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('btn-auth').style.display = 'block';
      document.querySelector('.profile-icon').style.display = 'block';
    }

    // Função para cancelar o login
    function cancelarLogin() {
      esconderFormularioLogin();
    }

// Função para fazer login
async function fazerLogin() {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;
    
    if (!email || !senha) {
        alert('Por favor, preencha email e senha');
        return;
    }

    try {
        const response = await fetch('window.location.origin/clientes/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email,
                senha: senha
            })
        });

        if (response.ok) {
            const usuario = await response.json();
            
            // Armazena o usuário logado
            localStorage.setItem('clienteLogado', JSON.stringify(usuario));
            
            // Fecha o modal e RECARREGA A PÁGINA
            closeModalLogin();
            location.reload(); 
            
        } else {
            const error = await response.text();
            alert(`Erro: ${error || 'Credenciais inválidas'}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

function logout() {
    // Limpa o carrinho temporário ao deslogar
    limparCarrinhoVisitante();
    
    localStorage.removeItem('clienteLogado');
    
    // RECARREGA A PÁGINA antes de fechar o modal
    location.reload(); 
    
    atualizarUI(null);
    document.getElementById('profile-content').style.display = 'none';
    fecharModalLogout();
}

// Atualiza UI do header conforme login
function atualizarUI(usuario) {
    const nomeCliente = document.getElementById('nome-cliente');
    const btnAuth = document.getElementById('btn-auth');
    const profileIcon = document.getElementById('profile-icon');
    const cartIcon = document.getElementById('cart-icon');

    if (usuario) {
        nomeCliente.textContent = usuario.nome;
        
        // Altera para ícone de logout com tooltip
        btnAuth.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        btnAuth.title = 'Sair'; 
        
        profileIcon.style.display = 'inline-block';
        cartIcon.style.display = 'inline-block'; 
        clienteLogado = usuario;
        carregarDadosCliente();
        atualizarContadorCarrinho(); 
    } else {
        nomeCliente.textContent = 'Visitante';
        
        // Volta para o ícone/texto de login
        btnAuth.innerHTML = '<i class="fas fa-sign-in-alt"></i>';
        btnAuth.removeAttribute('title');
        
        profileIcon.style.display = 'none';
        cartIcon.style.display = 'none'; 
        clienteLogado = null;
        fecharPerfil();
    }
}

    function limparCarrinhoVisitante() {
      localStorage.removeItem('carrinhoVisitante');
    }

    function carregarCarrinhoUsuario(usuarioId) {
      const carrinhos = JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
      const carrinho = carrinhos[usuarioId] || [];
      salvarCarrinho(carrinho);
      atualizarContadorCarrinho();
    }

document.getElementById('form-login').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const senha = document.getElementById('login-senha').value.trim();

    if (!email || !senha) {
        alert('Preencha email e senha');
        return;
    }

    try {
        const response = await fetch('/api/clientes/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, senha })
        });

        if (response.ok) {
            const usuario = await response.json();
            localStorage.setItem('clienteLogado', JSON.stringify(usuario));
            
            // Fecha o modal e RECARREGA
            closeModalLogin();
            location.reload(); 
            
        } else {
            const erro = await response.text();
            alert('Erro no login: ' + (erro || 'Credenciais inválidas'));
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
});

    window.addEventListener('DOMContentLoaded', () => {
      carregarProdutos();

      const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
      atualizarUI(clienteLogado);

      atualizarContadorCarrinho();
    });

    function openModalLogin() {
      showModal('modal-login');
    }

    // Fechar modal login
    function closeModalLogin() {
      hideModal('modal-login');
      // Limpar inputs
      document.getElementById('login-email').value = '';
      document.getElementById('login-senha').value = '';
    }

    function handleAuthClick() {
      const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
      if (clienteLogado) {
        abrirModalLogout();
      } else {
        openModalLogin();
      }
    }

    document.getElementById('profile-icon').addEventListener('click', function() {
      abrirPerfil();
    });

    function abrirPerfil() {
      showModal('profile-modal');
    }

    function fecharPerfil() {
      hideModal('profile-modal');
    }

    // Funções para o modal de logout
    function abrirModalLogout() {
      showModal('modal-logout');
    }

    function fecharModalLogout() {
      hideModal('modal-logout');
    }

    function confirmarLogout() {
      logout(); 
      fecharModalLogout();
    }

    // Variável para o carrinho de compras
    function obterTodosCarrinhos() {
      return JSON.parse(localStorage.getItem('carrinhosPorUsuario')) || {};
    }

    function obterCarrinho() {
      const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
      if (!clienteLogado) return []; 
      
      const todosCarrinhos = obterTodosCarrinhos();
      return todosCarrinhos[clienteLogado.id] || []; 
    }

    function salvarCarrinho(carrinho) {
      const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
      if (!clienteLogado) return; 
      
      const todosCarrinhos = obterTodosCarrinhos();
      todosCarrinhos[clienteLogado.id] = carrinho;
      localStorage.setItem('carrinhosPorUsuario', JSON.stringify(todosCarrinhos));
    }


    function limparTodosCarrinhos() {
      localStorage.removeItem('carrinhosPorUsuario');
    }

    // Função para carregar os produtos
    let todosProdutos = [];
    let categoriasUnicas = [];

    async function carregarProdutos() {
        try {
            const response = await fetch('/api/livros');
            if (!response.ok) throw new Error('Falha ao carregar produtos');
            
            todosProdutos = await response.json();
            
            // Extrai categorias únicas para o filtro
            categoriasUnicas = [...new Set(todosProdutos
                .map(livro => livro.categoria)
                .filter(categoria => categoria))];
                
            preencherFiltroCategorias();
            exibirProdutos(todosProdutos);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            document.getElementById('produtos-grid').innerHTML = 
                '<p>Não foi possível carregar os produtos. Tente novamente mais tarde.</p>';
        }
    }

    function preencherFiltroCategorias() {
        const selectCategoria = document.getElementById('filtro-categoria');
        
        while (selectCategoria.options.length > 1) {
            selectCategoria.remove(1);
        }
        
        categoriasUnicas.sort();
        
        categoriasUnicas.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            selectCategoria.appendChild(option);
        });
    }

    function aplicarFiltros() {
    const filtroTitulo = document.getElementById('filtro-titulo').value.toLowerCase();
    const filtroAutor = document.getElementById('filtro-autor').value.toLowerCase();
    const filtroEditora = document.getElementById('filtro-editora').value.toLowerCase();
    const filtroIsbn = document.getElementById('filtro-isbn').value.toLowerCase();
    const filtroCategoria = document.getElementById('filtro-categoria').value;
    const filtroPreco = parseFloat(document.getElementById('filtro-preco').value);
    const filtroDisponivel = document.getElementById('filtro-disponivel').value;

    // Mostra mensagem de carregamento
    const grid = document.getElementById('produtos-grid');
    grid.innerHTML = '<p style="grid-column: 1 / -1; font-style: italic; text-align: center;">Carregando resultados...</p>';

    // Simula tempo de resposta de 2 segundos
    setTimeout(() => {
        const resultados = todosProdutos.filter(livro => {
            if (filtroTitulo && !livro.titulo.toLowerCase().includes(filtroTitulo)) return false;
            if (filtroAutor && (!livro.autor || !livro.autor.toLowerCase().includes(filtroAutor))) return false;
            if (filtroEditora && (!livro.editora || !livro.editora.toLowerCase().includes(filtroEditora))) return false;
            if (filtroIsbn && (!livro.isbn || !livro.isbn.toLowerCase().includes(filtroIsbn))) return false;
            if (filtroCategoria && livro.categoria !== filtroCategoria) return false;
            if (filtroPreco && livro.precoVenda && livro.precoVenda > filtroPreco) return false;
            if (filtroDisponivel === 'disponivel' && (!livro.estoque || livro.estoque <= 0)) return false;
            if (filtroDisponivel === 'esgotado' && (livro.estoque && livro.estoque > 0)) return false;
            return true;
        });

        exibirProdutos(resultados);
    }, 1000);
}


    function limparFiltros() {
        document.getElementById('filtro-titulo').value = '';
        document.getElementById('filtro-autor').value = '';
        document.getElementById('filtro-editora').value = '';
        document.getElementById('filtro-isbn').value = '';
        document.getElementById('filtro-categoria').value = '';
        document.getElementById('filtro-preco').value = '';
        document.getElementById('filtro-disponivel').value = '';
        
        exibirProdutos(todosProdutos);
    }

    document.querySelectorAll('.filtros-container input').forEach(input => {
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                aplicarFiltros();
            }
        });
    });

    function filtrarLivros() {
        const termoBusca = document.getElementById('search-input').value.toLowerCase();
        
        if (!termoBusca) {
            exibirProdutos(todosProdutos);
            return;
        }
        
        const resultados = todosProdutos.filter(livro => {
            // Verifica cada campo do livro pelo termo de busca
            return (
                (livro.titulo && livro.titulo.toLowerCase().includes(termoBusca)) ||
                (livro.autor && livro.autor.toLowerCase().includes(termoBusca)) ||
                (livro.editora && livro.editora.toLowerCase().includes(termoBusca)) ||
                (livro.isbn && livro.isbn.toLowerCase().includes(termoBusca)) ||
                (livro.categoria && livro.categoria.toLowerCase().includes(termoBusca)) ||
                (livro.sinopse && livro.sinopse.toLowerCase().includes(termoBusca)) ||
                (livro.codigoBarras && livro.codigoBarras.toLowerCase().includes(termoBusca))
            );
        });
        
        exibirProdutos(resultados);
    }

    function exibirProdutos(produtos) {
        const produtosGrid = document.getElementById('produtos-grid');
        
        if (!produtos || produtos.length === 0) {
            produtosGrid.innerHTML = '<p class="animate__animated animate__fadeIn">Nenhum livro encontrado com os critérios de busca.</p>';
            return;
        }
        
        produtosGrid.innerHTML = produtos.map(produto => `
            <div class="produto-card animate__animated animate__fadeIn">
                ${produto.estoque <= 0 ? '<div class="badge">ESGOTADO</div>' : ''}
                <div class="produto-imagem-container">
                    <img src="${produto.imagemUrl || 'https://via.placeholder.com/300x400?text=Sem+Imagem'}" alt="${produto.titulo}" class="produto-imagem">
                </div>
                <div class="produto-info">
                    <h3>${produto.titulo}</h3>
                    <p>${produto.autor || 'Autor desconhecido'}</p>
                    <p class="produto-preco">R$ ${produto.precoVenda?.toFixed(2) || '0,00'}</p>
                    <div class="produto-botoes">
                  <button class="btn btn-icon btn-ver" onclick="verDetalhesProduto(${produto.id})" title="Ver detalhes">
                    <i class="fas fa-eye"></i>
                  </button>                        
                    <button class="btn btn-adicionar" onclick="adicionarAoCarrinho(${produto.id})" ${!produto.ativo || produto.estoque <= 0 ? 'disabled title="Produto indisponível"' : ''}><i class="fas fa-cart-plus"></i> Adicionar</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async function verDetalhesProduto(idProduto) {
      try {
        const response = await fetch(`/api/livros/${idProduto}`);
        if (!response.ok) throw new Error('Produto não encontrado');
        
        const produto = await response.json();
        exibirModalProduto(produto);
      } catch (error) {
        console.error('Erro ao carregar detalhes do produto:', error);
        alert('Não foi possível carregar os detalhes do produto.');
      }
    }

    // Função para exibir o modal com detalhes do produto
function exibirModalProduto(produto) {
  const modal = document.getElementById('modal-produto');
  const detalhes = document.getElementById('produto-detalhes');

  const estaInativo = produto.ativo === false;
  const motivo = produto.motivoInativacao || 'Produto desativado pelo administrador.';

  detalhes.innerHTML = `
    <div class="produto-detalhes-imagem-container">
      <img src="${produto.imagemUrl || 'https://via.placeholder.com/500x600?text=Sem+Imagem'}" alt="${produto.titulo}" class="produto-detalhes-imagem">
    </div>
    <div class="produto-detalhes-info">
      <h2>${produto.titulo}</h2>
      <p><strong>Autor:</strong> ${produto.autor || 'Desconhecido'}</p>
      <p><strong>Editora:</strong> ${produto.editora || 'Não informado'}</p>
      <p><strong>ISBN:</strong> ${produto.isbn || 'Não informado'}</p>
      <p><strong>Descrição:</strong> ${produto.sinopse || 'Sem descrição disponível.'}</p>

      ${estaInativo ? `
        <div class="alerta-inativo">
          <strong>Produto indisponível:</strong> ${motivo}
        </div>
      ` : `
        <div class="estoque-info">
          ${produto.estoque > 0 
            ? `Disponível: ${produto.estoque} unidade(s)` 
            : 'Produto esgotado'}
        </div>
        <p class="produto-detalhes-preco">R$ ${produto.precoVenda?.toFixed(2) || '0,00'}</p>

        <div class="quantidade-controle">
          <button onclick="alterarQuantidade(${produto.id}, -1)">-</button>
          <input type="number" id="quantidade-${produto.id}" value="1" min="1" max="${produto.estoque}" onchange="validarQuantidade(${produto.id}, ${produto.estoque})">
          <button onclick="alterarQuantidade(${produto.id}, 1)">+</button>
        </div>

<button class="btn btn-adicionar btn-lg" onclick="adicionarAoCarrinho(${produto.id}, true)" ${produto.estoque <= 0 ? 'disabled' : ''}>
  <i class="fas fa-cart-plus"></i> Adicionar ao Carrinho
</button>
      `}
    </div>
  `;

  showModal('modal-produto');
}

    function fecharModalProduto() {
      hideModal('modal-produto');
    }

    // Função para alterar a quantidade no modal
    function alterarQuantidade(idProduto, delta) {
      const input = document.getElementById(`quantidade-${idProduto}`);
      let novaQuantidade = parseInt(input.value) + delta;
      
      if (novaQuantidade < 1) novaQuantidade = 1;
      if (novaQuantidade > parseInt(input.max)) novaQuantidade = parseInt(input.max);
      
      input.value = novaQuantidade;
    }

    // Função para validar a quantidade digitada
    function validarQuantidade(idProduto, estoqueMaximo) {
      const input = document.getElementById(`quantidade-${idProduto}`);
      let quantidade = parseInt(input.value);
      
      if (isNaN(quantidade) || quantidade < 1) {
        input.value = 1;
      } else if (quantidade > estoqueMaximo) {
        input.value = estoqueMaximo;
      }
    }

function adicionarAoCarrinho(idProduto, fromModal = false) {
  const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
  
  if (!clienteLogado) {
    const desejaLogin = confirm('Você precisa estar logado para adicionar itens ao carrinho. Deseja fazer login agora?');
    if (desejaLogin) {
      openModalLogin();
    }
    return;
  }

  // Busca o produto na lista para verificar o estoque
  const produto = todosProdutos.find(p => p.id === idProduto);
  if (!produto) {
    alert('Produto não encontrado!');
    return;
  }

  const quantidade = fromModal 
    ? parseInt(document.getElementById(`quantidade-${idProduto}`).value)
    : 1;
    
  let carrinho = obterCarrinho();
  const itemExistente = carrinho.find(item => item.id === idProduto);

  // Verifica se já atingiu o estoque máximo
  const quantidadeTotalNoCarrinho = itemExistente ? itemExistente.quantidade + quantidade : quantidade;
  
  if (quantidadeTotalNoCarrinho > produto.estoque) {
    const disponivel = produto.estoque - (itemExistente ? itemExistente.quantidade : 0);
    
    if (disponivel <= 0) {
      alert(`❌ Este produto já está no carrinho com a quantidade máxima disponível (${produto.estoque} unidades).`);
    } else {
      alert(`⚠️ Você já tem ${itemExistente ? itemExistente.quantidade : 0} unidades no carrinho.\nSó é possível adicionar mais ${disponivel} unidade(s).`);
    }
    return;
  }

  // Atualiza ou adiciona o item
  if (itemExistente) {
    itemExistente.quantidade += quantidade;
  } else {
    carrinho.push({
      id: idProduto,
      quantidade: quantidade,
      adicionadoEm: new Date().toISOString()
    });
  }

  salvarCarrinho(carrinho);
  exibirModalSucessoCarrinho(); 

  if (fromModal) fecharModalProduto();
  atualizarContadorCarrinho();
}

function exibirModalSucessoCarrinho() {
  const modal = document.getElementById('modal-sucesso-carrinho');
  if (modal) {
    showModal('modal-sucesso-carrinho');
    // Fecha automaticamente após 2 segundos
    setTimeout(() => {
      hideModal('modal-sucesso-carrinho');
    }, 3000);
  }
}

    function atualizarContadorCarrinho() {
      const carrinho = obterCarrinho();
      const total = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
      const contador = document.getElementById('cart-count');
      if (contador) contador.textContent = total;
    }

    /* Seção de Cupons */
    // Função para gerar um cupom
    function gerarCupom(cupomId, desconto, valorMinimo, tipo = 'percent') {
        // Verifica se o usuário está logado
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
        if (!clienteLogado) {
            alert('Você precisa estar logado para pegar um cupom!');
            openModalLogin();
            return;
        }

        // Gera um código de cupom aleatório
        const codigoCupom = 'CUPOM' + Math.random().toString(36).substr(2, 8).toUpperCase();
        
        // Cria o objeto do cupom
        const cupom = {
            id: Date.now(), 
            codigo: codigoCupom,
            desconto: desconto,
            valorMinimo: valorMinimo,
            tipo: tipo,
            dataGeracao: new Date().toISOString(),
            dataExpiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), 
            usado: false
        };

        console.log('Novo cupom gerado:', cupom); 
        
        armazenarCupom(clienteLogado.id, cupom);

        // Atualiza a UI para mostrar o código do cupom
        document.getElementById(`cupom-${cupomId}-codigo`).textContent = codigoCupom;
        
        // Desabilita o botão
        const botao = document.querySelector(`.btn-pegar-cupom[onclick="gerarCupom(${cupomId}, ${desconto}, ${valorMinimo}${tipo === 'fixed' ? ", 'fixed'" : ''})"]`);
        botao.disabled = true;
        botao.textContent = 'Cupom Gerado!';
        
        alert(`Cupom gerado com sucesso! Código: ${codigoCupom}`);
    }

    function armazenarCupom(userId, cupom) {
        let cuponsPorUsuario = JSON.parse(localStorage.getItem('cuponsPorUsuario')) || {};
        
        if (!cuponsPorUsuario[userId]) {
            cuponsPorUsuario[userId] = [];
        }
        
        // Verifica se o usuário já tem este cupom
        const cupomExistente = cuponsPorUsuario[userId].find(c => c.id === cupom.id);
        
        if (!cupomExistente) {
            cuponsPorUsuario[userId].push(cupom);
            localStorage.setItem('cuponsPorUsuario', JSON.stringify(cuponsPorUsuario));
        }
    }

    // Função para verificar cupons ao carregar a página
    function verificarCuponsUsuario() {
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
        if (!clienteLogado) return;

        const cuponsPorUsuario = JSON.parse(localStorage.getItem('cuponsPorUsuario')) || {};
        const cuponsUsuario = cuponsPorUsuario[clienteLogado.id] || [];

        cuponsUsuario.forEach(cupom => {
            const elementoCodigo = document.getElementById(`cupom-${cupom.id}-codigo`);
            if (elementoCodigo) {
                elementoCodigo.textContent = cupom.codigo;
                
                const botao = document.querySelector(`.btn-pegar-cupom[onclick="gerarCupom(${cupom.id}, ${cupom.desconto}, ${cupom.valorMinimo}${cupom.tipo === 'fixed' ? ", 'fixed'" : ''})"]`);
                if (botao) {
                    botao.disabled = true;
                    botao.textContent = 'Cupom Gerado!';
                }
            }
        });
    }

    // Função para validar um cupom no checkout
    function validarCupom(codigoCupom, valorTotal) {
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
        if (!clienteLogado) return { valido: false, mensagem: 'Usuário não logado' };

        const cuponsPorUsuario = JSON.parse(localStorage.getItem('cuponsPorUsuario')) || {};
        const cuponsUsuario = cuponsPorUsuario[clienteLogado.id] || [];

        const cupom = cuponsUsuario.find(c => c.codigo === codigoCupom && !c.usado);
        
        if (!cupom) {
            return { valido: false, mensagem: 'Cupom inválido ou já utilizado' };
        }

        // Verifica se o cupom expirou
        if (new Date(cupom.dataExpiracao) < new Date()) {
            return { valido: false, mensagem: 'Cupom expirado' };
        }

        // Verifica o valor mínimo
        if (valorTotal < cupom.valorMinimo) {
            return { 
                valido: false, 
                mensagem: `Valor mínimo não atingido (mínimo R$ ${cupom.valorMinimo.toFixed(2)})` 
            };
        }

        // Calcula o desconto
        let valorDesconto = 0;
        if (cupom.tipo === 'percent') {
            valorDesconto = valorTotal * (cupom.desconto / 100);
        } else {
            valorDesconto = cupom.desconto;
        }

        return {
            valido: true,
            cupom: cupom,
            valorDesconto: valorDesconto,
            valorFinal: valorTotal - valorDesconto
        };
    }

    // Função para marcar um cupom como usado
    function marcarCupomComoUsado(userId, codigoCupom) {
        const cuponsPorUsuario = JSON.parse(localStorage.getItem('cuponsPorUsuario')) || {};
        
        if (cuponsPorUsuario[userId]) {
            const cupom = cuponsPorUsuario[userId].find(c => c.codigo === codigoCupom);
            if (cupom) {
                cupom.usado = true;
                localStorage.setItem('cuponsPorUsuario', JSON.stringify(cuponsPorUsuario));
            }
        }
    }

    // Inicializações quando a página carrega
    window.addEventListener('DOMContentLoaded', () => {
        carregarProdutos();
        verificarCuponsUsuario();
        
        const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));
        atualizarUI(clienteLogado);
        atualizarContadorCarrinho();
    });

    document.addEventListener('DOMContentLoaded', () => {
  const usuarioJSON = localStorage.getItem('clienteLogado');
  const nomeCliente = document.getElementById('nome-cliente');

  if (usuarioJSON && nomeCliente) {
    const usuario = JSON.parse(usuarioJSON);
    nomeCliente.textContent = usuario.nome;
  } else if (nomeCliente) {
    nomeCliente.textContent = 'Visitante';
  }
});
 const notificacaoIcon = document.getElementById('notificacao-icon');
  if (notificacaoIcon) {
    notificacaoIcon.addEventListener('click', exibirNotificacoes);
  }

  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notificacao-dropdown');
    const icon = document.getElementById('notificacao-icon');
    
    if (dropdown && !dropdown.contains(e.target) && !icon.contains(e.target)) {
      dropdown.classList.remove('show');
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
      list.innerHTML = '<p style="padding:10px;">Nenhuma notificação.</p>';
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

window.addEventListener('DOMContentLoaded', async () => {
  try {
    // Recupera o cliente do localStorage
    const clienteLocal = JSON.parse(localStorage.getItem('clienteLogado'));
    if (!clienteLocal || !clienteLocal.id) {
      console.warn('Cliente não encontrado no localStorage.');
      return;
    }

    // Busca os dados atualizados do cliente no backend
    const response = await fetch(`window.location.origin/clientes/${clienteLocal.id}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar dados atualizados do cliente');
    }

    const clienteAtualizado = await response.json();
    console.log('Cliente do banco:', clienteAtualizado);

    const tipo = clienteAtualizado.tipo || clienteAtualizado.perfil;

    const linkLog = document.getElementById('link-log');
    if (tipo !== 'ADMIN') {
      if (linkLog) linkLog.style.display = 'none';
    } else {
      if (linkLog) linkLog.style.display = 'inline-block';
    }

    atualizarUI(clienteAtualizado);

  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
  }
});

function esconderLinksRestritos() {
  const clienteLogado = JSON.parse(localStorage.getItem('clienteLogado'));

  const idsRestritos = [
    'link-usuarios',
    'link-log',
    'link-grafico',
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

  //SESSÃO CHATBOT
const apiKey = "AIzaSyAiHf5ACvaEZzwJAe7OeieT_EtxtnjUPUE"; 
let clienteId = null;
let historicoCompras = [];
let conversa = [];
let selectedModel = '';
let availableModels = [];
let aguardandoConfirmacao = false;

const freeModelsPriority = [
    'models/gemma-3-1b-it',
    'models/gemma-3-4b-it',
    'models/gemma-3-12b-it',
    'models/gemini-2.0-flash-lite',
    'models/gemini-2.0-flash-lite-001',
    'models/gemini-flash-lite-latest'
];

function toggleChatbotPopup() {
  const popup = document.getElementById('chatbot-popup');
  popup.classList.toggle('active');
  
  if (popup.classList.contains('active')) {
    initializeChatbot();
  }
}

function closeChatbotPopup() {
  document.getElementById('chatbot-popup').classList.remove('active');
}

function openChatbotPopup() {
  document.getElementById('chatbot-popup').classList.add('active');
  initializeChatbot();
}

function getClienteIdLocal() {
  const cliente = JSON.parse(localStorage.getItem('clienteLogado'));
  return cliente?.id || null;
}

async function initializeChatbot() {
  if (document.getElementById('chatbot-messages').children.length === 0) {
    clienteId = getClienteIdLocal();

    if (!clienteId || isNaN(clienteId)) {
      chatbotAdicionarMensagem("bot", "⚠️ Não foi possível identificar o cliente logado. Usando modo demonstração.");
      clienteId = 0;
      historicoCompras = [
        {
          titulo: "Dom Casmurro",
          autor: "Machado de Assis",
          categoria: "Clássicos",
          quantidade: 1,
          dataCompra: "2023-10-15",
          status: "ENTREGUE"
        }
      ];
    } else {
      await carregarHistorico(clienteId);
    }

    await initializeModelSelector();

    setTimeout(() => {
      if (clienteId <= 0) {
        chatbotAdicionarMensagem("bot", "Modo demonstração ativado com dados de exemplo.");
      }

      const mensagemHistorico = formatarMensagemHistorico(historicoCompras);
      chatbotAdicionarMensagem("bot", mensagemHistorico);

      if (historicoCompras.length > 0) {
        const resumoHistorico = historicoCompras.map(item => item.titulo).join(", ");
        const promptAnalise = `
          Baseado NO HISTÓRICO DE COMPRAS do cliente, faça:

          1. PRIMEIRO: Um resumo breve do perfil de leitura
          2. SEGUNDO: Apenas UMA pergunta confirmando se quer recomendações

          HISTÓRICO DO CLIENTE:
          ${resumoHistorico}

          RESPONDA APENAS COM ESTE FORMATO:

          📊 **SEU PERFIL DE LEITURA:**
          [Resumo breve baseado nos livros reais do histórico]

          ❓ Com base nisso, quer que eu recomende livros para você?
          `;

        setTimeout(async () => {
          chatbotShowTypingIndicator();
          const resposta = await chamarGemini(promptAnalise);
          chatbotHideTypingIndicator();
          chatbotAdicionarMensagem("bot", resposta);
          conversa.push({ role: "bot", content: resposta });
          aguardandoConfirmacao = true;
        }, 1000);
      } else {
        chatbotAdicionarMensagem("bot", "Posso te ajudar a encontrar algum livro interessante?");
      }
    }, 500);
  }
}

async function initializeModelSelector() {
  try {
    await listAvailableModels();
    
    if (!document.getElementById('chatbot-model-selector')) {
      createModelSelector();
    }
    
  } catch (error) {
    selectedModel = 'models/gemma-3-1b-it';
  }
}

function populateModelSelector() {
  const modelSelect = document.getElementById('chatbot-model-select');
  if (!modelSelect || availableModels.length === 0) return;
  
  modelSelect.innerHTML = '';
  
  const freeModelsGroup = document.createElement('optgroup');
  freeModelsGroup.label = 'Modelos Gratuitos (Recomendados)';
  
  freeModelsPriority.forEach(modelName => {
    const model = availableModels.find(m => m.name === modelName);
    if (model) {
      const option = document.createElement('option');
      option.value = modelName;
      option.textContent = `${model.displayName || modelName} (Gratuito)`;
      freeModelsGroup.appendChild(option);
    }
  });
  
  modelSelect.appendChild(freeModelsGroup);
  
  const otherModelsGroup = document.createElement('optgroup');
  otherModelsGroup.label = 'Outros Modelos (Pode exigir quota)';
  
  availableModels.forEach(model => {
    if (!freeModelsPriority.includes(model.name)) {
      const option = document.createElement('option');
      option.value = model.name;
      option.textContent = model.displayName || model.name;
      otherModelsGroup.appendChild(option);
    }
  });
  
  modelSelect.appendChild(otherModelsGroup);
  
  const firstFreeModel = freeModelsPriority.find(modelName => 
    availableModels.find(m => m.name === modelName)
  );
  
  if (firstFreeModel) {
    modelSelect.value = firstFreeModel;
    selectedModel = firstFreeModel;
  }
}

async function listAvailableModels() {
  try {
    const LIST_MODELS_URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await fetch(LIST_MODELS_URL);
    
    if (!response.ok) {
      throw new Error(`Erro ao listar modelos: ${response.status}`);
    }
    
    const data = await response.json();
    availableModels = data.models || [];
    
    availableModels = availableModels.filter(model => 
      model.supportedGenerationMethods && 
      model.supportedGenerationMethods.includes('generateContent')
    );
    
  } catch (error) {
    await tryFallbackModels();
  }
}

async function tryFallbackModels() {
  const fallbackModels = [
    'models/gemma-3-1b-it',
    'models/gemma-3-4b-it',
    'models/gemini-2.0-flash-lite',
    'models/gemini-flash-lite-latest'
  ];
  
  availableModels = fallbackModels.map(modelName => ({
    name: modelName,
    displayName: modelName.replace('models/', ''),
    supportedGenerationMethods: ['generateContent']
  }));
  
  selectedModel = fallbackModels[0];
}

function changeModel(newModel) {
  selectedModel = newModel;
}

async function getClienteId() {
  try {
    const response = await fetch('/api/usuario/logado');
    if (!response.ok) throw new Error('Não logado');
    const usuario = await response.json();
    return usuario.id;
  } catch (error) {
    return null;
  }
}

document.getElementById('chatbot-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    chatbotEnviar();
  }
});

async function chatbotEnviar() {
  const input = document.getElementById("chatbot-input");
  const mensagem = input.value.trim();
  if (!mensagem) return;

  chatbotAdicionarMensagem("user", mensagem);
  input.value = "";

  chatbotShowTypingIndicator();

  conversa.push({ role: "user", content: mensagem });

if (
  aguardandoConfirmacao &&
  (
    mensagem.toLowerCase().includes('sim') ||
    mensagem.toLowerCase().includes('quero') ||
    mensagem.toLowerCase().includes('recomenda') ||
    mensagem.toLowerCase().includes('indica') ||
    mensagem.toLowerCase().includes('sugere') ||
    mensagem.toLowerCase().includes('livro') ||
    mensagem.toLowerCase().includes('fale mais') ||
    mensagem.toLowerCase().includes('resumo') ||
    mensagem.toLowerCase().includes('explique')
  )
) {

    aguardandoConfirmacao = false;
    
    const resumoHistorico = historicoCompras.length > 0
      ? historicoCompras.map(item => item.titulo).join(", ")
      : "sem histórico";

    const promptRecomendacoes = `
Baseado NO HISTÓRICO DE COMPRAS do cliente, recomende LIVROS REAIS e EXISTENTES.

HISTÓRICO DO CLIENTE:
${resumoHistorico}

REGRA: NÃO INVENTE LIVROS. Use apenas livros reais.
SEMPRE Q A PERGUNTA NÃO FOR SOBRE RECOMENDAÇÕES DE LIVROS, RESPONDER COM "Não possuo essa informação"

RECOMENDE DIRETAMENTE 3-5 LIVROS REAIS baseados no perfil do cliente.



Formato da resposta:
📚 RECOMENDAÇÕES BASEADAS NO SEU HISTÓRICO:

1. **Título Real** - Autor Real
   *Breve motivo baseado no seu histórico*

2. **Título Real** - Autor Real  
   *Breve motivo baseado no seu histórico*
`;

    const resposta = await chamarGemini(promptRecomendacoes);
    chatbotHideTypingIndicator();
    chatbotAdicionarMensagem("bot", resposta);
    conversa.push({ role: "bot", content: resposta });
    
  } else {
    const resumoHistorico = historicoCompras.length > 0
      ? historicoCompras.map(item => item.titulo).join(", ")
      : "sem histórico";

    const ultimasMensagens = conversa.slice(-4);

    let textoConversa = "";
    ultimasMensagens.forEach(msg => {
      const prefixo = msg.role === "user" ? "Usuário:" : "Assistente:";
      textoConversa += `${prefixo} ${msg.content}\n`;
    });

const promptComHistorico = `
Você é um assistente especializado APENAS em livros.  
Seu comportamento deve seguir estritamente as regras abaixo:


REGRAS DE CONTEXTO:

- Se o usuário fizer uma pergunta curta ou incompleta, como:
  "em que ano foi lançado?"
  "quem escreveu?"
  "qual é o gênero?"
  "é bom?"
  
  E essa pergunta vier LOGO APÓS mencionar um livro,
  você deve assumir automaticamente que a pergunta está se referindo ao ÚLTIMO LIVRO citado pelo usuário.

- Portanto, perguntas curtas que claramente se referem ao livro anterior DEVEM ser respondidas normalmente.


REGRAS IMPORTANTES:

- Se o usuário pedir para FALAR SOBRE UM LIVRO, RESUMIR UM LIVRO, ANALISAR UM LIVRO ou PEDIR INFORMAÇÕES SOBRE UMA OBRA ESPECÍFICA, você deve responder DIRETAMENTE sobre essa obra.
  NUNCA ofereça recomendações adicionais, a menos que o usuário peça isso explicitamente.

Exemplos:
Usuário: "me fale mais sobre o livro 1984"
→ Responda apenas falando sobre 1984. Não ofereça recomendações.

Usuário: "resuma o livro tal"
→ Responda apenas com o resumo.


REGRA PRINCIPAL (sempre obedecer):

1. Você DEVE responder normalmente quando a mensagem do usuário estiver relacionada a LIVROS.
   Isso inclui, obrigatoriamente:
   - resumos de livros
   - explicações de livros
   - análises de livros
   - curiosidades sobre livros
   - pedidos para "falar mais sobre" um livro
   - perguntas sobre autores
   - perguntas sobre personagens
   - perguntas sobre enredos
   - pedidos de interpretação
   - recomendações de livros
   - conversas relacionadas a obras citadas anteriormente

2. PARA QUALQUER mensagem que NÃO esteja relacionada a livros,
você deve responder EXATAMENTE assim:
"Não possuo essa informação"

3. Exemplos de perguntas PERMITIDAS (responda normalmente):
   - "me recomende livros"
   - "resuma O Senhor dos Anéis"
   - "me fale mais sobre o livro O Conto do Ícaro"
   - "quem é o autor de tal obra?"
   - "explique o final de tal livro"

4. Exemplos de perguntas PROIBIDAS (responda apenas com “Não possuo essa informação”):
   - perguntas sobre café, comida, clima, esportes, tecnologia, finanças, saúde etc.

Histórico de compras: ${resumoHistorico}

Conversa recente:
${textoConversa}

Sempre siga as regras acima.

`;


    const resposta = await chamarGemini(promptComHistorico);
    chatbotHideTypingIndicator();
    chatbotAdicionarMensagem("bot", resposta);
    conversa.push({ role: "bot", content: resposta });
    aguardandoConfirmacao = false;
  }
}

function chatbotShowTypingIndicator() {
  const mensagens = document.getElementById("chatbot-messages");
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing-indicator";
  typingDiv.id = "chatbotTypingIndicator";
  typingDiv.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  mensagens.appendChild(typingDiv);
  chatbotScrollToBottom();
}

function chatbotHideTypingIndicator() {
  const typingIndicator = document.getElementById("chatbotTypingIndicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function chatbotAdicionarMensagem(origem, texto) {
  const mensagens = document.getElementById("chatbot-messages");
  const div = document.createElement("div");
  div.className = "chatbot-message chatbot-" + origem;
  
  const textoFormatado = formatarTextoMensagem(texto);
  div.innerHTML = textoFormatado;
  
  mensagens.appendChild(div);
  chatbotScrollToBottom();
}

function formatarTextoMensagem(texto) {
  let textoFormatado = texto.replace(/\n/g, '<br>');
  
  textoFormatado = textoFormatado.replace(/📊\s*\*\*SEU PERFIL DE LEITURA:\*\*/g, '<div class="chatbot-titulo">📊 <strong>SEU PERFIL DE LEITURA:</strong></div>');
  textoFormatado = textoFormatado.replace(/📚\s*RECOMENDAÇÕES BASEADAS NO SEU HISTÓRICO:/g, '<div class="chatbot-titulo">📚 <strong>RECOMENDAÇÕES BASEADAS NO SEU HISTÓRICO:</strong></div>');
  
  textoFormatado = textoFormatado.replace(/(\d+)\.\s+\*\*(.*?)\*\*\s*-\s*(.*?)(?=<br>|$)/g, '<div class="chatbot-livro-item"><span class="chatbot-numero">$1.</span> <strong>$2</strong> - <em>$3</em></div>');
  
  textoFormatado = textoFormatado.replace(/\*\s*(.*?)(?=<br>|$)/g, '<div class="chatbot-explicacao">💡 $1</div>');
  
  textoFormatado = textoFormatado.replace(/❓\s*(.*?)(?=<br>|$)/g, '<div class="chatbot-pergunta">❓ $1</div>');
  
  return textoFormatado;
}

function chatbotScrollToBottom() {
  const mensagens = document.getElementById("chatbot-messages");
  mensagens.scrollTop = mensagens.scrollHeight;
}

async function chamarGemini(prompt) {
  if (!selectedModel) {
    selectedModel = 'models/gemma-3-1b-it';
  }
  
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      if (response.status === 429 || errorData.error?.message?.includes('quota')) {
        throw new Error(`QUOTA_EXCEDIDA: ${errorData.error.message}. Tente trocar para um modelo gratuito.`);
      }
      
      throw new Error(`API_ERROR: ${response.status} - ${errorData.error?.message || 'Erro desconhecido'}`);
    }

    const data = await response.json();

    if (data.candidates?.[0]?.content?.parts) {
      return data.candidates[0].content.parts
        .map(p => p.text)
        .join(" ");
    }

    if (Array.isArray(data.candidates?.[0]?.content)) {
      return data.candidates[0].content
        .map(p => p.text || "")
        .join(" ");
    }

    if (data.candidates?.[0]?.outputText) {
      return data.candidates[0].outputText;
    }

    return "Nenhuma resposta encontrada.";
  } catch (e) {
    if (e.message.includes('QUOTA_EXCEDIDA')) {
      return `❌ Quota excedida para este modelo!\n\n💡 Troque para um modelo gratuito no seletor acima.`;
    }
    
    return "Erro ao conectar com a IA. Por favor, tente novamente.";
  }
}

async function carregarHistorico(clienteId) {
  try {
    const response = await fetch(`${window.location.origin}/api/pedidos/historico/${clienteId}`);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Resposta inválida - não é um array");
    }

    historicoCompras = data;
    return data;
    
  } catch (error) {
    historicoCompras = [];
    return [];
  }
}

function formatarMensagemHistorico(historico) {
  if (!Array.isArray(historico) || historico.length === 0) {
    return "📭 Nenhuma compra encontrada no seu histórico.";
  }

  let mensagem = `<div class="chatbot-historico-titulo">✨ Histórico de Compras ✨</div>`;
  mensagem += `<div class="chatbot-divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>`;

  historico.forEach((item, index) => {
    const dataFormatada = new Date(item.dataCompra).toLocaleDateString();
    const statusTexto = item.status === "EM_TRANSITO"
      ? `🚛 <span class="chatbot-status-transito">Em transporte (chega em breve!)</span>`
      : `📬 <span class="chatbot-status-entregue">Entregue em ${dataFormatada}</span>`;

    mensagem += `
      <div class="chatbot-livro-historico">
        <div class="chatbot-livro-titulo">📌 ${index + 1}. ${item.titulo}</div>
        <div class="chatbot-livro-detalhes">
          ✍️ Autor: <strong>${item.autor}</strong><br>
          🔢 Quantidade: <strong>${item.quantidade}</strong><br>
          ${statusTexto}
        </div>
      </div>
    `;
    
    if (index < historico.length - 1) {
      mensagem += `<div class="chatbot-livro-separador"></div>`;
    }
  });

  mensagem += `
    <div class="chatbot-divider">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
    <div class="chatbot-ajuda">💡 Analisando seu perfil de leitura...</div>
  `;

  return mensagem;
}
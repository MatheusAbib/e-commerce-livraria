//    async function carregarClientes(filtros = {}) {
//   const params = new URLSearchParams();

//   if (filtros.nome) params.append('nome', filtros.nome);
//   if (filtros.cpf) params.append('cpf', filtros.cpf);

//   const url = '/api/clientes/consulta?' + params.toString();
//   const response = await fetch(url);
//   const clientes = await response.json();

//   const tbody = document.getElementById('clientes-tbody');
//   tbody.innerHTML = '';

//   clientes.forEach(cliente => {
//     const tr = document.createElement('tr');
//     const status = cliente.ativo ? 'Ativo' : 'Inativo';
//     const btnAcao = cliente.ativo
//       ? `<button onclick="abrirModalConfirmacao(${cliente.id}, 'inativar')">Inativar</button>`
//       : `<button onclick="abrirModalConfirmacao(${cliente.id}, 'ativar')">Ativar</button>`;

// tr.innerHTML = `
//   <td>${cliente.id}</td>
//   <td>${cliente.nome}</td>
//   <td>${cliente.email}</td>
//   <td>${cliente.telefone ?? '-'}</td>
//   <td>${cliente.cpf ?? '-'}</td>
//   <td>${status}</td>
//   <td>
//     <button onclick="verCliente(${cliente.id}, event)">Ver</button>
//     <button onclick="editarCliente(${cliente.id})">Editar</button>
//   <button onclick="abrirModalSenha(${cliente.id})">Alterar Senha</button>
//   <button onclick="confirmarExclusaoCliente(${cliente.id})">Excluir</button>
//   ${btnAcao}
// </td>

//     `;
//     tbody.appendChild(tr);
//   });
// }

// document.getElementById('form-cliente').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const id = document.getElementById('cliente-id').value;
//   const senha = document.getElementById('senha').value;
//   const confirmarSenha = document.getElementById('confirmar-senha-cadastro').value;

//   // Validação de senha (apenas para novos cadastros)
//   if (!id && senha !== confirmarSenha) {
//     alert('As senhas não conferem.');
//     return;
//   }

//   // Validação de campos obrigatórios
//   const camposObrigatorios = [
//     'nome', 'email',
//     'cobranca-cep', 'cobranca-rua', 'cobranca-numero', 'cobranca-bairro', 'cobranca-cidade', 'cobranca-estado',
//     'entrega-cep', 'entrega-rua', 'entrega-numero', 'entrega-bairro', 'entrega-cidade', 'entrega-estado',
//     'cobranca-tipo-residencia', 'cobranca-tipo-logradouro', 'cobranca-logradouro',
//     'entrega-tipo-residencia', 'entrega-tipo-logradouro', 'entrega-logradouro'

//   ];

//   if (!id) {
//     camposObrigatorios.push('senha', 'confirmar-senha-cadastro');
//   }

//   for (const campoId of camposObrigatorios) {
//     const campo = document.getElementById(campoId);
//     if (!campo.value.trim()) {
//       alert(`O campo ${campo.previousElementSibling.innerText} é obrigatório`);
//       campo.focus();
//       return;
//     }
//   }

//   // Monta o objeto cliente
// const cliente = {
//   nome: document.getElementById('nome').value,
//   email: document.getElementById('email').value,
//   telefone: document.getElementById('telefone').value,
//   tipotelefone: document.getElementById('tipotelefone').value,
//   cpf: document.getElementById('cpf').value,
//   nascimento: document.getElementById('nascimento')?.value || null,
//   genero: document.getElementById('genero')?.value || null,
//   residencial: document.getElementById('residencial').value,
//   ativo: true
// };


//   if (!id && senha) {
//     cliente.senha = senha;
//   }

//   // Endereço de cobrança
// // Modifique a função que monta o objeto endereço para garantir que todos os campos estão sendo enviados
// const enderecoCobranca = {
//   cep: document.getElementById('cobranca-cep').value,
//   rua: document.getElementById('cobranca-rua').value,
//   numero: document.getElementById('cobranca-numero').value,
//   complemento: document.getElementById('cobranca-complemento').value || null, // Envia null se vazio
//   bairro: document.getElementById('cobranca-bairro').value,
//   cidade: document.getElementById('cobranca-cidade').value,
//   estado: document.getElementById('cobranca-estado').value,
//   pais: document.getElementById('cobranca-pais').value,
//   tipoResidencia: document.getElementById('cobranca-tipo-residencia').value,
//   tipoLogradouro: document.getElementById('cobranca-tipo-logradouro').value,
//   logradouro: document.getElementById('cobranca-logradouro').value,
//   tipo: 'COBRANCA'
// };

// // Adicione um log mais detalhado para verificar os dados antes do envio
// console.log('Endereço de Cobrança a ser enviado:', JSON.stringify(enderecoCobranca, null, 2));


//   // Coleta TODOS os endereços de entrega (primeiro e adicionais)
//   const enderecosEntrega = coletarEnderecosEntrega();

//   // Endereços de entrega
// function coletarEnderecosEntrega() {
//   const enderecosEntrega = [];
//   const enderecosElements = document.querySelectorAll('.endereco-entrega');

//   enderecosElements.forEach((enderecoDiv, index) => {
//     const nomeEndereco = enderecoDiv.querySelector('.nome-endereco')?.value || `Endereço #${index + 1}`;
    
//     // Para o primeiro endereço (que tem IDs), usamos getElementById
//     if (index === 0) {
//       enderecosEntrega.push({
//         nomeEndereco: nomeEndereco,
//         cep: document.getElementById('entrega-cep').value,
//         rua: document.getElementById('entrega-rua').value,
//         numero: document.getElementById('entrega-numero').value,
//         complemento: document.getElementById('entrega-complemento').value,
//         bairro: document.getElementById('entrega-bairro').value,
//         cidade: document.getElementById('entrega-cidade').value,
//         estado: document.getElementById('entrega-estado').value,
//         pais: document.getElementById('entrega-pais').value,  // novo
//         tipoResidencia: document.getElementById('entrega-tipo-residencia').value,
//         tipoLogradouro: document.getElementById('entrega-tipo-logradouro').value,
//         logradouro: document.getElementById('entrega-logradouro').value,

//         tipo: 'ENTREGA'
//       });
//     } else {
//       // Para endereços adicionais, usamos querySelector no div específico
//      enderecosEntrega.push({
//         nomeEndereco: nomeEndereco,
//         cep: enderecoDiv.querySelector('[name="entrega-cep"]').value,
//       rua: enderecoDiv.querySelector('[name="entrega-rua"]').value,
//       numero: enderecoDiv.querySelector('[name="entrega-numero"]').value,
//       complemento: enderecoDiv.querySelector('[name="entrega-complemento"]').value,
//       bairro: enderecoDiv.querySelector('[name="entrega-bairro"]').value,
//       cidade: enderecoDiv.querySelector('[name="entrega-cidade"]').value,
//       estado: enderecoDiv.querySelector('[name="entrega-estado"]').value,
//       pais: enderecoDiv.querySelector('[name="entrega-pais"]').value,
//       tipoResidencia: enderecoDiv.querySelector('[name="entrega-tipo-residencia"]').value,
//       tipoLogradouro: enderecoDiv.querySelector('[name="entrega-tipo-logradouro"]').value,
//       logradouro: enderecoDiv.querySelector('[name="entrega-logradouro"]').value,
//       tipo: 'ENTREGA'
//     });
//     }
//   });

//   return enderecosEntrega;
// }

//   cliente.enderecos = [enderecoCobranca, ...enderecosEntrega];

//   // Debug: verifique os dados antes de enviar
//   console.log('Dados a serem enviados:', cliente);

//   const url = id ? `/api/clientes/${id}` : '/api/clientes';
//   const method = id ? 'PUT' : 'POST';

//   try {
//     const response = await fetch(url, {
//       method,
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify(cliente)
//     });

//     if (response.ok) {
//       alert('Cliente e endereços salvos com sucesso!');
//       document.getElementById('form-cliente').reset();
//       document.getElementById('cliente-id').value = '';
//       mostrarCamposSenha();
//       carregarClientes();
//     } else {
//       const error = await response.json();
//       alert(`Erro: ${error.message || error || 'Falha ao salvar cliente e endereços'}`);
//     }
//   } catch (error) {
//     console.error('Erro:', error);
//     alert('Erro ao conectar com o servidor');
//   }
  
// });

// function mostrarCamposSenha() {
//   // Mostra e habilita os campos de senha
//   const senhaInput = document.getElementById('senha');
//   const confirmarSenhaInput = document.getElementById('confirmar-senha-cadastro');
//   const labelSenha = document.querySelector('label[for="senha"]');
//   const labelConfirmarSenha = document.querySelector('label[for="confirmar-senha-cadastro"]');

//   senhaInput.style.display = '';
//   confirmarSenhaInput.style.display = '';
//   labelSenha.style.display = '';
//   labelConfirmarSenha.style.display = '';

//   senhaInput.disabled = false;
//   confirmarSenhaInput.disabled = false;
// }

// async function editarCliente(id) {
//   const response = await fetch(`/api/clientes/${id}`);
//   if (!response.ok) {
//     alert('Cliente não encontrado');
//     return;
//   }

//   const cliente = await response.json();

//   // Preenche campos do cliente
//   document.getElementById('cliente-id').value = cliente.id;
//   document.getElementById('nome').value = cliente.nome;
//   document.getElementById('email').value = cliente.email;
//   document.getElementById('telefone').value = cliente.telefone || '';
//   document.getElementById('tipotelefone').value = cliente.tipotelefone || '';
//   document.getElementById('cpf').value = cliente.cpf || '';
//   document.getElementById('nascimento').value = cliente.nascimento || '';
//   document.getElementById('genero').value = cliente.genero || '';
//   document.getElementById('residencial').value = cliente.residencial || '';

//   esconderCamposSenha();
//   document.getElementById('senha').value = '';
//   document.getElementById('confirmar-senha-cadastro').value = '';

//   // Endereços
//   if (cliente.enderecos && cliente.enderecos.length > 0) {
//     const enderecosEntrega = cliente.enderecos.filter(e => e.tipo === 'ENTREGA');
//     const enderecoCobranca = cliente.enderecos.find(e => e.tipo === 'COBRANCA');

//     // Preenche cobrança
//     if (enderecoCobranca) {
//       document.getElementById('cobranca-cep').value = enderecoCobranca.cep || '';
//       document.getElementById('cobranca-rua').value = enderecoCobranca.rua || '';
//       document.getElementById('cobranca-numero').value = enderecoCobranca.numero || '';
//       document.getElementById('cobranca-complemento').value = enderecoCobranca.complemento || '';
//       document.getElementById('cobranca-bairro').value = enderecoCobranca.bairro || '';
//       document.getElementById('cobranca-cidade').value = enderecoCobranca.cidade || '';
//       document.getElementById('cobranca-estado').value = enderecoCobranca.estado || '';
//       document.getElementById('cobranca-pais').value = enderecoCobranca.pais || 'Brasil';
//       document.getElementById('cobranca-tipo-residencia').value = enderecoCobranca.tipoResidencia || '';
//       document.getElementById('cobranca-tipo-logradouro').value = enderecoCobranca.tipoLogradouro || '';
//       document.getElementById('cobranca-logradouro').value = enderecoCobranca.logradouro || '';
//     }

//     // Preenche o primeiro endereço de entrega
//     if (enderecosEntrega.length > 0) {
//       const endereco = enderecosEntrega[0];
//       document.getElementById('entrega-cep').value = endereco.cep || '';
//       document.getElementById('entrega-rua').value = endereco.rua || '';
//       document.getElementById('entrega-numero').value = endereco.numero || '';
//       document.getElementById('entrega-complemento').value = endereco.complemento || '';
//       document.getElementById('entrega-bairro').value = endereco.bairro || '';
//       document.getElementById('entrega-cidade').value = endereco.cidade || '';
//       document.getElementById('entrega-estado').value = endereco.estado || '';
//       document.getElementById('entrega-pais').value = endereco.pais || 'Brasil';
//       document.getElementById('entrega-tipo-residencia').value = endereco.tipoResidencia || '';
//       document.getElementById('entrega-tipo-logradouro').value = endereco.tipoLogradouro || '';
//       document.getElementById('entrega-logradouro').value = endereco.logradouro || '';
//     }

//     // Remove endereços adicionais
//     document.querySelectorAll('.endereco-entrega').forEach((div, i) => {
//       if (i > 0) div.remove();
//     });
//     contadorEntrega = 1;

//     // Endereços adicionais (a partir do segundo)
//     for (let i = 1; i < enderecosEntrega.length; i++) {
//       adicionarEnderecoEntrega(enderecosEntrega[i]);
//     }
//   }
// }


// function esconderCamposSenha() {
//   const senhaInput = document.getElementById('senha');
//   const confirmarSenhaInput = document.getElementById('confirmar-senha-cadastro');
//   const labelSenha = document.querySelector('label[for="senha"]');
//   const labelConfirmarSenha = document.querySelector('label[for="confirmar-senha-cadastro"]');

//   senhaInput.style.display = 'none';
//   confirmarSenhaInput.style.display = 'none';
//   labelSenha.style.display = 'none';
//   labelConfirmarSenha.style.display = 'none';

//   senhaInput.disabled = true;
//   confirmarSenhaInput.disabled = true;
// }

// // (O resto do seu código continua igual)


// function abrirModalConfirmacao(id, acao) {
//   const motivo = prompt(`Informe o motivo para ${acao} o cliente:`);
//   if (!motivo || motivo.trim() === '') {
//     alert('Motivo obrigatório.');
//     return;
//   }
//   mudarStatusCliente(id, acao === 'ativar', motivo);
// }

// async function mudarStatusCliente(id, ativo, motivo) {
//   const response = await fetch(`/api/clientes/change-status/${id}`, {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({ ativo, motivo })
//   });

//   if (response.ok) {
//     alert(`Cliente ${ativo ? 'ativado' : 'inativado'} com sucesso!`);
//     carregarClientes();
//   } else {
//     alert('Erro ao alterar status do cliente.');
//   }
// }

// let clienteAlterarSenhaId = null;

// function abrirModalSenha(id) {
//   clienteAlterarSenhaId = id;
//   document.getElementById('nova-senha').value = '';
//   document.getElementById('confirmar-senha').value = '';
//   document.getElementById('modal-senha').style.display = 'block';
// }

// function fecharModalSenha() {
//   document.getElementById('modal-senha').style.display = 'none';
// }

// async function confirmarAlterarSenha() {
//   const novaSenha = document.getElementById('nova-senha').value;
//   const confirmarSenha = document.getElementById('confirmar-senha').value;

//   if (novaSenha === '' || confirmarSenha === '') {
//     alert('Preencha os dois campos.');
//     return;
//   }
//   if (novaSenha !== confirmarSenha) {
//     alert('Senhas não conferem.');
//     return;
//   }

//   const response = await fetch(`/api/clientes/${clienteAlterarSenhaId}/change-password`, {
//     method: 'POST',
//     headers: {'Content-Type': 'application/json'},
//     body: JSON.stringify({ senha: novaSenha, confirmacaoSenha: confirmarSenha })
//   });

//   if (response.ok) {
//     alert('Senha alterada com sucesso!');
//     fecharModalSenha();
//   } else {
//     const msg = await response.text();
//     alert('Erro: ' + msg);
//   }
// }

// document.getElementById('form-filtro-clientes').addEventListener('submit', function (e) {
//   e.preventDefault();
//   const nome = document.getElementById('filtro-nome').value;
//   const cpf = document.getElementById('filtro-cpf').value;
//   carregarClientes({ nome, cpf });
// });

// function limparFiltro() {
//   document.getElementById('filtro-nome').value = '';
//   document.getElementById('filtro-cpf').value = '';
//   carregarClientes();
// }

// function confirmarExclusaoCliente(id) {
//   const confirmar = confirm("Tem certeza que deseja excluir este cliente?");
//   if (confirmar) {
//     excluirCliente(id);
//   }
// }

// async function excluirCliente(id) {
//   try {
//     const response = await fetch(`/api/clientes/${id}`, {
//       method: 'DELETE'
//     });

//     if (response.ok) {
//       alert('Cliente excluído com sucesso.');
//       carregarClientes();
//     } else {
//       const erro = await response.text();
//       alert('Erro ao excluir cliente: ' + erro);
//     }
//   } catch (error) {
//     console.error(error);
//     alert('Erro na comunicação com o servidor.');
//   }
// }

// async function verCliente(id) {
//   const modal = document.getElementById('modal-visualizar');
//   document.body.appendChild(modal);

//  const response = await fetch(`/api/clientes/${id}`);
//   if (!response.ok) {
//     alert('Erro ao carregar dados do cliente.');
//     return;
//   }

//   const cliente = await response.json();
//   const div = document.getElementById('dados-cliente');
  
//   // Limpa qualquer conteúdo anterior
//   div.innerHTML = '';

//   // Formata a data de cadastro
//   const dataCadastro = cliente.dataCadastro 
//     ? new Date(cliente.dataCadastro).toLocaleDateString('pt-BR') 
//     : '-';

//   // HTML para os dados do cliente (não editáveis)
//   let html = `
//     <div class="cliente-info" data-cliente-id="${cliente.id}">
//       <p><strong>Nome:</strong> ${cliente.nome}</p>
//       <p><strong>Email:</strong> ${cliente.email}</p>
//       <p><strong>Telefone:</strong> ${cliente.telefone || '-'}</p>
//       <p><strong>CPF:</strong> ${cliente.cpf || '-'}</p>
//       <p><strong>Status:</strong> ${cliente.ativo ? 'Ativo' : 'Inativo'}</p>
//       <p><strong>Data de Cadastro:</strong> ${dataCadastro}</p>
//     </div>
//   `;

//   // Endereço de cobrança (editável)
//   const enderecoCobranca = cliente.enderecos.find(e => e.tipo === 'COBRANCA') || {};
//   html += `
//     <div class="modal-section">
//       <div style="display: flex; justify-content: space-between; align-items: center;">
//         <h4>Endereço de Cobrança</h4>
//          <button onclick="editarEndereco(${enderecoCobranca.id || 'null'}, 'COBRANCA', event); return false;" class="btn-editar">Editar</button>
//       </div>
//       <div class="endereco-info" id="endereco-cobranca-${enderecoCobranca.id || '0'}">
//         <!-- Conteúdo será preenchido dinamicamente -->
//       </div>
//     </div>
//   `;

//   // Endereços de entrega (editáveis)
//   const enderecosEntrega = cliente.enderecos.filter(e => e.tipo === 'ENTREGA') || [];
//   if (enderecosEntrega.length > 0) {
//     html += `<div class="modal-section"><h4>Endereço(s) de Entrega</h4>`;
    
//     enderecosEntrega.forEach((e) => {
//       html += `
//         <div class="endereco-container" style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
//           <div style="display: flex; justify-content: space-between; align-items: center;">
//             <h5 style="margin-top: 0;">
//               <span id="nome-endereco-${e.id}">${e.nomeEndereco || 'Endereço de Entrega'}</span>
//               <button onclick="editarNomeEndereco(${e.id})" style="background: none; border: none; cursor: pointer;">✏️</button>
//             </h5>
//              <button onclick="editarEndereco(${e.id}, 'ENTREGA', event); return false;" class="btn-editar">Editar</button>
//           </div>
//           <div class="endereco-info" id="endereco-${e.id}">
//             <!-- Conteúdo será preenchido dinamicamente -->
//           </div>
//         </div>
//       `;
//     });
    
//     html += `</div>`;
//   }

//   div.innerHTML = html;

//   // Preenche os dados dos endereços
//   preencherDadosEndereco(enderecoCobranca, `endereco-cobranca-${enderecoCobranca.id || '0'}`);
//   enderecosEntrega.forEach(e => {
//     preencherDadosEndereco(e, `endereco-${e.id}`);
//   });

//   // Mostra apenas o modal, sem preencher o formulário de cadastro
//   document.getElementById('modal-visualizar').style.display = 'block';
// }

// document.getElementById('form-cliente').addEventListener('submit', function(e) {
//   // Verifica se o submit veio de um botão específico
//   if (e.submitter && e.submitter.id !== 'botao-salvar') {
//     e.preventDefault();
//   }
// });


// function fecharModalVer() {
//     document.getElementById('modal-visualizar').style.display = 'none';

//       return false;
// }

// let contadorEntrega = 1;

// function adicionarEnderecoEntrega(endereco = {}) {
//   const container = document.getElementById('enderecos-entrega-container');
//   const div = document.createElement('div');
//   div.className = 'endereco-entrega';
//   div.style.border = '1px solid #ccc';
//   div.style.marginBottom = '15px';
//   div.style.padding = '10px';

//   const estadoSelecionado = endereco.estado || '';

//   const opcoesEstado = [
//     "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT",
//     "MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS",
//     "RO","RR","SC","SP","SE","TO"
//   ];

//   const selectEstadoHTML = `
//     <select name="entrega-estado" required>
//       <option value="">Selecione</option>
//       ${opcoesEstado.map(uf => `
//         <option value="${uf}" ${uf === estadoSelecionado ? 'selected' : ''}>${uf}</option>
//       `).join('')}
//     </select>
//   `;

//   div.innerHTML = `
//     <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
//       <h4 style="margin: 0;">
//         Endereço de Entrega Adicional
//       </h4>
//       <button type="button" onclick="removerEnderecoEntrega(this)" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px;">Remover</button>
//     </div>

//     <!-- Linha 1 -->
//     <div class="form-row">
//       <div><label>Bairro</label><input type="text" name="entrega-bairro" value="${endereco.bairro ?? ''}" required /></div>
//       <div><label>Cidade</label><input type="text" name="entrega-cidade" value="${endereco.cidade ?? ''}" required /></div>
//       <div><label>País</label><input type="text" name="entrega-pais" value="${endereco.pais ?? 'Brasil'}" disabled /></div>
//       <div>
//         <label>Estado</label>
//         ${selectEstadoHTML}
//       </div>
//     </div>

//     <!-- Linha 2 -->
//     <div class="form-row">
//       <div><label>Número</label><input type="text" name="entrega-numero" value="${endereco.numero ?? ''}" required /></div>
//       <div><label>Complemento</label><input type="text" name="entrega-complemento" value="${endereco.complemento ?? ''}" /></div>
//       <div><label>CEP</label><input type="text" name="entrega-cep" value="${endereco.cep ?? ''}" required /></div>
//       <div><label>Rua</label><input type="text" name="entrega-rua" value="${endereco.rua ?? ''}" required /></div>
//     </div>

//     <!-- Linha 3 -->
//     <div class="form-row">
//       <div><label>Tipo de Residência</label><input type="text" name="entrega-tipo-residencia" value="${endereco.tipoResidencia ?? ''}" required /></div>
//       <div><label>Tipo de Logradouro</label><input type="text" name="entrega-tipo-logradouro" value="${endereco.tipoLogradouro ?? ''}" required /></div>
//       <div><label>Logradouro</label><input type="text" name="entrega-logradouro" value="${endereco.logradouro ?? ''}" required /></div>
//     </div>
//   `;

//   container.appendChild(div);
// }



// function removerEnderecoEntrega(botao) {
//   botao.closest('.endereco-entrega').remove();
// }

// async function editarNomeEndereco(idEndereco) {
//   const spanNome = document.getElementById(`nome-endereco-${idEndereco}`);
//   const nomeAtual = spanNome.textContent;

//   const novoNome = prompt("Digite o novo nome para este endereço:", nomeAtual);

//   if (novoNome !== null && novoNome.trim() !== '' && novoNome !== nomeAtual) {
//     try {
//       const response = await fetch(`/api/enderecos/${idEndereco}/nome`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ nomeEndereco: novoNome.trim() })
//       });

//       if (response.ok) {
//         spanNome.textContent = novoNome.trim();
//         alert("Nome do endereço atualizado com sucesso!");
//       } else {
//         const error = await response.text();
//         alert(`Erro ao atualizar nome: ${error}`);
//       }
//     } catch (error) {
//       console.error('Erro:', error);
//       alert('Erro ao conectar com o servidor');
//     }
//   }
// }


// function coletarEnderecosEntrega() {
//   const enderecosEntrega = [];
//   const enderecosElements = document.querySelectorAll('.endereco-entrega');

//   enderecosElements.forEach((enderecoDiv, index) => {
//     const nomeEndereco = enderecoDiv.querySelector('.nome-endereco')?.value || `Endereço #${index + 1}`;
    
//     if (index === 0) {
//       enderecosEntrega.push({
//         nomeEndereco: nomeEndereco,
//         cep: document.getElementById('entrega-cep').value,
//         rua: document.getElementById('entrega-rua').value,
//         numero: document.getElementById('entrega-numero').value,
//         complemento: document.getElementById('entrega-complemento').value,
//         bairro: document.getElementById('entrega-bairro').value,
//         cidade: document.getElementById('entrega-cidade').value,
//         estado: document.getElementById('entrega-estado').value,
//         pais: document.getElementById('entrega-pais').value,
//         tipoResidencia: document.getElementById('entrega-tipo-residencia').value,
//         tipoLogradouro: document.getElementById('entrega-tipo-logradouro').value,
//         logradouro: document.getElementById('entrega-logradouro').value,
//         tipo: 'ENTREGA'
//       });
//     } else {
//       enderecosEntrega.push({
//         nomeEndereco: nomeEndereco,
//         cep: enderecoDiv.querySelector('[name="entrega-cep"]').value,
//         rua: enderecoDiv.querySelector('[name="entrega-rua"]').value,
//         numero: enderecoDiv.querySelector('[name="entrega-numero"]').value,
//         complemento: enderecoDiv.querySelector('[name="entrega-complemento"]').value,
//         bairro: enderecoDiv.querySelector('[name="entrega-bairro"]').value,
//         cidade: enderecoDiv.querySelector('[name="entrega-cidade"]').value,
//         estado: enderecoDiv.querySelector('[name="entrega-estado"]').value,
//         pais: enderecoDiv.querySelector('[name="entrega-pais"]').value,
//         tipoResidencia: enderecoDiv.querySelector('[name="entrega-tipo-residencia"]').value,
//         tipoLogradouro: enderecoDiv.querySelector('[name="entrega-tipo-logradouro"]').value,
//         logradouro: enderecoDiv.querySelector('[name="entrega-logradouro"]').value,
//         tipo: 'ENTREGA'
//       });
//     }
//   });

//   return enderecosEntrega;
// }

// function preencherDadosEndereco(endereco, containerId) {
//   const container = document.getElementById(containerId);
//   if (!container) return;

//   container.innerHTML = `
//     <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
//       <div><strong>CEP:</strong> ${endereco.cep || '-'}</div>
//       <div><strong>Rua:</strong> ${endereco.rua || '-'}</div>
//       <div><strong>Número:</strong> ${endereco.numero || '-'}</div>
//       <div><strong>Complemento:</strong> ${endereco.complemento || '-'}</div>
//       <div><strong>Bairro:</strong> ${endereco.bairro || '-'}</div>
//       <div><strong>Cidade:</strong> ${endereco.cidade || '-'}</div>
//       <div><strong>Estado:</strong> ${endereco.estado || '-'}</div>
//       <div><strong>País:</strong> ${endereco.pais || 'Brasil'}</div>
//       <div><strong>Tipo Residência:</strong> ${endereco.tipoResidencia || '-'}</div>
//       <div><strong>Tipo Logradouro:</strong> ${endereco.tipoLogradouro || '-'}</div>
//       <div><strong>Logradouro:</strong> ${endereco.logradouro || '-'}</div>
//     </div>
//   `;
// }

// async function editarEndereco(enderecoId, tipo, event) {

//     const formPrincipal = document.getElementById('form-cliente');
//   const oldSubmitHandler = formPrincipal.onsubmit;
//   formPrincipal.onsubmit = null;
//   // Previne o comportamento padrão e a propagação do evento
//   if (event) {
//     event.preventDefault();
//     event.stopPropagation();
//     event.stopImmediatePropagation();
//   }
  
//   let endereco;
  
//   if (enderecoId && enderecoId !== 'null') {
//     const response = await fetch(`/api/enderecos/${enderecoId}`);
//     if (!response.ok) {
//       alert('Erro ao carregar endereço');
//       return;
//     }
//     endereco = await response.json();
//   } else {
//     endereco = {
//       cep: '',
//       rua: '',
//       numero: '',
//       complemento: '',
//       bairro: '',
//       cidade: '',
//       estado: '',
//       pais: 'Brasil',
//       tipoResidencia: '',
//       tipoLogradouro: '',
//       logradouro: '',
//       tipo: tipo
//     };
//   }

//   const containerId = tipo === 'COBRANCA' 
//     ? `endereco-cobranca-${enderecoId || '0'}` 
//     : `endereco-${enderecoId}`;
  
//   const container = document.getElementById(containerId);
//   if (!container) return;

//   // HTML para edição do endereço
//  container.innerHTML = `
//   <form id="form-editar-endereco-${enderecoId || 'novo'}" 
//         class="form-editar-endereco"
//         data-endereco-id="${enderecoId || ''}"
//         data-tipo="${tipo}"
//         onsubmit="event.preventDefault(); event.stopImmediatePropagation(); salvarEndereco(event, ${enderecoId || 'null'}, '${tipo}')">
//       <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
//         <div>
//           <label>CEP</label>
//           <input type="text" name="cep" value="${endereco.cep || ''}" required>
//         </div>
//         <div>
//           <label>Rua</label>
//           <input type="text" name="rua" value="${endereco.rua || ''}" required>
//         </div>
//         <div>
//           <label>Número</label>
//           <input type="text" name="numero" value="${endereco.numero || ''}" required>
//         </div>
//         <div>
//           <label>Complemento</label>
//           <input type="text" name="complemento" value="${endereco.complemento || ''}">
//         </div>
//         <div>
//           <label>Bairro</label>
//           <input type="text" name="bairro" value="${endereco.bairro || ''}" required>
//         </div>
//         <div>
//           <label>Cidade</label>
//           <input type="text" name="cidade" value="${endereco.cidade || ''}" required>
//         </div>
//         <div>
//           <label>Estado</label>
//           <select name="estado" required>
//             <option value="">Selecione</option>
//             ${['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT',
//                'MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS',
//                'RO','RR','SC','SP','SE','TO'].map(uf => `
//               <option value="${uf}" ${uf === endereco.estado ? 'selected' : ''}>${uf}</option>
//             `).join('')}
//           </select>
//         </div>
//         <div>
//           <label>País</label>
//           <input type="text" name="pais" value="${endereco.pais || 'Brasil'}" disabled>
//         </div>
//         <div>
//           <label>Tipo Residência</label>
//           <input type="text" name="tipoResidencia" value="${endereco.tipoResidencia || ''}" required>
//         </div>
//         <div>
//           <label>Tipo Logradouro</label>
//           <input type="text" name="tipoLogradouro" value="${endereco.tipoLogradouro || ''}" required>
//         </div>
//         <div>
//           <label>Logradouro</label>
//           <input type="text" name="logradouro" value="${endereco.logradouro || ''}" required>
//         </div>
//       </div>
//       <div style="margin-top: 15px; display: flex; gap: 10px;">
//         <button type="submit" class="btn-salvar">Salvar</button>
//         <button type="button" onclick="cancelarEdicaoEndereco('${containerId}', ${enderecoId || 'null'}, '${tipo}')" class="btn-cancelar">Cancelar</button>
//       </div>
//     </form>
//   `;

//    window.finalizarEdicaoEndereco = function() {
//     formPrincipal.onsubmit = oldSubmitHandler;
//     delete window.finalizarEdicaoEndereco;
//   };
// }

// async function salvarEndereco(enderecoId, tipo, formId) {
//   const form = document.getElementById(formId);
//   if (!form) return;

//   const formData = new FormData(form);
  
//   // Validação dos campos obrigatórios
//   const camposObrigatorios = ['cep', 'rua', 'numero', 'bairro', 'cidade', 'estado', 
//                              'tipoResidencia', 'tipoLogradouro', 'logradouro'];
  
//   for (const campo of camposObrigatorios) {
//     if (!formData.get(campo)) {
//       alert(`O campo ${campo} é obrigatório`);
//       return;
//     }
//   }

//   // Cria o objeto com os dados atualizados
//   const enderecoAtualizado = {
//     cep: formData.get('cep'),
//     rua: formData.get('rua'),
//     numero: formData.get('numero'),
//     complemento: formData.get('complemento'),
//     bairro: formData.get('bairro'),
//     cidade: formData.get('cidade'),
//     estado: formData.get('estado'),
//     pais: formData.get('pais'),
//     tipoResidencia: formData.get('tipoResidencia'),
//     tipoLogradouro: formData.get('tipoLogradouro'),
//     logradouro: formData.get('logradouro'),
//     tipo: tipo
//   };

//   try {
//     let response;
//     const clienteId = document.querySelector('.cliente-info').dataset.clienteId;
    
//     if (enderecoId && enderecoId !== 'null') {
//       response = await fetch(`/api/enderecos/${enderecoId}`, {
//         method: 'PUT',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify(enderecoAtualizado)
//       });
//     } else {
//       enderecoAtualizado.clienteId = clienteId;
//       response = await fetch('/api/enderecos', {
//         method: 'POST',
//         headers: {'Content-Type': 'application/json'},
//         body: JSON.stringify(enderecoAtualizado)
//       });
//     }

//     if (response.ok) {
//       const enderecoSalvo = await response.json();
//       alert('Endereço salvo com sucesso!');
      
//       const containerId = tipo === 'COBRANCA' 
//         ? `endereco-cobranca-${enderecoSalvo.id || '0'}` 
//         : `endereco-${enderecoSalvo.id}`;
      
//       preencherDadosEndereco(enderecoSalvo, containerId);
//       activeAddressForm = null;
//     } else {
//       const error = await response.text();
//       alert(`Erro ao salvar endereço: ${error}`);
//     }
//   } catch (error) {
//     console.error('Erro:', error);
//     alert('Erro ao conectar com o servidor');
//   }
// }

// function cancelarEdicaoEndereco(containerId, enderecoId, tipo) {
//   if (enderecoId && enderecoId !== 'null') {
//     // Recarrega os dados originais do endereço
//     fetch(`/api/enderecos/${enderecoId}`)
//       .then(res => res.json())
//       .then(endereco => {
//         preencherDadosEndereco(endereco, containerId);
//       })
//       .catch(err => {
//         console.error('Erro ao carregar endereço:', err);
//         document.getElementById(containerId).innerHTML = '';
//       });
//   } else {
//     // Para novo endereço não salvo, apenas limpa
//     document.getElementById(containerId).innerHTML = '';
//   }
// }
//  const telefoneInput = document.getElementById("telefone");

//   telefoneInput.addEventListener("input", function (e) {
//     let valor = e.target.value.replace(/\D/g, ""); // remove tudo que não for número

//     // Aplica máscara conforme o número de dígitos
//     if (valor.length <= 10) {
//       valor = valor.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})/, function(_, ddd, p1, p2) {
//         let res = "";
//         if (ddd) res += "(" + ddd;
//         if (ddd.length === 2) res += ") ";
//         if (p1) res += p1;
//         if (p2) res += "-" + p2;
//         return res;
//       });
//     } else {
//       valor = valor.replace(/^(\d{0,2})(\d{0,5})(\d{0,4})/, function(_, ddd, p1, p2) {
//         let res = "";
//         if (ddd) res += "(" + ddd;
//         if (ddd.length === 2) res += ") ";
//         if (p1) res += p1;
//         if (p2) res += "-" + p2;
//         return res;
//       });
//     }

//     telefoneInput.value = valor;
//   });

//   telefoneInput.addEventListener("keydown", function (e) {
//     const pos = telefoneInput.selectionStart;
//     const val = telefoneInput.value;

//     // Corrige travamento ao apagar caracteres especiais
//     if (
//       e.key === "Backspace" &&
//       pos > 0 &&
//       [" ", "-", ")", "("].includes(val[pos - 1])
//     ) {
//       e.preventDefault();
//       telefoneInput.setSelectionRange(pos - 1, pos - 1);
//     }
//   });

// function abrirModalVer() {
//   document.body.classList.add('modal-aberto');
//   document.getElementById('modal-visualizar').style.display = 'block';
// }

// function fecharModalVer() {
//   document.body.classList.remove('modal-aberto');
//   document.getElementById('modal-visualizar').style.display = 'none';
// }

// // Adicione este código no seu arquivo JavaScript
// document.addEventListener('click', function(event) {
//   // Verifica se o clique foi no botão de salvar do endereço
//   if (event.target.closest('.btn-salvar') && event.target.closest('form[id^="form-editar-endereco"]')) {
//     event.preventDefault();
//     event.stopImmediatePropagation();
    
//     // Encontra o formulário de endereço mais próximo
//     const formEndereco = event.target.closest('form');
    
//     // Dispara o submit manualmente com nosso handler
//     salvarEndereco({
//       target: formEndereco,
//       preventDefault: () => {},
//       stopPropagation: () => {},
//       stopImmediatePropagation: () => {}
//     }, 
//     formEndereco.id.replace('form-editar-endereco-', '').replace('-novo', 'null'), 
//     formEndereco.querySelector('[name="tipo"]')?.value || 'COBRANCA');
//   }
// }, true); // Usando capture phase para pegar o evento primeiro

// // Carregar clientes quando a página é aberta
// window.onload = carregarClientes;

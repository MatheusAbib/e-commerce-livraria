// async function carregarLivros(filtros = {}) {
//   const params = new URLSearchParams();

//   if (filtros.autor) params.append('autor', filtros.autor);
//   if (filtros.editora) params.append('editora', filtros.editora);
//   if (filtros.categoria) params.append('categoria', filtros.categoria);
//   if (filtros.ordenarPor) params.append('ordenarPor', filtros.ordenarPor);
//   if (filtros.direcao) params.append('direcao', filtros.direcao);

//   const url = '/api/livros/consulta?' + params.toString();

//   const response = await fetch(url);
//   const resultado = await response.json();

//   // A API deve retornar:
//   // { livros: [...], countFiltered: n, countTotal: m }
//   const livros = resultado.livros ?? [];
//   const countFiltered = resultado.countFiltered ?? livros.length;
//   const countTotal = resultado.countTotal ?? livros.length;

//   const infoDiv = document.getElementById('info-contagem');
//   if (infoDiv) {
//     infoDiv.textContent = `Mostrando ${countFiltered} livros de um total de ${countTotal}`;
//   }

//   const tbody = document.getElementById('livros-tbody');
//   tbody.innerHTML = '';

//   livros.forEach(livro => {
//     const tr = document.createElement('tr');
//     const status = livro.ativo ? 'Ativo' : 'Inativo';

//     const btnAcao = livro.ativo
//       ? `<button onclick="abrirModalConfirmacao(${livro.id}, 'inativar')">Inativar</button>`
//       : `<button onclick="abrirModalConfirmacao(${livro.id}, 'ativar')">Ativar</button>`;

//     tr.innerHTML = `
//       <td>${livro.id}</td>
//       <td>${livro.titulo}</td>
//       <td>${livro.autor ?? '-'}</td>
//       <td>${livro.edicao ?? '-'}</td>
//       <td>${livro.editora ?? '-'}</td>
//       <td>${livro.categoria ?? '-'}</td>
//       <td>R$ ${livro.precoVenda?.toFixed(2) ?? '0,00'}</td>
//       <td>${livro.estoque ?? 0}</td>
//       <td>${status}</td>
//       <td>
//         <button onclick="editarLivro(${livro.id})">Editar</button>
//         ${btnAcao}
//         <button onclick="abrirModalDetalhes(${livro.id})">Ver</button>
//         <button onclick="abrirModalExclusao(${livro.id}, '${livro.titulo.replace(/'/g, "\\'")}')">Excluir</button>
//       </td>
//     `;

//     tbody.appendChild(tr);
//   });
// }


// // Função para abrir modal de detalhes do livro
// async function abrirModalDetalhes(id) {
//   const res = await fetch(`/api/livros/${id}`);
//   if (!res.ok) {
//     alert('Erro ao buscar detalhes do livro');
//     return;
//   }
//   const livro = await res.json();

//   const conteudo = `
//     <p><strong>ID:</strong> ${livro.id}</p>
//     <p><strong>Título:</strong> ${livro.titulo}</p>
//     <p><strong>Autor:</strong> ${livro.autor}</p>
//     <p><strong>Editora:</strong> ${livro.editora ?? '-'}</p>
//     <p><strong>Categoria:</strong> ${livro.categoria ?? '-'}</p>
//     <p><strong>Edição:</strong> ${livro.edicao ?? '-'}</p>
//     <p><strong>ISBN:</strong> ${livro.isbn ?? '-'}</p>
//     <p><strong>Páginas:</strong> ${livro.paginas ?? '-'}</p>
//     <p><strong>Sinopse:</strong> ${livro.sinopse ?? '-'}</p>
//     <p><strong>Dimensões:</strong> ${livro.altura ?? '-'} x ${livro.largura ?? '-'} x ${livro.profundidade ?? '-'} cm</p>
//     <p><strong>Peso:</strong> ${livro.peso ?? '-'} g</p>
//     <p><strong>Código de Barras:</strong> ${livro.codigoBarras ?? '-'}</p>
//     <p><strong>Preço de Venda:</strong> R$ ${livro.precoVenda?.toFixed(2) ?? '-'}</p>
//     <p><strong>Preço de Custo:</strong> R$ ${livro.precoCusto?.toFixed(2) ?? '-'}</p>
//     <p><strong>Estoque:</strong> ${livro.estoque}</p>
//     <p><strong>Data de Entrada:</strong> ${livro.dataEntrada ?? '-'}</p>
//     <p><strong>Status:</strong> ${livro.ativo ? 'Ativo' : 'Inativo'}</p>
//   `;

//   document.getElementById('detalhes-conteudo').innerHTML = conteudo;
//   document.getElementById('modal-detalhes').style.display = 'flex';
// }

// function fecharModalDetalhes() {
//   document.getElementById('modal-detalhes').style.display = 'none';
// }

// // Modal exclusão
// let idParaExcluir = null;

// function abrirModalExclusao(id, titulo) {
//   idParaExcluir = id;
//   document.getElementById('modal-msg').textContent = `Tem certeza que deseja excluir o livro "${titulo}"?`;
//   document.getElementById('modal-excluir').style.display = 'flex';
// }

// function fecharModal() {
//   document.getElementById('modal-excluir').style.display = 'none';
//   idParaExcluir = null;
// }

// document.getElementById('btn-confirmar-excluir').addEventListener('click', async () => {
//   if (idParaExcluir) {
//     const res = await fetch(`/api/livros/${idParaExcluir}`, { method: 'DELETE' });
//     if (res.ok) {
//       fecharModal();
//       carregarLivros();
//     } else {
//       alert('Erro ao excluir livro');
//     }
//   }
// });

// // Funções para ativar/inativar livro
// async function inativarLivro(id) {
//   const res = await fetch(`/api/livros/change-status/${id}`, {
//     method: 'POST', // ou PUT, dependendo do seu backend
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ ativo: false }),
//   });
//   if (res.ok) {
//     carregarLivros(); // atualiza a lista
//   } else {
//     alert('Erro ao inativar livro');
//   }
// }


// async function ativarLivro(id) {
//   const res = await fetch(`/api/livros/change-status/${id}`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ ativo: true })
//   });
//   if (res.ok) carregarLivros();
//   else alert('Erro ao ativar livro');
// }

// // Função para iniciar edição (exemplo simples, você pode completar)
// async function editarLivro(id) {
//   window.location.href = `cadastro.html?id=${id}`;
// }

// // Inicializa a lista ao carregar a página
// window.onload = () => carregarLivros();

// let acaoId = null;
// let acaoTipo = null; // 'ativar' ou 'inativar'

// function abrirModalConfirmacao(id, tipo) {
//   acaoId = id;
//   acaoTipo = tipo;

//   const titulo = tipo === 'ativar' ? 'Ativar Livro' : 'Inativar Livro';
//   const mensagem = tipo === 'ativar' ? 'Você tem certeza que deseja ativar este livro?' : 'Você tem certeza que deseja inativar este livro?';

//   document.getElementById('modal-titulo').textContent = titulo;
//   document.getElementById('modal-mensagem').textContent = mensagem;
//   document.getElementById('motivoInput').value = '';

//   document.getElementById('modal-confirmacao').style.display = 'flex';
// }

// function fecharModalConfirmacao() {
//   acaoId = null;
//   acaoTipo = null;
//   document.getElementById('modal-confirmacao').style.display = 'none';
// }

// document.getElementById('btn-confirmar-acao').addEventListener('click', async () => {
//   const motivo = document.getElementById('motivoInput').value.trim();
//   if (!motivo) {
//     alert('Por favor, informe o motivo.');
//     return;
//   }

//   if (acaoId && acaoTipo) {
//     // Chamar função que faz a requisição para ativar ou inativar, passando o motivo
//     if (acaoTipo === 'inativar') {
//       await enviarStatus(acaoId, false, motivo);
//     } else {
//       await enviarStatus(acaoId, true, motivo);
//     }
//   }

//   fecharModalConfirmacao();
//   carregarLivros();
// });

// async function enviarStatus(id, ativo, motivo) {
//   const res = await fetch(`/api/livros/change-status/${id}`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ ativo: ativo, motivo: motivo })
//   });

//   if (!res.ok) {
//     alert('Erro ao atualizar status do livro');
//   }
// }

// document.getElementById('form-filtros').addEventListener('submit', function(e) {
//   e.preventDefault();

//   const filtros = {
//     autor: document.getElementById('filtro-autor').value.trim(),
//     editora: document.getElementById('filtro-editora').value.trim(),
//     categoria: document.getElementById('filtro-categoria').value.trim(),
//     ordenarPor: document.getElementById('ordenar-por').value,
//     direcao: document.getElementById('direcao-ordem').value
//   };

//   carregarLivros(filtros);
// });

// document.getElementById('btn-limpar').addEventListener('click', function() {
//   document.getElementById('filtro-autor').value = '';
//   document.getElementById('filtro-editora').value = '';
//   document.getElementById('filtro-categoria').value = '';
//   document.getElementById('ordenar-por').value = '';
//   document.getElementById('direcao-ordem').value = 'asc';

//   carregarLivros();
// });

// // Carrega a lista ao abrir a página sem filtros
// if (document.getElementById('livros-tbody')) {
//   carregarLivros();
// }

// function mostrarTela(tela) {
//   const telas = ['livros', 'clientes'];

//   telas.forEach(t => {
//     const sec = document.getElementById(`tela-${t}`);
//     if (sec) {
//       sec.style.display = (t === tela) ? 'block' : 'none';
//     }
//   });
// }



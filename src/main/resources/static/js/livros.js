   function abrirFormulario(id = null) {
    document.getElementById('form-container').style.display = 'block';
    if (id) carregarLivro(id);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  function fecharFormulario() {
    document.getElementById('form-livro').reset();
    document.getElementById('livro-id').value = '';
    document.getElementById('form-container').style.display = 'none';
  }

  async function carregarLivro(id) {
    const res = await fetch(`/api/livros/${id}`);
    const livro = await res.json();
    document.getElementById('livro-id').value = livro.id;
    document.getElementById('titulo').value = livro.titulo;
    document.getElementById('autor').value = livro.autor;
    document.getElementById('editora').value = livro.editora;
    document.getElementById('categoria').value = livro.categoria;
    document.getElementById('edicao').value = livro.edicao;
    document.getElementById('isbn').value = livro.isbn;
    document.getElementById('paginas').value = livro.paginas;
    document.getElementById('sinopse').value = livro.sinopse;
    document.getElementById('altura').value = livro.altura;
    document.getElementById('largura').value = livro.largura;
    document.getElementById('profundidade').value = livro.profundidade;
    document.getElementById('peso').value = livro.peso;
    document.getElementById('codigoBarras').value = livro.codigoBarras;
    document.getElementById('precoCusto').value = livro.precoCusto;
    document.getElementById('estoque').value = livro.estoque;
    document.getElementById('dataEntrada').value = livro.dataEntrada;
    abrirFormulario();
  }

  document.getElementById('form-livro').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('livro-id').value;

    const livro = {
      titulo: document.getElementById('titulo').value,
      autor: document.getElementById('autor').value,
      editora: document.getElementById('editora').value,
      categoria: document.getElementById('categoria').value,
      edicao: parseInt(document.getElementById('edicao').value) || null,
      isbn: document.getElementById('isbn').value,
      paginas: parseInt(document.getElementById('paginas').value) || null,
      sinopse: document.getElementById('sinopse').value,
      altura: parseFloat(document.getElementById('altura').value) || null,
      largura: parseFloat(document.getElementById('largura').value) || null,
      profundidade: parseFloat(document.getElementById('profundidade').value) || null,
      peso: parseFloat(document.getElementById('peso').value) || null,
      codigoBarras: document.getElementById('codigoBarras').value,
      precoCusto: parseFloat(document.getElementById('precoCusto').value),
      estoque: parseInt(document.getElementById('estoque').value),
      dataEntrada: document.getElementById('dataEntrada').value
    };

    const metodo = id ? 'PUT' : 'POST';
    const url = id ? `/api/livros/${id}` : '/api/livros';

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(livro)
      });

      if (response.ok) {
        exibirNotificacao('Livro salvo com sucesso!', 'success');
        fecharFormulario();
        carregarLivros();
      } else {
        const erro = await response.json();
        exibirNotificacao(erro.message || 'Erro ao salvar livro', 'error');
      }
    } catch (error) {
      exibirNotificacao('Erro na comunicação com o servidor', 'error');
      console.error('Erro:', error);
    }
  });

  function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('show');
    }

    let todosLivros = [];

async function carregarLivros(filtros = {}) {
    try {
        const params = new URLSearchParams();
        
        // Adiciona os parâmetros de filtro
        if (filtros.titulo) params.append('titulo', filtros.titulo);
        if (filtros.autor) params.append('autor', filtros.autor);
        if (filtros.editora) params.append('editora', filtros.editora);
        if (filtros.isbn) params.append('isbn', filtros.isbn);
        if (filtros.categoria) params.append('categoria', filtros.categoria);
        if (filtros.precoMin) params.append('precoMin', filtros.precoMin);
        if (filtros.precoMax) params.append('precoMax', filtros.precoMax);
        if (filtros.estoqueMin) params.append('estoqueMin', filtros.estoqueMin);
        if (filtros.estoqueMax) params.append('estoqueMax', filtros.estoqueMax);
        if (filtros.status) params.append('ativo', filtros.status === 'ativo');

        const url = '/api/livros/consulta?' + params.toString();
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Erro ao carregar livros');
        
        const resultado = await response.json();
        todosLivros = resultado.livros || [];
        
        // Atualiza a contagem
        const countFiltered = resultado.countFiltered || todosLivros.length;
        const countTotal = resultado.countTotal || todosLivros.length;
        
        const infoDiv = document.getElementById('info-contagem');
        if (infoDiv) {
            infoDiv.textContent = `Mostrando ${countFiltered} livros de um total de ${countTotal}`;
        }
        
        // Preenche a tabela
        preencherTabelaLivros(todosLivros);
        
    } catch (error) {
        console.error('Erro ao carregar livros:', error);
        exibirNotificacao('Não foi possível carregar os livros. Tente novamente mais tarde.', 'error');
    }
}

function preencherTabelaLivros(livros) {
    const tbody = document.getElementById('livros-tbody');
    tbody.innerHTML = '';

    if (!livros || livros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 20px;">
                    Nenhum livro encontrado
                </td>
            </tr>
        `;
        return;
    }

    livros.forEach(livro => {
        const tr = document.createElement('tr');
        const statusClass = livro.ativo ? 'status-ativo' : 'status-inativo';
        const statusIcon = livro.ativo ? 'fa-check-circle' : 'fa-times-circle';
        const statusText = livro.ativo ? 'Ativo' : 'Inativo';

        // Verifica se o livro está inativo E com estoque zerado
        const estoqueZerado = livro.estoque === 0;
        const desabilitarAtivar = !livro.ativo && estoqueZerado;

        const btnAcao = livro.ativo
            ? `<button class="btn-icon btn-status" onclick="abrirModalConfirmacao(${livro.id}, 'inativar')" title="Inativar">
                  <i class="fas fa-toggle-on"></i>
               </button>`
            : `<button class="btn-icon btn-status" ${desabilitarAtivar ? 'disabled' : ''} 
                  onclick="${desabilitarAtivar ? '' : `abrirModalConfirmacao(${livro.id}, 'ativar')`}" 
                  title="${desabilitarAtivar ? 'Não é possível ativar - Estoque zerado' : 'Ativar'}">
                  <i class="fas fa-toggle-off"></i>
               </button>`;

        tr.innerHTML = `
            <td>${livro.id}</td>
            <td>${livro.titulo}</td>
            <td>${livro.autor ?? '-'}</td>
            <td>${livro.edicao ?? '-'}</td>
            <td>${livro.editora ?? '-'}</td>
            <td>${livro.categoria ?? '-'}</td>
            <td>R$ ${livro.precoVenda?.toFixed(2) ?? '0,00'}</td>
            <td>${livro.estoque ?? 0}</td>
            <td class="${statusClass}"><i class="fas ${statusIcon}"></i> ${statusText}</td>
            <td class="acoes-cell">
                ${btnAcao}
                <button class="btn-icon btn-view" onclick="abrirModalDetalhes(${livro.id})" title="Visualizar">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon btn-edit" onclick="editarLivro(${livro.id})" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="abrirModalExclusao(${livro.id}, '${livro.titulo.replace(/'/g, "\\'")}')" title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function aplicarFiltros() {
  const titulo = document.getElementById('filtro-titulo').value;
  const autor = document.getElementById('filtro-autor').value;
  const editora = document.getElementById('filtro-editora').value;
  const isbn = document.getElementById('filtro-isbn').value;
  const categoria = document.getElementById('filtro-categoria').value;
  const precoMin = document.getElementById('filtro-preco-min').value;
  const precoMax = document.getElementById('filtro-preco-max').value;
  const estoqueMin = document.getElementById('filtro-estoque-min').value;
  const estoqueMax = document.getElementById('filtro-estoque-max').value;
  const status = document.getElementById('filtro-status').value;

  let url = `/api/livros/consulta?`;

  if (titulo) url += `titulo=${encodeURIComponent(titulo)}&`;
  if (autor) url += `autor=${encodeURIComponent(autor)}&`;
  if (editora) url += `editora=${encodeURIComponent(editora)}&`;
  if (isbn) url += `isbn=${encodeURIComponent(isbn)}&`;
  if (categoria) url += `categoria=${encodeURIComponent(categoria)}&`;
  if (precoMin) url += `precoMin=${encodeURIComponent(precoMin)}&`;
  if (precoMax) url += `precoMax=${encodeURIComponent(precoMax)}&`;
  if (estoqueMin) url += `estoqueMin=${encodeURIComponent(estoqueMin)}&`;
  if (estoqueMax) url += `estoqueMax=${encodeURIComponent(estoqueMax)}&`;
  if (status) url += `status=${encodeURIComponent(status)}&`;

  url = url.slice(0, -1);

  const tbody = document.getElementById('livros-tbody');
  // Mostra mensagem de carregando, ocupando todas as colunas da tabela
  tbody.innerHTML = `
    <tr>
      <td colspan="10" style="text-align:center; font-style: italic; padding: 15px;">
        <i class="fas fa-spinner fa-spin"></i> Carregando resultados...
      </td>
    </tr>
  `;

  setTimeout(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        preencherTabelaLivros(data.livros);
        document.getElementById('info-contagem').innerText = `Mostrando ${data.countFiltered} de ${data.countTotal} livros.`;
      })
      .catch(err => {
        console.error('Erro ao carregar livros:', err);
        tbody.innerHTML = `
          <tr>
            <td colspan="10" style="text-align:center; color: red;">
              <i class="fas fa-exclamation-triangle"></i> Erro ao carregar dados.
            </td>
          </tr>
        `;
      });
  }, 1000);
}

function limparFiltros() {
    // Limpa todos os campos de filtro
    document.querySelectorAll('.filtros-container input').forEach(input => {
        input.value = '';
    });
    
    document.getElementById('filtro-status').value = '';
    
    // Recarrega os livros sem filtros
    carregarLivros();
}

// Adiciona event listeners para aplicar filtros ao pressionar Enter
document.querySelectorAll('.filtros-container input').forEach(input => {
    input.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            aplicarFiltros();
        }
    });
});

// Carrega os livros quando a página é aberta
window.addEventListener('DOMContentLoaded', () => {
    carregarLivros();
});

// Função para abrir modal de detalhes do livro
async function abrirModalDetalhes(id) {
  const res = await fetch(`/api/livros/${id}`);
  if (!res.ok) {
    exibirNotificacao('Erro ao buscar detalhes do livro', 'error');
    return;
  }
  const livro = await res.json();

  const conteudo = `
    <div class="detalhes-grid">
      <div><strong>ID:</strong> ${livro.id}</div>
      <div><strong>Título:</strong> ${livro.titulo}</div>
      <div><strong>Autor:</strong> ${livro.autor}</div>
      <div><strong>Editora:</strong> ${livro.editora ?? '-'}</div>
      <div><strong>Categoria:</strong> ${livro.categoria ?? '-'}</div>
      <div><strong>Edição:</strong> ${livro.edicao ?? '-'}</div>
      <div><strong>ISBN:</strong> ${livro.isbn ?? '-'}</div>
      <div><strong>Páginas:</strong> ${livro.paginas ?? '-'}</div>
      <div class="full-width"><strong>Sinopse:</strong><br> ${livro.sinopse ?? '-'}</div>
      <div><strong>Dimensões:</strong> ${livro.altura ?? '-'} x ${livro.largura ?? '-'} x ${livro.profundidade ?? '-'} cm</div>
      <div><strong>Peso:</strong> ${livro.peso ?? '-'} g</div>
      <div><strong>Código de Barras:</strong> ${livro.codigoBarras ?? '-'}</div>
      <div><strong>Preço de Venda:</strong> R$ ${livro.precoVenda?.toFixed(2) ?? '-'}</div>
      <div><strong>Preço de Custo:</strong> R$ ${livro.precoCusto?.toFixed(2) ?? '-'}</div>
      <div><strong>Estoque:</strong> ${livro.estoque}</div>
      <div><strong>Data de Entrada:</strong> ${livro.dataEntrada ?? '-'}</div>
      <div><strong>Status:</strong> ${livro.ativo ? '<span class="status-ativo">Ativo</span>' : '<span class="status-inativo">Inativo</span>'}</div>
    </div>
  `;

  document.getElementById('detalhes-conteudo').innerHTML = conteudo;
  document.getElementById('modal-detalhes').style.display = 'flex';
}

function fecharModalDetalhes() {
  document.getElementById('modal-detalhes').style.display = 'none';
}

// Modal exclusão
let idParaExcluir = null;

function abrirModalExclusao(id, titulo) {
  idParaExcluir = id;
  document.getElementById('modal-msg').textContent = `Tem certeza que deseja excluir permanentemente o livro "${titulo}"? Esta ação não pode ser desfeita.`;
  document.getElementById('modal-excluir').style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal-excluir').style.display = 'none';
  idParaExcluir = null;
}

document.getElementById('btn-confirmar-excluir').addEventListener('click', async () => {
  if (idParaExcluir) {
    try {
      const res = await fetch(`/api/livros/${idParaExcluir}`, { method: 'DELETE' });
      if (res.ok) {
        exibirNotificacao('Livro excluído com sucesso', 'success');
        fecharModal();
        carregarLivros();
      } else {
        const erro = await res.json();
        exibirNotificacao(erro.message || 'Erro ao excluir livro', 'error');
      }
    } catch (error) {
      exibirNotificacao('Erro na comunicação com o servidor', 'error');
      console.error('Erro:', error);
    }
  }
});

// Funções para ativar/inativar livro
let acaoId = null;
let acaoTipo = null; // 'ativar' ou 'inativar'

function abrirModalConfirmacao(id, tipo) {
  acaoId = id;
  acaoTipo = tipo;

  const titulo = tipo === 'ativar' ? 'Ativar Livro' : 'Inativar Livro';
  const mensagem = tipo === 'ativar'
    ? 'Você tem certeza que deseja ativar este livro?'
    : 'Você tem certeza que deseja inativar este livro?';

  document.getElementById('modal-titulo').textContent = titulo;
  document.getElementById('modal-mensagem').textContent = mensagem;
  document.getElementById('motivoInput').value = '';

  document.getElementById('modal-confirmacao').style.display = 'flex';
}

function fecharModalConfirmacao() {
  acaoId = null;
  acaoTipo = null;
  document.getElementById('modal-confirmacao').style.display = 'none';
}

document.getElementById('btn-confirmar-acao').addEventListener('click', async () => {
  const motivo = document.getElementById('motivoInput').value.trim();
  if (!motivo) {
    exibirNotificacao('Por favor, informe o motivo.', 'warning');
    return;
  }

  if (acaoId && acaoTipo) {
    try {
      if (acaoTipo === 'inativar') {
        await enviarStatus(acaoId, false, motivo);
      } else {
        await enviarStatus(acaoId, true, motivo);
      }
      fecharModalConfirmacao();
      carregarLivros();
    } catch (error) {
      console.error('Erro:', error);
      exibirNotificacao('Erro ao processar ação', 'error');
    }
  }
});

async function enviarStatus(id, ativo, motivo) {
  const res = await fetch(`/api/livros/change-status/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ativo, motivo })
  });

  if (res.ok) {
    exibirNotificacao(`Livro ${ativo ? 'ativado' : 'inativado'} com sucesso`, 'success');
  } else {
    const erro = await res.json();
    exibirNotificacao(erro.message || 'Erro ao alterar status', 'error');
    throw new Error(erro.message || 'Erro ao alterar status');
  }
}

// Função para iniciar edição
async function editarLivro(id) {
  await carregarLivro(id);
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

// Inicializa a lista ao carregar a página
window.onload = () => carregarLivros();

function exibirModalErro(mensagem) {
  document.getElementById('mensagemErro').innerText = mensagem;
  document.getElementById('modalErro').style.display = 'flex';
}

function fecharModalErro() {
  document.getElementById('modalErro').style.display = 'none';
}
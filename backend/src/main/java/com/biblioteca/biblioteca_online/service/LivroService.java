package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.model.Livro;
import com.biblioteca.biblioteca_online.model.Log;
import com.biblioteca.biblioteca_online.repository.LivroRepository;
import com.biblioteca.biblioteca_online.specs.LivroSpecification;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

import jakarta.transaction.Transactional;

@Service
public class LivroService {

    private final LivroRepository livroRepository;
    private final LogService logService;

    public LivroService(LivroRepository livroRepository, LogService logService) {
        this.livroRepository = livroRepository;
        this.logService = logService;
    }

    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    public Livro salvar(Livro livro) {
        if (livro.getPrecoCusto() == null || livro.getPrecoCusto().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Preço de custo deve ser maior que zero.");
        }

        if (livro.getEstoque() == null || livro.getEstoque() <= 0) {
            throw new IllegalArgumentException("Quantidade em estoque deve ser maior que zero.");
        }

        if (livro.getDataEntrada() == null) {
            livro.setDataEntrada(LocalDate.now());
        }

        BigDecimal margemLucro = new BigDecimal("0.10");
        BigDecimal precoVenda = livro.getPrecoCusto().multiply(BigDecimal.ONE.add(margemLucro));
        livro.setPrecoVenda(precoVenda.setScale(2, RoundingMode.HALF_UP));

        atualizarStatusPorEstoque(livro);

        Livro salvo = livroRepository.save(livro);

        Log log = new Log();
        log.setUserId(null);
        log.setUserName("Sistema");
        log.setAction("livro_adicionado");
        log.setDetails("Livro \"" + salvo.getTitulo() + "\" adicionado. Estoque: " + salvo.getEstoque() + ", Preço: R$ " + salvo.getPrecoVenda());
        log.setLevel("info");
        logService.salvarLog(log);

        return salvo;
    }

    public Optional<Livro> buscarPorId(Long id) {
        return livroRepository.findById(id);
    }

    public Livro atualizar(Long id, Livro novoLivro) {
        Livro existente = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

        String tituloAntigo = existente.getTitulo();
        Integer estoqueAntigo = existente.getEstoque();
        BigDecimal precoAntigo = existente.getPrecoVenda();

        existente.setTitulo(novoLivro.getTitulo());
        existente.setAutor(novoLivro.getAutor());
        existente.setEditora(novoLivro.getEditora());
        existente.setCategoria(novoLivro.getCategoria());
        existente.setPrecoCusto(novoLivro.getPrecoCusto());
        existente.setEstoque(novoLivro.getEstoque());
        existente.setDataEntrada(novoLivro.getDataEntrada());

        if (novoLivro.getPrecoCusto() != null && novoLivro.getPrecoCusto().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal margemLucro = new BigDecimal("0.25");
            BigDecimal precoVenda = novoLivro.getPrecoCusto().multiply(BigDecimal.ONE.add(margemLucro));
            existente.setPrecoVenda(precoVenda.setScale(2, RoundingMode.HALF_UP));
        }

        atualizarStatusPorEstoque(existente);

        Livro salvo = livroRepository.save(existente);

        StringBuilder detalhes = new StringBuilder();
        detalhes.append("Livro \"").append(tituloAntigo).append("\" editado: ");
        if (!tituloAntigo.equals(salvo.getTitulo())) {
            detalhes.append("Título: ").append(tituloAntigo).append(" → ").append(salvo.getTitulo()).append("; ");
        }
        if (!estoqueAntigo.equals(salvo.getEstoque())) {
            detalhes.append("Estoque: ").append(estoqueAntigo).append(" → ").append(salvo.getEstoque()).append("; ");
        }
        if (precoAntigo != null && salvo.getPrecoVenda() != null && precoAntigo.compareTo(salvo.getPrecoVenda()) != 0) {
            detalhes.append("Preço: R$ ").append(precoAntigo).append(" → R$ ").append(salvo.getPrecoVenda()).append("; ");
        }

        Log log = new Log();
        log.setUserId(null);
        log.setUserName("Sistema");
        log.setAction("livro_editado");
        log.setDetails(detalhes.toString());
        log.setLevel("info");
        logService.salvarLog(log);

        return salvo;
    }

    public void inativar(Long id, String motivo) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
        livro.setAtivo(false);
        livro.setMotivoInativacao(motivo);
        livroRepository.save(livro);

        Log log = new Log();
        log.setUserId(null);
        log.setUserName("Sistema");
        log.setAction("livro_inativado");
        log.setDetails("Livro \"" + livro.getTitulo() + "\" inativado. Motivo: " + motivo);
        log.setLevel("warning");
        logService.salvarLog(log);
    }

    public void ativar(Long id, String motivo) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
        livro.setAtivo(true);
        livro.setMotivoAtivacao(motivo);
        livroRepository.save(livro);

        Log log = new Log();
        log.setUserId(null);
        log.setUserName("Sistema");
        log.setAction("livro_ativado");
        log.setDetails("Livro \"" + livro.getTitulo() + "\" ativado. Motivo: " + motivo);
        log.setLevel("success");
        logService.salvarLog(log);
    }

    public List<Livro> listarAtivos() {
        return livroRepository.findByAtivo(true);
    }

    public List<Livro> consultarComFiltros(String autor, String editora, String categoria, String ordenarPor,
            String direcao) {
        Specification<Livro> spec = Specification.where(LivroSpecification.autorContem(autor))
                .and(LivroSpecification.editoraContem(editora))
                .and(LivroSpecification.categoriaContem(categoria));

        Sort.Direction ordem = "desc".equalsIgnoreCase(direcao) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(ordem, ordenarPor != null ? ordenarPor : "id");

        return livroRepository.findAll(spec, sort);
    }

    public void excluir(Long id) {
        if (!livroRepository.existsById(id)) {
            throw new RuntimeException("Livro não encontrado");
        }
        livroRepository.deleteById(id);
    }

    public Map<String, Object> consultarComFiltrosComContagem(
            String titulo,
            String autor,
            String editora,
            String isbn,
            String categoria,
            BigDecimal precoMin,
            BigDecimal precoMax,
            Integer estoqueMin,
            Integer estoqueMax,
            String status,
            String ordenarPor,
            String direcao) {
        Specification<Livro> spec = Specification.where(LivroSpecification.tituloContem(titulo))
                .and(LivroSpecification.autorContem(autor))
                .and(LivroSpecification.editoraContem(editora))
                .and(LivroSpecification.isbnContem(isbn))
                .and(LivroSpecification.categoriaContem(categoria))
                .and(LivroSpecification.precoVendaEntre(precoMin, precoMax))
                .and(LivroSpecification.estoqueEntre(estoqueMin, estoqueMax))
                .and(LivroSpecification.statusIgual(status));

        Sort.Direction ordem = "desc".equalsIgnoreCase(direcao) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(ordem, ordenarPor != null ? ordenarPor : "id");

        List<Livro> livrosFiltrados = livroRepository.findAll(spec, sort);
        long countFiltered = livrosFiltrados.size();
        long countTotal = livroRepository.count();

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("countFiltered", countFiltered);
        resultado.put("countTotal", countTotal);
        resultado.put("livros", livrosFiltrados);

        return resultado;
    }

    public void processarCompra(List<Map<String, Object>> itens) {
        for (Map<String, Object> item : itens) {
            Long id = Long.valueOf(item.get("id").toString());
            Integer quantidadeComprada = Integer.valueOf(item.get("quantidade").toString());

            Livro livro = livroRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Livro ID " + id + " não encontrado."));

            if (livro.getEstoque() < quantidadeComprada) {
                throw new RuntimeException("Estoque insuficiente para o livro: " + livro.getTitulo());
            }

            livro.setEstoque(livro.getEstoque() - quantidadeComprada);
            atualizarStatusPorEstoque(livro);
            livroRepository.save(livro);
        }
    }

    public List<String> listarCategorias() {
        return livroRepository.findDistinctCategorias();
    }

    private void atualizarStatusPorEstoque(Livro livro) {
        if (livro.getEstoque() == null || livro.getEstoque() <= 0) {
            livro.setAtivo(false);
            livro.setMotivoInativacao("Estoque zerado.");
            livro.setMotivoAtivacao(null);
        } else {
            boolean foiInativadoPorEstoque = "Estoque zerado.".equals(livro.getMotivoInativacao());
            boolean estaInativo = !livro.isAtivo();

            if (estaInativo && foiInativadoPorEstoque) {
                livro.setAtivo(true);
                livro.setMotivoAtivacao("Estoque reposto, produto reativado automaticamente.");
                livro.setMotivoInativacao(null);
            }
        }
    }

    @Transactional
    public void processarCompra(Long livroId, Integer quantidade) {
        Livro livro = buscarPorId(livroId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com ID: " + livroId));

        int estoqueAtual = livro.getEstoque();

        if (estoqueAtual < quantidade) {
            throw new RuntimeException("Estoque insuficiente para o livro: " + livro.getTitulo());
        }

        int novoEstoque = estoqueAtual - quantidade;

        int atualizado = livroRepository.atualizarEstoque(livroId, novoEstoque);

        if (atualizado == 0) {
            throw new RuntimeException("Falha ao atualizar estoque do livro: " + livro.getTitulo());
        }

        livro.setEstoque(novoEstoque);
        atualizarStatusPorEstoque(livro);
    }

    @Transactional
    public Livro reporEstoque(Long livroId, Integer quantidade, String motivo) {
        Livro livro = buscarPorId(livroId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado com ID: " + livroId));

        Integer estoqueAntigo = livro.getEstoque();
        livro.setEstoque(estoqueAntigo + quantidade);
        atualizarStatusPorEstoque(livro);

        Livro livroSalvo = livroRepository.save(livro);

        Log log = new Log();
        log.setUserId(null);
        log.setUserName("Sistema");
        log.setAction("livro_reposicao_estoque");
        log.setDetails("Livro \"" + livro.getTitulo() + "\" teve estoque reposto. Antes: " + estoqueAntigo + ", Depois: " + livroSalvo.getEstoque() + ". Motivo: " + motivo);
        log.setLevel("info");
        logService.salvarLog(log);

        return livroSalvo;
    }
}
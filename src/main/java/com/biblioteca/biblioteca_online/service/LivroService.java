package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.model.Livro;
import com.biblioteca.biblioteca_online.repository.LivroRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

import com.biblioteca.biblioteca_online.specs.LivroSpecification;

import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

@Service
public class LivroService {

    private final LivroRepository livroRepository;

    public LivroService(LivroRepository livroRepository) {
        this.livroRepository = livroRepository;
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
        
        return livroRepository.save(livro);
    }

    public Optional<Livro> buscarPorId(Long id) {
        return livroRepository.findById(id);
    }

public Livro atualizar(Long id, Livro novoLivro) {
    Livro existente = livroRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Livro não encontrado"));

    existente.setTitulo(novoLivro.getTitulo());
    existente.setAutor(novoLivro.getAutor());
    existente.setEditora(novoLivro.getEditora());
    existente.setCategoria(novoLivro.getCategoria());
    existente.setPrecoCusto(novoLivro.getPrecoCusto());
    existente.setEstoque(novoLivro.getEstoque());
    existente.setDataEntrada(novoLivro.getDataEntrada());

    // Recalcular preço de venda com base no novo preço de custo
    if (novoLivro.getPrecoCusto() != null && novoLivro.getPrecoCusto().compareTo(BigDecimal.ZERO) > 0) {
        BigDecimal margemLucro = new BigDecimal("0.25"); 
        BigDecimal precoVenda = novoLivro.getPrecoCusto().multiply(BigDecimal.ONE.add(margemLucro));
        existente.setPrecoVenda(precoVenda.setScale(2, RoundingMode.HALF_UP));
    }

    atualizarStatusPorEstoque(existente);

    return livroRepository.save(existente);
}


    public void inativar(Long id, String motivo) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
        livro.setAtivo(false);
        livro.setMotivoInativacao(motivo);
        livroRepository.save(livro);
    }

    public void ativar(Long id, String motivo) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
        livro.setAtivo(true);
        livro.setMotivoAtivacao(motivo);
        livroRepository.save(livro);
    }

    public List<Livro> listarAtivos() {
        return livroRepository.findByAtivo(true);
    }

public List<Livro> consultarComFiltros(String autor, String editora, String categoria, String ordenarPor, String direcao) {
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
    String direcao
) {
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


private void atualizarStatusPorEstoque(Livro livro) {
    if (livro.getEstoque() == null || livro.getEstoque() <= 0) {
        livro.setAtivo(false);
        livro.setMotivoInativacao("Estoque zerado.");
        livro.setMotivoAtivacao(null);
    } else {
        if (!livro.isAtivo()) {
            livro.setAtivo(true);
            livro.setMotivoAtivacao("Estoque reposto, produto reativado.");
            livro.setMotivoInativacao(null);
        }
    }
}

@Transactional
public void processarCompra(Long livroId, Integer quantidade) {
    Livro livro = buscarPorId(livroId)
        .orElseThrow(() -> new RuntimeException("Livro não encontrado com ID: " + livroId));
    
    if (livro.getEstoque() < quantidade) {
        throw new RuntimeException("Estoque insuficiente para o livro: " + livro.getTitulo());
    }
    
    // Atualiza o estoque
    livro.setEstoque(livro.getEstoque() - quantidade);
    
    // Atualiza o status se necessário
    atualizarStatusPorEstoque(livro);
    
    livroRepository.save(livro);
}

}

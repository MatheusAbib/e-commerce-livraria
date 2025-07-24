package com.biblioteca.biblioteca_online.controller;

import com.biblioteca.biblioteca_online.model.Livro;
import com.biblioteca.biblioteca_online.repository.LivroRepository;
import com.biblioteca.biblioteca_online.service.LivroService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.Optional;


import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/livros")
@CrossOrigin(origins = "*") // permite chamadas do frontend (evita erro CORS)
public class LivroController {

    private final LivroService livroService;

    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }

    @GetMapping
    public ResponseEntity<List<Livro>> listarTodos() {
        return ResponseEntity.ok(livroService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<Livro> salvar(@RequestBody Livro livro) {
        return ResponseEntity.ok(livroService.salvar(livro));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Livro> atualizar(@PathVariable Long id, @RequestBody Livro livro) {
        return ResponseEntity.ok(livroService.atualizar(id, livro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
    livroService.excluir(id);
    return ResponseEntity.noContent().build();
}


    @PutMapping("/{id}/inativar")
    public ResponseEntity<Void> inativar(@PathVariable Long id, @RequestParam String motivo) {
        livroService.inativar(id, motivo);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/ativar")
    public ResponseEntity<Void> ativar(@PathVariable Long id, @RequestParam String motivo) {
        livroService.ativar(id, motivo);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<Livro>> listarAtivos() {
        return ResponseEntity.ok(livroService.listarAtivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarPorId(@PathVariable Long id) {
        return livroService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
@GetMapping("/consulta")
public ResponseEntity<Map<String, Object>> consultaComContagem(
    @RequestParam(required = false) String titulo,
    @RequestParam(required = false) String autor,
    @RequestParam(required = false) String editora,
    @RequestParam(required = false) String isbn,
    @RequestParam(required = false) String categoria,
    @RequestParam(required = false) BigDecimal precoMin,
    @RequestParam(required = false) BigDecimal precoMax,
    @RequestParam(required = false) Integer estoqueMin,
    @RequestParam(required = false) Integer estoqueMax,
    @RequestParam(required = false) String status,
    @RequestParam(required = false) String ordenarPor,
    @RequestParam(required = false) String direcao
) {
    Map<String, Object> resultado = livroService.consultarComFiltrosComContagem(
        titulo, autor, editora, isbn, categoria, precoMin, precoMax, estoqueMin, estoqueMax, status, ordenarPor, direcao);
    return ResponseEntity.ok(resultado);
}



    @Autowired
    private LivroRepository livroRepository;

@PostMapping("/change-status/{id}")
public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
    Optional<Livro> livroOpt = livroRepository.findById(id);
    if (!livroOpt.isPresent()) {
        return ResponseEntity.notFound().build();
    }

    Livro livro = livroOpt.get();

    Boolean ativo = (Boolean) payload.get("ativo");
    String motivo = (String) payload.get("motivo");

    if (ativo == null || motivo == null || motivo.trim().isEmpty()) {
        return ResponseEntity.badRequest().body("Campos 'ativo' e 'motivo' são obrigatórios.");
    }

    livro.setAtivo(ativo);

    if (ativo) {
        livro.setMotivoAtivacao(motivo);
        livro.setMotivoInativacao(null);
    } else {
        livro.setMotivoInativacao(motivo);
        livro.setMotivoAtivacao(null);
    }

    livroRepository.save(livro);

    return ResponseEntity.ok().build();
}

@PostMapping("/processar-pedido")
public ResponseEntity<?> processarPedido(@RequestBody Map<String, Object> payload) {
    try {
        List<Map<String, Object>> itens = (List<Map<String, Object>>) payload.get("itens");
        livroService.processarCompra(itens);
        return ResponseEntity.ok().build();
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

@PutMapping("/{id}/repor-estoque")
public ResponseEntity<Livro> reporEstoque(@PathVariable Long id, @RequestParam Integer quantidade, @RequestParam String motivo) {
    if (quantidade == null || quantidade <= 0) {
        return ResponseEntity.badRequest().body(null);
    }

    Optional<Livro> livroOpt = livroService.buscarPorId(id);
    if (!livroOpt.isPresent()) {
        return ResponseEntity.notFound().build();
    }

    Livro livro = livroOpt.get();
    livro.setEstoque(livro.getEstoque() + quantidade);
    livro.setMotivoAtivacao(motivo);
    livro.setMotivoInativacao(null);
    livro.setAtivo(true);

    Livro salvo = livroService.salvar(livro);
    return ResponseEntity.ok(salvo);
}



}

package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {

    List<Avaliacao> findByLivroId(Long livroId);

    List<Avaliacao> findByClienteId(Long clienteId);

    List<Avaliacao> findByPedidoId(Long pedidoId);

    @Query("SELECT AVG(a.nota) FROM Avaliacao a WHERE a.livro.id = :livroId")
    Double calcularMediaPorLivro(@Param("livroId") Long livroId);

    @Query("SELECT COUNT(a) FROM Avaliacao a WHERE a.livro.id = :livroId")
    Long contarAvaliacoesPorLivro(@Param("livroId") Long livroId);

    @Query("SELECT MAX(a.nota) FROM Avaliacao a WHERE a.livro.id = :livroId")
    Double buscarNotaMaxima(@Param("livroId") Long livroId);

    @Query("SELECT MIN(a.nota) FROM Avaliacao a WHERE a.livro.id = :livroId")
    Double buscarNotaMinima(@Param("livroId") Long livroId);

    boolean existsByClienteIdAndPedidoIdAndLivroId(Long clienteId, Long pedidoId, Long livroId);
}
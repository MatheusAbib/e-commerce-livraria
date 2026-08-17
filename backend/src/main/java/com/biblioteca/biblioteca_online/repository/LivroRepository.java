package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface LivroRepository extends JpaRepository<Livro, Long>, JpaSpecificationExecutor<Livro> {
    List<Livro> findByAtivo(boolean ativo);
    
    @Modifying
    @Transactional
    @Query(value = "UPDATE livros SET estoque = estoque - :quantidade WHERE id = :livroId", nativeQuery = true)
    int atualizarEstoque(@Param("livroId") Long livroId, @Param("quantidade") Integer quantidade);

    @Query("SELECT DISTINCT l.categoria FROM Livro l WHERE l.categoria IS NOT NULL AND l.categoria != '' ORDER BY l.categoria")
    List<String> findDistinctCategorias();
}
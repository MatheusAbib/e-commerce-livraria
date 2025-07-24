package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.model.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface LivroRepository extends JpaRepository<Livro, Long>, JpaSpecificationExecutor<Livro> {
    List<Livro> findByAtivo(boolean ativo);
}


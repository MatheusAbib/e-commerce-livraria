package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.model.Cartao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartaoRepository extends JpaRepository<Cartao, Long> {

    // Deleta todos os cartões de um cliente (se quiser em lote)
    void deleteByClienteId(Long clienteId);

    // Lista todos os cartões de um cliente
    List<Cartao> findByClienteId(Long clienteId);
}

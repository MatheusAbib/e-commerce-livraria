package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.dto.ClienteRankingDTO;
import com.biblioteca.biblioteca_online.model.Cliente;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long>, JpaSpecificationExecutor<Cliente> {
    Cliente findByEmail(String email);

@Query("SELECT new com.biblioteca.biblioteca_online.dto.ClienteRankingDTO(" +
       "c.id, c.nome, c.email, COUNT(p), COALESCE(SUM(p.valorTotal), 0)) " +
       "FROM Cliente c LEFT JOIN Pedido p ON p.cliente = c AND p.status <> 'cancelado' " +
       "GROUP BY c.id, c.nome, c.email " +
       "ORDER BY SUM(p.valorTotal) DESC")
List<ClienteRankingDTO> buscarRankingClientes();



}
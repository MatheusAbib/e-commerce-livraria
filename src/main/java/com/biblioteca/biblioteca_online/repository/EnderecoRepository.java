package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.model.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {
    List<Endereco> findByClienteId(Long clienteId);
    
    void deleteByClienteId(Long clienteId);
}
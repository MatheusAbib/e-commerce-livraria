package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long>, JpaSpecificationExecutor<Cliente> {
    Cliente findByEmail(String email); // ✅ método para login
}

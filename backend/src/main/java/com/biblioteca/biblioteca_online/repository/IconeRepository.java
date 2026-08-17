package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.model.Icone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface IconeRepository extends JpaRepository<Icone, Long> {
    
    Optional<Icone> findByNomeAndAtivoTrue(String nome);
    
    Optional<Icone> findByTipoAndAtivoTrue(String tipo);
}
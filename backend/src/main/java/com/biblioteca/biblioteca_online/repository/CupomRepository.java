package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.model.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CupomRepository extends JpaRepository<Cupom, Long> {

    @Query("SELECT c FROM Cupom c WHERE c.cliente.id = :clienteId AND c.usado = false AND c.dataExpiracao > CURRENT_TIMESTAMP")
    List<Cupom> findDisponiveisByClienteId(@Param("clienteId") Long clienteId);

    @Query("SELECT c FROM Cupom c WHERE c.cliente.id = :clienteId AND c.usado = true")
    List<Cupom> findUsadosByClienteId(@Param("clienteId") Long clienteId);

    Cupom findByCodigo(String codigo);

    @Query("SELECT c FROM Cupom c WHERE c.cliente.id = :clienteId AND c.codigo = :codigo AND c.usado = false AND c.dataExpiracao > CURRENT_TIMESTAMP")
    Cupom findDisponivelByClienteIdAndCodigo(@Param("clienteId") Long clienteId, @Param("codigo") String codigo);
}

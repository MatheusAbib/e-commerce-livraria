package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.model.Cliente;
import com.biblioteca.biblioteca_online.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;  // <-- importar aqui
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    List<Pedido> findByClienteId(Long clienteId);
    
    @Query("SELECT p FROM Pedido p WHERE p.cliente.id = :clienteId ORDER BY p.dataPedido DESC")
    List<Pedido> findPedidosPorClienteOrdenadosPorData(@Param("clienteId") Long clienteId);

    @Transactional
    void deleteByCliente(Cliente cliente);  // <-- adicione a anotação @Transactional aqui
}

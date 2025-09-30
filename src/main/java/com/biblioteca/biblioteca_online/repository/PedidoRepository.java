package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.model.Cliente;
import com.biblioteca.biblioteca_online.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    List<Pedido> findByClienteId(Long clienteId);
    
    @Query("SELECT p FROM Pedido p WHERE p.cliente.id = :clienteId ORDER BY p.dataPedido DESC")
    List<Pedido> findPedidosPorClienteOrdenadosPorData(@Param("clienteId") Long clienteId);

    @Transactional
    void deleteByCliente(Cliente cliente);

    // método para calcular lucros por livro - Lucro Total = (Preço de Venda - Preço de Custo) × Quantidade Vendida
@Query("SELECT i.livro.titulo, " +
       "SUM(i.quantidade) as quantidadeVendida, " +
       "SUM(i.quantidade * (i.precoUnitario - i.livro.precoCusto)) as lucroTotal " +
       "FROM ItemPedido i " +
       "JOIN i.pedido p " +
       "WHERE p.status IN ('ENTREGUE', 'EM_TRANSITO', 'TROCADO') " + 
       "GROUP BY i.livro.titulo " +
       "ORDER BY lucroTotal DESC")
List<Object[]> calcularLucrosPorLivro();

@Query("SELECT p FROM Pedido p JOIN FETCH p.cliente")
List<Pedido> findAllComCliente();

@Query("SELECT p.id FROM Pedido p")
List<Long> findAllIds();
}


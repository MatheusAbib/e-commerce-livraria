package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.time.LocalDate;
import java.util.List;

@Service
public class RelatorioService {

    private final PedidoRepository pedidoRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public RelatorioService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public List<Object[]> calcularLucrosPorLivro() {
        return pedidoRepository.calcularLucrosPorLivro();
    }

public List<Object[]> getVendasPorCategoria(LocalDate dataInicio, LocalDate dataFim) {
    String sql = "SELECT l.categoria, " +
                 "DATE(p.data_pedido) as dataVenda, " +
                 "SUM(i.quantidade) as totalItens, " +
                 "SUM(i.quantidade * i.preco_unitario) as valorTotal " +

                 "FROM pedidos p " +
                 "JOIN itens_pedido i ON p.id = i.pedido_id " +
                 "JOIN livros l ON i.livro_id = l.id " +

                 "WHERE p.data_pedido BETWEEN :dataInicio AND :dataFim " +
                 "AND p.status IN ('ENTREGUE', 'EM_TRANSITO', 'TROCADO') " +
                 "GROUP BY l.categoria, DATE(p.data_pedido) " +
                 "ORDER BY DATE(p.data_pedido), l.categoria";

    Query query = entityManager.createNativeQuery(sql); //execulta no banco tudo q foi feito
    
    query.setParameter("dataInicio", dataInicio.atStartOfDay()); //formata a data para 00:00:00
    
    query.setParameter("dataFim", dataFim.atTime(23, 59, 59)); //prepara a data final para 23:59:59

    return query.getResultList();
    }
}
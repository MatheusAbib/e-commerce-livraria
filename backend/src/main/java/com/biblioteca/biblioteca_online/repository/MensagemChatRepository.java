package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.model.MensagemChat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface MensagemChatRepository extends JpaRepository<MensagemChat, Long> {

    List<MensagemChat> findByPedidoIdOrderByDataEnvioAsc(Long pedidoId);

    List<MensagemChat> findByPedidoIdAndClienteIdOrderByDataEnvioAsc(Long pedidoId, Long clienteId);

    @Query("SELECT DISTINCT m.pedido.id FROM MensagemChat m ORDER BY m.pedido.id DESC")
    List<Long> findPedidosComMensagens();

    @Query("SELECT COUNT(m) FROM MensagemChat m WHERE m.pedido.id = :pedidoId AND m.doAdmin = :doAdmin AND m.lida = false")
    Long countNaoLidasPorPedido(@Param("pedidoId") Long pedidoId, @Param("doAdmin") boolean doAdmin);

    @Modifying
    @Transactional
    @Query("UPDATE MensagemChat m SET m.lida = true WHERE m.pedido.id = :pedidoId AND m.doAdmin = :doAdmin")
    void marcarComoLidas(@Param("pedidoId") Long pedidoId, @Param("doAdmin") boolean doAdmin);

    @Query("SELECT m FROM MensagemChat m WHERE m.pedido.id = :pedidoId ORDER BY m.dataEnvio DESC LIMIT 1")
    MensagemChat findUltimaMensagemPorPedido(@Param("pedidoId") Long pedidoId);

    @Query("SELECT COUNT(m) FROM MensagemChat m WHERE m.doAdmin = false AND m.lida = false")
    Long countNaoLidasAdmin();

    @Query("SELECT m FROM MensagemChat m WHERE m.pedido.id = :pedidoId AND m.atendimentoAtivo = true ORDER BY m.dataEnvio ASC")
    List<MensagemChat> findAtivasPorPedido(@Param("pedidoId") Long pedidoId);

    @Query("SELECT m FROM MensagemChat m WHERE m.atendimentoAtivo = false AND m.dataEncerramento IS NOT NULL AND m.dataEncerramento < :dataLimite")
    List<MensagemChat> findExpirados(@Param("dataLimite") LocalDateTime dataLimite);
}
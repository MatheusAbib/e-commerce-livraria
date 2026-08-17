package com.biblioteca.biblioteca_online.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mensagens_chat")
public class MensagemChat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensagem;

    @Column(name = "do_admin", nullable = false)
    private boolean doAdmin = false;

    @Column(name = "data_envio", nullable = false)
    private LocalDateTime dataEnvio = LocalDateTime.now();

    @Column(name = "lida", nullable = false)
    private boolean lida = false;

    @Column(name = "atendimento_ativo", nullable = false)
    private boolean atendimentoAtivo = true;

    @Column(name = "data_encerramento")
    private LocalDateTime dataEncerramento;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Pedido getPedido() { return pedido; }
    public void setPedido(Pedido pedido) { this.pedido = pedido; }

    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }

    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }

    public boolean isDoAdmin() { return doAdmin; }
    public void setDoAdmin(boolean doAdmin) { this.doAdmin = doAdmin; }

    public LocalDateTime getDataEnvio() { return dataEnvio; }
    public void setDataEnvio(LocalDateTime dataEnvio) { this.dataEnvio = dataEnvio; }

    public boolean isLida() { return lida; }
    public void setLida(boolean lida) { this.lida = lida; }

    public boolean isAtendimentoAtivo() { return atendimentoAtivo; }
    public void setAtendimentoAtivo(boolean atendimentoAtivo) { this.atendimentoAtivo = atendimentoAtivo; }

    public LocalDateTime getDataEncerramento() { return dataEncerramento; }
    public void setDataEncerramento(LocalDateTime dataEncerramento) { this.dataEncerramento = dataEncerramento; }
}
package com.biblioteca.biblioteca_online.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cupons")
public class Cupom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "pedido_origem_id")
    private Pedido pedidoOrigem;

    @Column(name = "porcentagem", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentagem;

    @Column(nullable = false)
    private Boolean usado = false;

    @Column(name = "data_geracao", nullable = false)
    private LocalDateTime dataGeracao;

    @Column(name = "data_expiracao", nullable = false)
    private LocalDateTime dataExpiracao;

    @Column(nullable = false)
    private String origem = "DEVOLUCAO";

    @Column(name = "data_uso")
    private LocalDateTime dataUso;

    @ManyToOne
    @JoinColumn(name = "pedido_uso_id")
    private Pedido pedidoUso;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Pedido getPedidoOrigem() {
        return pedidoOrigem;
    }

    public void setPedidoOrigem(Pedido pedidoOrigem) {
        this.pedidoOrigem = pedidoOrigem;
    }

    public BigDecimal getPorcentagem() {
        return porcentagem;
    }

    public void setPorcentagem(BigDecimal porcentagem) {
        this.porcentagem = porcentagem;
    }

    public Boolean getUsado() {
        return usado;
    }

    public void setUsado(Boolean usado) {
        this.usado = usado;
    }

    public LocalDateTime getDataGeracao() {
        return dataGeracao;
    }

    public void setDataGeracao(LocalDateTime dataGeracao) {
        this.dataGeracao = dataGeracao;
    }

    public LocalDateTime getDataExpiracao() {
        return dataExpiracao;
    }

    public void setDataExpiracao(LocalDateTime dataExpiracao) {
        this.dataExpiracao = dataExpiracao;
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }

    public LocalDateTime getDataUso() {
        return dataUso;
    }

    public void setDataUso(LocalDateTime dataUso) {
        this.dataUso = dataUso;
    }

    public Pedido getPedidoUso() {
        return pedidoUso;
    }

    public void setPedidoUso(Pedido pedidoUso) {
        this.pedidoUso = pedidoUso;
    }
}

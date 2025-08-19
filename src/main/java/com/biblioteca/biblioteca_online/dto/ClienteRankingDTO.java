package com.biblioteca.biblioteca_online.dto;

import java.math.BigDecimal;

public class ClienteRankingDTO {
    private Long id;
    private String nome;
    private String email;
    private Long quantidadePedidos;
    private BigDecimal valorTotalGasto;

public ClienteRankingDTO(Long id, String nome, String email, Long quantidadePedidos, BigDecimal valorTotalGasto) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.quantidadePedidos = quantidadePedidos;
    this.valorTotalGasto = valorTotalGasto;
}

    // getters e setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Long getQuantidadePedidos() { return quantidadePedidos; }
    public void setQuantidadePedidos(Long quantidadePedidos) { this.quantidadePedidos = quantidadePedidos; }

    public BigDecimal getValorTotalGasto() { return valorTotalGasto; }
    public void setValorTotalGasto(BigDecimal valorTotalGasto) { this.valorTotalGasto = valorTotalGasto; }
}

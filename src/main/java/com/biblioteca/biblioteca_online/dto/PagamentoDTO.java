package com.biblioteca.biblioteca_online.dto;

import java.math.BigDecimal;

public class PagamentoDTO {
    private Long cartaoId;
    private BigDecimal valor;
    private String bandeira;
    private String ultimosDigitos;
    private String nomeTitular;

    // getters e setters
    public Long getCartaoId() {
        return cartaoId;
    }
    public void setCartaoId(Long cartaoId) {
        this.cartaoId = cartaoId;
    }

    public BigDecimal getValor() {
        return valor;
    }
    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public String getBandeira() {
        return bandeira;
    }
    public void setBandeira(String bandeira) {
        this.bandeira = bandeira;
    }

    public String getUltimosDigitos() {
        return ultimosDigitos;
    }
    public void setUltimosDigitos(String ultimosDigitos) {
        this.ultimosDigitos = ultimosDigitos;
    }

    public String getNomeTitular() {
        return nomeTitular;
    }
    public void setNomeTitular(String nomeTitular) {
        this.nomeTitular = nomeTitular;
    }
}

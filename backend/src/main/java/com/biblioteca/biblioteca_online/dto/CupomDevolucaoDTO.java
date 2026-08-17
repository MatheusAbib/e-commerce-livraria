package com.biblioteca.biblioteca_online.dto;

import java.math.BigDecimal;

public class CupomDevolucaoDTO {
    private Boolean gerarCupom;
    private BigDecimal porcentagem;

    public Boolean getGerarCupom() {
        return gerarCupom;
    }

    public void setGerarCupom(Boolean gerarCupom) {
        this.gerarCupom = gerarCupom;
    }

    public BigDecimal getPorcentagem() {
        return porcentagem;
    }

    public void setPorcentagem(BigDecimal porcentagem) {
        this.porcentagem = porcentagem;
    }
}
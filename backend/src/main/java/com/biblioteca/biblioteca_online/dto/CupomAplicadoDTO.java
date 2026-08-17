package com.biblioteca.biblioteca_online.dto;

import java.math.BigDecimal;

public class CupomAplicadoDTO {
    private String codigo;
    private BigDecimal porcentagem;

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public BigDecimal getPorcentagem() {
        return porcentagem;
    }

    public void setPorcentagem(BigDecimal porcentagem) {
        this.porcentagem = porcentagem;
    }
}
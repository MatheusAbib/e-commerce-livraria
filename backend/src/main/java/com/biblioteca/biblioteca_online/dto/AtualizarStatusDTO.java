package com.biblioteca.biblioteca_online.dto;

import com.biblioteca.biblioteca_online.model.StatusPedido;

public class AtualizarStatusDTO {
    private StatusPedido novoStatus;
    private String motivoDevolucao;
    private CupomDevolucaoDTO cupom;
    private String codigoRastreamentoEnvio;
    private String codigoRastreamentoDevolucao;

    public StatusPedido getNovoStatus() {
        return novoStatus;
    }

    public void setNovoStatus(StatusPedido novoStatus) {
        this.novoStatus = novoStatus;
    }

    public String getMotivoDevolucao() {
        return motivoDevolucao;
    }

    public void setMotivoDevolucao(String motivoDevolucao) {
        this.motivoDevolucao = motivoDevolucao;
    }

    public CupomDevolucaoDTO getCupom() {
        return cupom;
    }

    public void setCupom(CupomDevolucaoDTO cupom) {
        this.cupom = cupom;
    }

    public String getCodigoRastreamentoEnvio() {
        return codigoRastreamentoEnvio;
    }

    public void setCodigoRastreamentoEnvio(String codigoRastreamentoEnvio) {
        this.codigoRastreamentoEnvio = codigoRastreamentoEnvio;
    }

    public String getCodigoRastreamentoDevolucao() {
        return codigoRastreamentoDevolucao;
    }

    public void setCodigoRastreamentoDevolucao(String codigoRastreamentoDevolucao) {
        this.codigoRastreamentoDevolucao = codigoRastreamentoDevolucao;
    }
}

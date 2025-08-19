package com.biblioteca.biblioteca_online.dto;

import com.biblioteca.biblioteca_online.model.StatusPedido;

public class AtualizarStatusDTO {
    private StatusPedido novoStatus;
    private String motivoDevolucao; 

    // Getters e Setters
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
}
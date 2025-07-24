package com.biblioteca.biblioteca_online.dto;

import com.biblioteca.biblioteca_online.model.StatusPedido;

public class AtualizarStatusDTO {
    private StatusPedido novoStatus;

    // Getters e Setters
    public StatusPedido getNovoStatus() {
        return novoStatus;
    }

    public void setNovoStatus(StatusPedido novoStatus) {
        this.novoStatus = novoStatus;
    }
}
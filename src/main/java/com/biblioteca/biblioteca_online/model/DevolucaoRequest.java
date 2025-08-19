package com.biblioteca.biblioteca_online.model;

import java.util.List;

public class DevolucaoRequest {
    private String motivo;
    private List<ItemDevolucao> itens;

    // Construtor padrão
    public DevolucaoRequest() {
    }

    // Construtor com todos os campos
    public DevolucaoRequest(String motivo, List<ItemDevolucao> itens) {
        this.motivo = motivo;
        this.itens = itens;
    }

    // Getters e Setters
    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public List<ItemDevolucao> getItens() {
        return itens;
    }

    public void setItens(List<ItemDevolucao> itens) {
        this.itens = itens;
    }

    @Override
    public String toString() {
        return "DevolucaoRequest{" +
                "motivo='" + motivo + '\'' +
                ", itens=" + itens +
                '}';
    }
}
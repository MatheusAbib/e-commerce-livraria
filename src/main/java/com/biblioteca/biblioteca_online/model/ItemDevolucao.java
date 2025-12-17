package com.biblioteca.biblioteca_online.model;

public class ItemDevolucao {
    private Long itemPedidoId;
    private Integer quantidade;

    public ItemDevolucao() {
    }

    public ItemDevolucao(Long itemPedidoId, Integer quantidade) {
        this.itemPedidoId = itemPedidoId;
        this.quantidade = quantidade;
    }

    // Getters e Setters
    public Long getItemPedidoId() {
        return itemPedidoId;
    }

    public void setItemPedidoId(Long itemPedidoId) {
        this.itemPedidoId = itemPedidoId;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    @Override
    public String toString() {
        return "ItemDevolucao{" +
                "itemPedidoId=" + itemPedidoId +
                ", quantidade=" + quantidade +
                '}';
    }
}
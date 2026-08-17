package com.biblioteca.biblioteca_online.dto;

import java.util.List;

public class DevolucaoParcialDTO {
    private String motivo;
    private List<ItemDevolucaoDTO> itens;

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }

    public List<ItemDevolucaoDTO> getItens() {
        return itens;
    }

    public void setItens(List<ItemDevolucaoDTO> itens) {
        this.itens = itens;
    }

    public static class ItemDevolucaoDTO {
        private Long itemPedidoId;
        private Integer quantidade;

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
    }
}
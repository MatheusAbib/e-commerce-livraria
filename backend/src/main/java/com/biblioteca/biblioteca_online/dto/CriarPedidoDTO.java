package com.biblioteca.biblioteca_online.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CriarPedidoDTO {
    private Long clienteId;
    private List<ItemPedidoDTO> itens;
    private Long enderecoId;
    private Long cartaoId; 
    private List<CupomAplicadoDTO> cupons = new ArrayList<>();
    private BigDecimal valorDesconto;
    private BigDecimal valorSubtotal; 
    private List<PagamentoDTO> pagamentos;

    public Long getClienteId() {
        return clienteId;
    }
    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public List<ItemPedidoDTO> getItens() {
        return itens;
    }
    public void setItens(List<ItemPedidoDTO> itens) {
        this.itens = itens;
    }

    public Long getEnderecoId() {
        return enderecoId;
    }
    public void setEnderecoId(Long enderecoId) {
        this.enderecoId = enderecoId;
    }

    public Long getCartaoId() {
        return cartaoId;
    }
    public void setCartaoId(Long cartaoId) {
        this.cartaoId = cartaoId;
    }

    public List<CupomAplicadoDTO> getCupons() {
        return cupons;
    }
    public void setCupons(List<CupomAplicadoDTO> cupons) {
        this.cupons = cupons;
    }

    public BigDecimal getValorDesconto() {
        return valorDesconto;
    }
    public void setValorDesconto(BigDecimal valorDesconto) {
        this.valorDesconto = valorDesconto;
    }

    public BigDecimal getValorSubtotal() {
        return valorSubtotal;
    }
    public void setValorSubtotal(BigDecimal valorSubtotal) {
        this.valorSubtotal = valorSubtotal;
    }

    public List<PagamentoDTO> getPagamentos() {
        return pagamentos;
    }
    public void setPagamentos(List<PagamentoDTO> pagamentos) {
        this.pagamentos = pagamentos;
    }
}
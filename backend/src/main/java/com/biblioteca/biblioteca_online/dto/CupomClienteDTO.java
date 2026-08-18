package com.biblioteca.biblioteca_online.dto;

import java.time.LocalDateTime;

public class CupomClienteDTO {
    private String codigo;
    private Double porcentagem;
    private LocalDateTime dataExpiracao;
    private Boolean usado;
    private Long pedidoId;
    private Boolean zerarFrete;
    private LocalDateTime dataUso;

    public CupomClienteDTO(String codigo, Double porcentagem, LocalDateTime dataExpiracao, Boolean usado, Long pedidoId, Boolean zerarFrete, LocalDateTime dataUso) {
        this.codigo = codigo;
        this.porcentagem = porcentagem;
        this.dataExpiracao = dataExpiracao;
        this.usado = usado;
        this.pedidoId = pedidoId;
        this.zerarFrete = zerarFrete;
        this.dataUso = dataUso;
    }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public Double getPorcentagem() { return porcentagem; }
    public void setPorcentagem(Double porcentagem) { this.porcentagem = porcentagem; }

    public LocalDateTime getDataExpiracao() { return dataExpiracao; }
    public void setDataExpiracao(LocalDateTime dataExpiracao) { this.dataExpiracao = dataExpiracao; }

    public Boolean getUsado() { return usado; }
    public void setUsado(Boolean usado) { this.usado = usado; }

    public Long getPedidoId() { return pedidoId; }
    public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }

    public Boolean getZerarFrete() { return zerarFrete; }
    public void setZerarFrete(Boolean zerarFrete) { this.zerarFrete = zerarFrete; }

    public LocalDateTime getDataUso() { return dataUso; }
    public void setDataUso(LocalDateTime dataUso) { this.dataUso = dataUso; }
}

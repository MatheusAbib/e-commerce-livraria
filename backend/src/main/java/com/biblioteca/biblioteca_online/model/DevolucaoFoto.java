package com.biblioteca.biblioteca_online.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "devolucao_fotos")
public class DevolucaoFoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pedido_devolucao_id", nullable = false)
    private Pedido pedidoDevolucao;

    @Column(name = "nome_arquivo", nullable = false)
    private String nomeArquivo;

    @Column(nullable = false)
    private String caminho;

    @Column(name = "data_upload")
    private LocalDateTime dataUpload = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Pedido getPedidoDevolucao() { return pedidoDevolucao; }
    public void setPedidoDevolucao(Pedido pedidoDevolucao) { this.pedidoDevolucao = pedidoDevolucao; }

    public String getNomeArquivo() { return nomeArquivo; }
    public void setNomeArquivo(String nomeArquivo) { this.nomeArquivo = nomeArquivo; }

    public String getCaminho() { return caminho; }
    public void setCaminho(String caminho) { this.caminho = caminho; }

    public LocalDateTime getDataUpload() { return dataUpload; }
    public void setDataUpload(LocalDateTime dataUpload) { this.dataUpload = dataUpload; }
}
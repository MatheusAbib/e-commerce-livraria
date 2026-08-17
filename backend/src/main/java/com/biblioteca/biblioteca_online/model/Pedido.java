package com.biblioteca.biblioteca_online.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties(value = {"enderecos", "cartoes", "pedidos"}, allowSetters = true)
    private Cliente cliente;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ItemPedido> itens = new ArrayList<>();

    @Column(name = "valor_subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorSubtotal = BigDecimal.ZERO;

    @Column(name = "valor_frete", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorFrete = BigDecimal.ZERO;

    @Column(name = "valor_desconto", precision = 10, scale = 2)
    private BigDecimal valorDesconto = BigDecimal.ZERO;

    @Column(name = "codigo_cupom")
    private String codigoCupom;

    @Column(name = "pedido_original_id")
    private Long pedidoOriginalId;

    @JsonIgnoreProperties("pedido")
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CupomAplicado> cuponsAplicados = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "endereco_id", nullable = true)
    private Endereco enderecoEntrega;

    @ManyToOne
    @JoinColumn(name = "cartao_id", nullable = true)
    private Cartao cartao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPedido status = StatusPedido.EM_PROCESSAMENTO;

    @Column(name = "data_pedido", nullable = false)
    private LocalDateTime dataPedido = LocalDateTime.now();

    @Column(name = "valor_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(name = "cartoes_adicionais", columnDefinition = "TEXT")
    private String cartoesAdicionais;

    @Column(name = "motivo_devolucao", columnDefinition = "TEXT")
    private String motivoDevolucao;

    @Column(name = "cupom_gerado")
    private String cupomGerado;

    @Column(name = "cupom_porcentagem")
    private BigDecimal cupomPorcentagem;

    @Column(name = "cupom_disponivel")
    private Boolean cupomDisponivel = false;

    @Column(name = "codigo_rastreamento_envio")
    private String codigoRastreamentoEnvio;

    @Column(name = "codigo_rastreamento_devolucao")
    private String codigoRastreamentoDevolucao;

    @Column(name = "reembolso_confirmado")
    private Boolean reembolsoConfirmado = false;

    @Column(name = "data_entrega")
    private LocalDateTime dataEntrega;

@OneToMany(mappedBy = "pedidoDevolucao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
@JsonIgnoreProperties("pedidoDevolucao")
private List<DevolucaoFoto> fotosDevolucao = new ArrayList<>();

    public void adicionarItem(Livro livro, Integer quantidade) {
        for (ItemPedido itemExistente : this.itens) {
            if (itemExistente.getLivro().getId().equals(livro.getId())) {
                itemExistente.setQuantidade(itemExistente.getQuantidade() + quantidade);
                return;
            }
        }
        ItemPedido item = new ItemPedido();
        item.setLivro(livro);
        item.setQuantidade(quantidade);
        item.setPrecoUnitario(livro.getPrecoVenda());
        item.setPedido(this);
        this.itens.add(item);
    }

    public void limparItens() {
        this.itens.forEach(ItemPedido::desvincularPedido);
        this.itens.clear();
    }
    
    public void adicionarCupom(String codigo, BigDecimal porcentagem, BigDecimal valorDesconto) {
        CupomAplicado cupom = new CupomAplicado();
        cupom.setPedido(this);
        cupom.setCodigo(codigo);
        cupom.setPorcentagem(porcentagem);
        cupom.setValorDesconto(valorDesconto);
        this.cuponsAplicados.add(cupom);
    }

    public String getFotoDevolucao() {
        if (fotosDevolucao != null && !fotosDevolucao.isEmpty()) {
            return fotosDevolucao.get(0).getCaminho();
        }
        return null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public List<ItemPedido> getItens() {
        return itens;
    }

    public void setItens(List<ItemPedido> itens) {
        this.itens = itens;
    }

    public BigDecimal getValorSubtotal() {
        return valorSubtotal;
    }

    public void setValorSubtotal(BigDecimal valorSubtotal) {
        this.valorSubtotal = valorSubtotal;
    }

    public BigDecimal getValorFrete() {
        return valorFrete;
    }

    public void setValorFrete(BigDecimal valorFrete) {
        this.valorFrete = valorFrete;
    }

    public BigDecimal getValorDesconto() {
        return valorDesconto;
    }

    public void setValorDesconto(BigDecimal valorDesconto) {
        this.valorDesconto = valorDesconto;
    }

    public String getCodigoCupom() {
        return codigoCupom;
    }

    public void setCodigoCupom(String codigoCupom) {
        this.codigoCupom = codigoCupom;
    }

    public Endereco getEnderecoEntrega() {
        return enderecoEntrega;
    }

    public void setEnderecoEntrega(Endereco enderecoEntrega) {
        this.enderecoEntrega = enderecoEntrega;
    }

    public Cartao getCartao() {
        return cartao;
    }

    public void setCartao(Cartao cartao) {
        this.cartao = cartao;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public void setStatus(StatusPedido status) {
        this.status = status;
    }

    public LocalDateTime getDataPedido() {
        return dataPedido;
    }

    public void setDataPedido(LocalDateTime dataPedido) {
        this.dataPedido = dataPedido;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public String getCartoesAdicionais() {
        return cartoesAdicionais;
    }

    public void setCartoesAdicionais(String cartoesAdicionais) {
        this.cartoesAdicionais = cartoesAdicionais;
    }

    public String getMotivoDevolucao() {
        return motivoDevolucao;
    }

    public void setMotivoDevolucao(String motivoDevolucao) {
        this.motivoDevolucao = motivoDevolucao;
    }

    public String getCupomGerado() {
        return cupomGerado;
    }

    public void setCupomGerado(String cupomGerado) {
        this.cupomGerado = cupomGerado;
    }

    public BigDecimal getCupomPorcentagem() {
        return cupomPorcentagem;
    }

    public void setCupomPorcentagem(BigDecimal cupomPorcentagem) {
        this.cupomPorcentagem = cupomPorcentagem;
    }

    public Boolean getCupomDisponivel() {
        return cupomDisponivel;
    }

    public void setCupomDisponivel(Boolean cupomDisponivel) {
        this.cupomDisponivel = cupomDisponivel;
    }

    public List<CupomAplicado> getCuponsAplicados() {
        return cuponsAplicados;
    }

    public void setCuponsAplicados(List<CupomAplicado> cuponsAplicados) {
        this.cuponsAplicados = cuponsAplicados;
    }

    public Long getPedidoOriginalId() {
        return pedidoOriginalId;
    }

    public void setPedidoOriginalId(Long pedidoOriginalId) {
        this.pedidoOriginalId = pedidoOriginalId;
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

    public Boolean getReembolsoConfirmado() {
        return reembolsoConfirmado;
    }

    public void setReembolsoConfirmado(Boolean reembolsoConfirmado) {
        this.reembolsoConfirmado = reembolsoConfirmado;
    }

    public LocalDateTime getDataEntrega() {
        return dataEntrega;
    }

    public void setDataEntrega(LocalDateTime dataEntrega) {
        this.dataEntrega = dataEntrega;
    }

    public List<DevolucaoFoto> getFotosDevolucao() {
        return fotosDevolucao;
    }

    public void setFotosDevolucao(List<DevolucaoFoto> fotosDevolucao) {
        this.fotosDevolucao = fotosDevolucao;
    }
}
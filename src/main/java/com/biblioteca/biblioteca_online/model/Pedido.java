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
    
    public void adicionarItem(Livro livro, Integer quantidade) {
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
    

    // Getters e Setters
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
}
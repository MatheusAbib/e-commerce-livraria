package com.biblioteca.biblioteca_online.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Endereco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String cep;
    private String rua;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;

    private String logradouro;        
    private String tipoResidencia;    
    private String tipoLogradouro; 
    private String pais;            

    private String nomeEndereco;
    public String getNomeEndereco() { return nomeEndereco; }
    public void setNomeEndereco(String nomeEndereco) { this.nomeEndereco = nomeEndereco; }

    
    @Enumerated(EnumType.STRING)
    private TipoEndereco tipo;
    
    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @JsonBackReference
    private Cliente cliente;
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCep() { return cep; }
    public void setCep(String cep) { this.cep = cep; }
    
    public String getRua() { return rua; }
    public void setRua(String rua) { this.rua = rua; }
    
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    
    public String getComplemento() { return complemento; }
    public void setComplemento(String complemento) { this.complemento = complemento; }
    
    public String getBairro() { return bairro; }
    public void setBairro(String bairro) { this.bairro = bairro; }
    
    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }
    
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getLogradouro() { return logradouro; }
    public void setLogradouro(String logradouro) { this.logradouro = logradouro; }
    
    public String getTipoResidencia() { return tipoResidencia; }
    public void setTipoResidencia(String tipoResidencia) { this.tipoResidencia = tipoResidencia; }
    
    public String getTipoLogradouro() { return tipoLogradouro; }
    public void setTipoLogradouro(String tipoLogradouro) { this.tipoLogradouro = tipoLogradouro; }
    
    public String getPais() { return pais; }
    public void setPais(String pais) { this.pais = pais; }
    
    public TipoEndereco getTipo() { return tipo; }
    public void setTipo(TipoEndereco tipo) { this.tipo = tipo; }
    
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
}

enum TipoEndereco {
    COBRANCA,
    ENTREGA
}

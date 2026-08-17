package com.biblioteca.biblioteca_online.model;

import jakarta.persistence.*;

@Entity
@Table(name = "icones")
public class Icone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 50)
    private String tipo;

    @Column(nullable = false, length = 20)
    private String formato;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String conteudo;

    @Column(nullable = false)
    private Boolean ativo = true;

    public Icone() {}

    public Icone(Long id, String nome, String tipo, String formato, String conteudo, Boolean ativo) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.formato = formato;
        this.conteudo = conteudo;
        this.ativo = ativo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getFormato() {
        return formato;
    }

    public void setFormato(String formato) {
        this.formato = formato;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }
}
package com.biblioteca.biblioteca_online.dto;

public class AvaliacaoResumoDTO {
    private Double media;
    private Long totalAvaliacoes;
    private Double notaMaxima;
    private Double notaMinima;

    public AvaliacaoResumoDTO(Double media, Long totalAvaliacoes, Double notaMaxima, Double notaMinima) {
        this.media = media;
        this.totalAvaliacoes = totalAvaliacoes;
        this.notaMaxima = notaMaxima;
        this.notaMinima = notaMinima;
    }

    public Double getMedia() {
        return media;
    }

    public void setMedia(Double media) {
        this.media = media;
    }

    public Long getTotalAvaliacoes() {
        return totalAvaliacoes;
    }

    public void setTotalAvaliacoes(Long totalAvaliacoes) {
        this.totalAvaliacoes = totalAvaliacoes;
    }

    public Double getNotaMaxima() {
        return notaMaxima;
    }

    public void setNotaMaxima(Double notaMaxima) {
        this.notaMaxima = notaMaxima;
    }

    public Double getNotaMinima() {
        return notaMinima;
    }

    public void setNotaMinima(Double notaMinima) {
        this.notaMinima = notaMinima;
    }
}
package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RelatorioService {

    private final PedidoRepository pedidoRepository;

    public RelatorioService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public List<Object[]> calcularLucrosPorLivro() {
        return pedidoRepository.calcularLucrosPorLivro();
    }
}
package com.biblioteca.biblioteca_online.controller;

import com.biblioteca.biblioteca_online.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vendas")
public class VendasController {

    private final RelatorioService relatorioService;

    @Autowired
    public VendasController(RelatorioService relatorioService) {
        this.relatorioService = relatorioService;
    }

    @GetMapping("/lucros")
    public ResponseEntity<List<Object[]>> getLucrosLivros() {
        return ResponseEntity.ok(relatorioService.calcularLucrosPorLivro());
    }
}
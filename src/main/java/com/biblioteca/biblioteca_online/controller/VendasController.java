package com.biblioteca.biblioteca_online.controller;

import com.biblioteca.biblioteca_online.service.RelatorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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

    //Busca vendas agrupadas por categoria
    @GetMapping("/categorias")
    public ResponseEntity<List<Object[]>> getVendasPorCategoria(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        
        List<Object[]> vendasPorCategoria = relatorioService.getVendasPorCategoria(dataInicio, dataFim);
        return ResponseEntity.ok(vendasPorCategoria); //apos receber do return query.getResultList(); do relatorio service, ele envia para o LoaddataByCategory no front e depois para o processCategoryData
    }
}
package com.biblioteca.biblioteca_online.controller;

import com.biblioteca.biblioteca_online.model.Pedido;
import com.biblioteca.biblioteca_online.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cupons")
public class CupomController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @PutMapping("/{codigo}/usar")
    public ResponseEntity<?> marcarCupomComoUsado(@PathVariable String codigo) {
        Pedido pedido = pedidoRepository.findByCupomGerado(codigo);
        if (pedido == null) {
            return ResponseEntity.notFound().build();
        }
        
        pedido.setCupomDisponivel(false);
        pedidoRepository.save(pedido);
        
        return ResponseEntity.ok(Map.of("mensagem", "Cupom marcado como usado"));
    }
}
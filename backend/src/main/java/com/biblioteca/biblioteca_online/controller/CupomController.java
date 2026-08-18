package com.biblioteca.biblioteca_online.controller;

import com.biblioteca.biblioteca_online.dto.CupomClienteDTO;
import com.biblioteca.biblioteca_online.service.CupomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cupons")
public class CupomController {

    @Autowired
    private CupomService cupomService;

    @PutMapping("/{codigo}/usar")
    public ResponseEntity<?> marcarCupomComoUsado(@PathVariable String codigo, @RequestParam Long clienteId) {
        try {
            cupomService.usarCupom(codigo, clienteId);
            return ResponseEntity.ok(Map.of("mensagem", "Cupom utilizado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", e.getMessage()));
        }
    }

    @GetMapping("/cliente/{clienteId}/disponiveis")
    public ResponseEntity<List<CupomClienteDTO>> listarCuponsDisponiveis(@PathVariable Long clienteId) {
        return ResponseEntity.ok(cupomService.listarCuponsDisponiveis(clienteId));
    }

@GetMapping("/cliente/{clienteId}/usados")
public ResponseEntity<List<CupomClienteDTO>> listarCuponsUsados(@PathVariable Long clienteId) {
    return ResponseEntity.ok(cupomService.listarCuponsUsados(clienteId));
}
}

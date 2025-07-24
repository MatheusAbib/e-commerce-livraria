package com.biblioteca.biblioteca_online.controller;

import com.biblioteca.biblioteca_online.dto.AtualizarStatusDTO;
import com.biblioteca.biblioteca_online.dto.CriarPedidoDTO;
import com.biblioteca.biblioteca_online.model.Pedido;
import com.biblioteca.biblioteca_online.service.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    private final PedidoService pedidoService;
    
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

   @PostMapping
    public ResponseEntity<?> criarPedido(@RequestBody CriarPedidoDTO pedidoDTO) {
        try {
            Pedido pedido = pedidoService.criarPedido(
                pedidoDTO.getClienteId(),
                pedidoDTO.getItens(),
                pedidoDTO.getEnderecoId(),
                pedidoDTO.getCartaoId()
            );
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("mensagem", e.getMessage(), "status", "erro")
            );
        }
    }

    
    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidosPorCliente(
            @RequestParam Long clienteId) {
        return ResponseEntity.ok(pedidoService.listarPedidosPorCliente(clienteId));
    }
    
@PutMapping("/{id}/status")
public ResponseEntity<Pedido> atualizarStatus(
        @PathVariable Long id,
        @RequestBody AtualizarStatusDTO statusDTO) {
    return ResponseEntity.ok(
        pedidoService.atualizarStatus(id, statusDTO.getNovoStatus())
    );
}

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPedido(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.buscarPorId(id));
    }

@DeleteMapping("/{id}")
public ResponseEntity<?> cancelarPedido(@PathVariable Long id) {
    try {
        pedidoService.cancelarPedido(id);
        return ResponseEntity.ok(Map.of("mensagem", "Pedido cancelado com sucesso"));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("mensagem", e.getMessage()));
    }
}


}
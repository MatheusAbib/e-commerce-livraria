package com.biblioteca.biblioteca_online.controller;

import com.biblioteca.biblioteca_online.dto.AtualizarStatusDTO;
import com.biblioteca.biblioteca_online.dto.CriarPedidoDTO;
import com.biblioteca.biblioteca_online.dto.PagamentoDTO;
import com.biblioteca.biblioteca_online.model.DevolucaoRequest;
import com.biblioteca.biblioteca_online.model.Pedido;
import com.biblioteca.biblioteca_online.model.StatusPedido;
import com.biblioteca.biblioteca_online.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Pedido>> listarTodosPedidos() {
        return ResponseEntity.ok(pedidoService.listarTodosPedidos());
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> listarPedidosPorCliente(@RequestParam Long clienteId) {
        return ResponseEntity.ok(pedidoService.listarPedidosPorCliente(clienteId));
    }

    @PostMapping
    public ResponseEntity<?> criarPedido(@RequestBody CriarPedidoDTO pedidoDTO) {
        try {
            Long cartaoId = null;
            List<Long> cartoesAdicionais = null;

            if (pedidoDTO.getPagamentos() != null && !pedidoDTO.getPagamentos().isEmpty()) {
                cartaoId = pedidoDTO.getPagamentos().get(0).getCartaoId();
                cartoesAdicionais = pedidoDTO.getPagamentos().stream()
                    .skip(1)
                    .map(PagamentoDTO::getCartaoId)
                    .toList();
            }

            Pedido pedido = pedidoService.criarPedido(
                pedidoDTO.getClienteId(),
                pedidoDTO.getItens(),
                pedidoDTO.getEnderecoId(),
                cartaoId,
                cartoesAdicionais,
                pedidoDTO.getValorDesconto(),
                pedidoDTO.getCodigoCupom(),
                pedidoDTO.getValorSubtotal()
            );

            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("mensagem", e.getMessage(), "status", "erro")
            );
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Pedido> atualizarStatus(
        @PathVariable Long id, 
        @RequestBody AtualizarStatusDTO statusDTO) {
        return ResponseEntity.ok(
            pedidoService.atualizarStatus(
                id, 
                statusDTO.getNovoStatus(),
                statusDTO.getMotivoDevolucao()
            )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> buscarPedido(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.buscarPorId(id));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<?> cancelarPedido(@PathVariable Long id) {
        try {
            pedidoService.cancelarPedido(id);
            return ResponseEntity.ok(Map.of("mensagem", "Pedido cancelado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("mensagem", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirPedido(@PathVariable Long id) {
        try {
            pedidoService.excluirPedido(id);
            return ResponseEntity.ok(Map.of("mensagem", "Pedido excluído com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("mensagem", "Erro ao excluir pedido: " + e.getMessage()));
        }
    }

    @GetMapping("/historico/{clienteId}")
    public ResponseEntity<List<Map<String, Object>>> getHistoricoLivros(@PathVariable Long clienteId) {
        System.out.println("🔍 Buscando histórico para cliente: " + clienteId);
        
        List<Pedido> pedidos = pedidoService.listarPedidosPorCliente(clienteId);
        System.out.println("📦 Total de pedidos encontrados: " + pedidos.size());

        // Status válidos para histórico
        List<StatusPedido> statusValidos = Arrays.asList(
            StatusPedido.ENTREGUE,
            StatusPedido.EM_TRANSITO
        );

        List<Map<String, Object>> historico = pedidos.stream()
            .filter(p -> statusValidos.contains(p.getStatus()))
            .peek(p -> System.out.println("   - Pedido ID: " + p.getId() + 
                                         ", Status: " + p.getStatus() + 
                                         ", Itens: " + p.getItens().size()))
            .flatMap(p -> p.getItens().stream())
            .map(item -> {
                Map<String, Object> dados = new HashMap<>();
                dados.put("titulo", item.getLivro().getTitulo());
                dados.put("autor", item.getLivro().getAutor());
                dados.put("categoria", item.getLivro().getCategoria());
                dados.put("quantidade", item.getQuantidade());
                dados.put("dataCompra", item.getPedido().getDataPedido());
                dados.put("status", item.getPedido().getStatus().toString());
                return dados;
            })
            .collect(Collectors.toList());

        System.out.println("✅ Itens no histórico: " + historico.size());
        return ResponseEntity.ok(historico);
    }

    @PostMapping("/{id}/devolucao")
public ResponseEntity<?> solicitarDevolucao(
    @PathVariable Long id,
    @RequestBody DevolucaoRequest devolucaoRequest) {
    
    try {
        Pedido pedido = pedidoService.solicitarDevolucao(
            id, 
            devolucaoRequest.getMotivo(),
            devolucaoRequest.getItens()
        );
        
        return ResponseEntity.ok(pedido);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(
            Map.of("mensagem", e.getMessage())
        );
    }
}
}
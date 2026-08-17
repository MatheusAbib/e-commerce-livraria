package com.biblioteca.biblioteca_online.controller;

import com.biblioteca.biblioteca_online.model.Cartao;
import com.biblioteca.biblioteca_online.model.Cliente;
import com.biblioteca.biblioteca_online.model.Log;
import com.biblioteca.biblioteca_online.repository.ClienteRepository;
import com.biblioteca.biblioteca_online.service.CartaoService;
import com.biblioteca.biblioteca_online.service.LogService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
public class CartaoController {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private CartaoService cartaoService;

    @Autowired
    private LogService logService;

    @GetMapping("/{clienteId}/cartoes")
    public ResponseEntity<?> listarCartoes(@PathVariable Long clienteId) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(clienteId);
        if (clienteOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente não encontrado");
        }
        List<Cartao> cartoes = cartaoService.listarCartoesPorCliente(clienteId);
        return ResponseEntity.ok(cartoes);
    }

    @PostMapping("/{clienteId}/cartoes")
    public ResponseEntity<?> adicionarCartao(@PathVariable Long clienteId, @RequestBody Cartao cartao) {
        Optional<Cliente> clienteOpt = clienteRepository.findById(clienteId);
        if (clienteOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente não encontrado");
        }
        Cliente cliente = clienteOpt.get();
        cartao.setCliente(cliente);
        Cartao cartaoSalvo = cartaoService.salvarCartao(clienteId, cartao);

        String ultimosDigitos = cartaoSalvo.getNumero().substring(Math.max(0, cartaoSalvo.getNumero().length() - 4));
        Log log = new Log();
        log.setUserId(clienteId);
        log.setUserName(cliente.getNome());
        log.setAction("cartao_adicionado");
        log.setDetails("Cartão " + cartaoSalvo.getBandeira() + " ****" + ultimosDigitos + " adicionado");
        log.setLevel("success");
        logService.salvarLog(log);

        return new ResponseEntity<>(cartaoSalvo, HttpStatus.CREATED);
    }

    @DeleteMapping("/{clienteId}/cartoes/{cartaoId}")
    public ResponseEntity<?> excluirCartao(@PathVariable Long clienteId, @PathVariable Long cartaoId) {
        try {
            boolean excluido = cartaoService.excluirPorId(clienteId, cartaoId);
            if (!excluido) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cartão não encontrado.");
            }
            return ResponseEntity.ok("Cartão excluído com sucesso.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{clienteId}/cartoes/{cartaoId}")
    public ResponseEntity<?> atualizarCartao(
        @PathVariable Long clienteId,
        @PathVariable Long cartaoId,
        @RequestBody Cartao cartaoAtualizado
    ) {
        try {
            Cartao cartao = cartaoService.atualizarCartao(clienteId, cartaoId, cartaoAtualizado);
            if (cartao == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cartão não encontrado.");
            }
            return ResponseEntity.ok(cartao);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
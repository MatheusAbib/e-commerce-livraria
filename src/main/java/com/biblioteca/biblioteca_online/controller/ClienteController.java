package com.biblioteca.biblioteca_online.controller;

import com.biblioteca.biblioteca_online.model.Cliente;
import com.biblioteca.biblioteca_online.model.Endereco;
import com.biblioteca.biblioteca_online.service.ClienteService;
import com.biblioteca.biblioteca_online.service.EnderecoService;

import jakarta.servlet.http.HttpSession;

import com.biblioteca.biblioteca_online.dto.ClienteRankingDTO;
import com.biblioteca.biblioteca_online.dto.LoginRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")

public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private EnderecoService enderecoService; 

    @GetMapping
    public List<Cliente> listarClientes() {
        return clienteService.listarClientes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscarCliente(@PathVariable Long id) {
        Optional<Cliente> cliente = clienteService.buscarPorId(id);
        return cliente.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // buscar endereços do cliente
    @GetMapping("/{id}/enderecos")
    public ResponseEntity<List<Endereco>> listarEnderecos(@PathVariable Long id) {
        List<Endereco> enderecos = enderecoService.listarPorCliente(id);

        return ResponseEntity.ok(enderecos);
    }

    @PostMapping
    public ResponseEntity<?> salvarCliente(@RequestBody Cliente cliente) {
        try {
            if (cliente.getEnderecos() == null || cliente.getEnderecos().size() < 2) {
                return ResponseEntity.badRequest().body("O cliente deve ter endereços de cobrança e entrega");
            }

            if (cliente.getCartoes() == null || cliente.getCartoes().isEmpty()) {
                return ResponseEntity.badRequest().body("O cliente deve ter pelo menos um cartão de crédito");
            }

            Cliente salvo = clienteService.salvarClienteComEnderecos(cliente);
            return ResponseEntity.ok(salvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarCliente(@PathVariable Long id, @RequestBody Cliente cliente) {
        try {
            Cliente atualizado = clienteService.atualizarDadosPessoais(id, cliente);
            return ResponseEntity.ok(atualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro interno do servidor");
        }
    }

    @PostMapping("/change-status/{id}")
    public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Boolean ativo = (Boolean) payload.get("ativo");
            String motivo = (String) payload.get("motivo");

            if (ativo == null || motivo == null || motivo.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Campos 'ativo' e 'motivo' são obrigatórios.");
            }

            clienteService.mudarStatusCliente(id, ativo, motivo);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> alterarSenha(@PathVariable Long id, @RequestBody Map<String, String> senhas) {
        try {
            String senha = senhas.get("senha");
            String confirmacaoSenha = senhas.get("confirmacaoSenha");
            clienteService.alterarSenha(id, senha, confirmacaoSenha);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

@GetMapping("/consulta")
public ResponseEntity<List<Cliente>> consultarClientes(
        @RequestParam(required = false) String nome,
        @RequestParam(required = false) String email,
        @RequestParam(required = false) String cpf,
        @RequestParam(required = false) String telefone,
        @RequestParam(required = false) String tipoTelefone,
        @RequestParam(required = false) String genero,
        @RequestParam(required = false) Boolean ativo) {
    
    List<Cliente> clientes = clienteService.filtrarClientes(
            nome, email, cpf, telefone, tipoTelefone, genero, ativo);
    
    return ResponseEntity.ok(clientes);
}

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirCliente(@PathVariable Long id) {
        try {
            clienteService.excluirCliente(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Cliente cliente = clienteService.login(request.getEmail(), request.getSenha());

            if (cliente == null) {
                return ResponseEntity.status(401).body(Map.of("message", "Email ou senha inválidos"));
            }

            cliente.setSenha(null); // remove a senha da resposta
            return ResponseEntity.ok(cliente);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Erro no servidor"));
        }
    }

@GetMapping("/ranking")
public ResponseEntity<?> buscarRankingClientes() {
    try {
        List<ClienteRankingDTO> ranking = clienteService.obterRankingClientes();
        return ResponseEntity.ok(ranking);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Erro ao buscar ranking: " + e.getMessage());
    }
}

    @GetMapping("/logado")
    public ResponseEntity<?> obterClienteLogado(HttpSession session) {
        Cliente clienteLogado = (Cliente) session.getAttribute("clienteLogado");

        if (clienteLogado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Cliente não está logado.");
        }

        return ResponseEntity.ok(clienteLogado);
    }

    
}

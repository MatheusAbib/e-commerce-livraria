package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.dto.ClienteRankingDTO;
import com.biblioteca.biblioteca_online.model.Cartao;
import com.biblioteca.biblioteca_online.model.Cliente;
import com.biblioteca.biblioteca_online.model.Endereco;
import com.biblioteca.biblioteca_online.model.Log;
import com.biblioteca.biblioteca_online.repository.CartaoRepository;
import com.biblioteca.biblioteca_online.repository.ClienteRepository;
import com.biblioteca.biblioteca_online.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCrypt;


import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private LogService logService;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private CartaoRepository cartaoRepository;
        
    @Autowired
    private EnderecoRepository enderecoRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Método para salvar cliente com endereços
public Cliente salvarClienteComEnderecos(Cliente cliente) {
    Cliente clienteSalvo = salvarCliente(cliente);

    if (cliente.getEnderecos() != null) {
        for (Endereco endereco : cliente.getEnderecos()) {
            endereco.setCliente(clienteSalvo);
            enderecoRepository.save(endereco);
        }
    }

    if (cliente.getCartoes() != null) {
        for (Cartao cartao : cliente.getCartoes()) {
            cartao.setCliente(clienteSalvo);
            cartaoRepository.save(cartao);
        }
    }

    // Log de cadastro
    Log log = new Log(clienteSalvo.getId(), clienteSalvo.getNome(), "cadastro", "Cliente cadastrado", "success");
    logService.salvarLog(log);

    return clienteSalvo;
}


@Transactional
public Cliente atualizarClienteComEnderecos(Long id, Cliente clienteAtualizado) {
    return clienteRepository.findById(id).map(cliente -> {
        // Atualiza os dados do cliente
        cliente.setNome(clienteAtualizado.getNome());
        cliente.setEmail(clienteAtualizado.getEmail());
        cliente.setTelefone(clienteAtualizado.getTelefone());
        cliente.setTipotelefone(clienteAtualizado.getTipotelefone());
        cliente.setCpf(clienteAtualizado.getCpf());
        cliente.setNascimento(clienteAtualizado.getNascimento());
        cliente.setGenero(clienteAtualizado.getGenero());
        

        // Desvincula os endereços antigos
        cliente.getEnderecos().clear();
        clienteRepository.save(cliente); // Persistir a limpeza

   cliente.getCartoes().clear();
        cartaoRepository.deleteByClienteId(id);
        
        // Cria e salva os novos cartões
        if (clienteAtualizado.getCartoes() != null) {
            for (Cartao c : clienteAtualizado.getCartoes()) {
                Cartao novo = new Cartao();
                novo.setNumero(c.getNumero());
                novo.setNomeTitular(c.getNomeTitular());
                novo.setBandeira(c.getBandeira());
                novo.setCvv(c.getCvv());
                novo.setDataValidade(c.getDataValidade());
                novo.setPreferencial(c.isPreferencial());
                novo.setCliente(cliente);
                cartaoRepository.save(novo);
            }
        }

        // Remove os registros do banco
        enderecoRepository.deleteByClienteId(id);

        // Cria e salva os novos endereços com TODOS os campos
        for (Endereco e : clienteAtualizado.getEnderecos()) {
            Endereco novo = new Endereco();
            novo.setCep(e.getCep());
            novo.setRua(e.getRua());
            novo.setNumero(e.getNumero());
            novo.setComplemento(e.getComplemento());
            novo.setBairro(e.getBairro());
            novo.setCidade(e.getCidade());
            novo.setEstado(e.getEstado());
            novo.setPais(e.getPais()); // Adicione esta linha
            novo.setTipoResidencia(e.getTipoResidencia()); // Adicione esta linha
            novo.setTipoLogradouro(e.getTipoLogradouro()); // Adicione esta linha
            novo.setLogradouro(e.getLogradouro()); // Adicione esta linha
            novo.setNomeEndereco(e.getNomeEndereco()); // Adicione esta linha se existir
            novo.setTipo(e.getTipo());
            novo.setCliente(cliente);

            enderecoRepository.save(novo);
        }

    return cliente;
    }).orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
}

    // Método para mudar status do cliente
    public void mudarStatusCliente(Long id, Boolean ativo, String motivo) {
        Cliente cliente = clienteRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
        
        cliente.setAtivo(ativo);
        if (ativo) {
            cliente.setMotivoAtivacao(motivo);
            cliente.setMotivoInativacao(null);
        } else {
            cliente.setMotivoInativacao(motivo);
            cliente.setMotivoAtivacao(null);
        }
        
        clienteRepository.save(cliente);
    }

    // Métodos existentes (mantidos conforme seu código original)
    public Cliente salvarCliente(Cliente cliente) {
        if (cliente.getSenha() != null && !cliente.getSenha().isEmpty()) {
            validarSenhaForte(cliente.getSenha());
            String senhaCriptografada = passwordEncoder.encode(cliente.getSenha());
            cliente.setSenha(senhaCriptografada);
        } else if (cliente.getId() != null) {
            Cliente clienteExistente = clienteRepository.findById(cliente.getId())
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));
            cliente.setSenha(clienteExistente.getSenha());
        }

        if (cliente.getDataCadastro() == null) {
            cliente.setDataCadastro(LocalDate.now());
        }

        return clienteRepository.save(cliente);
    }

    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> buscarPorId(Long id) {
        return clienteRepository.findById(id);
    }

    public void alterarSenha(Long id, String senha, String confirmacaoSenha) {
        if (senha == null || confirmacaoSenha == null) {
            throw new IllegalArgumentException("Senha e confirmação não podem ser nulas.");
        }
        if (!senha.equals(confirmacaoSenha)) {
            throw new IllegalArgumentException("Senhas não coincidem.");
        }
        validarSenhaForte(senha);

        Cliente cliente = clienteRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));

        String senhaCriptografada = passwordEncoder.encode(senha);
        cliente.setSenha(senhaCriptografada);
        clienteRepository.save(cliente);
    }

    private void validarSenhaForte(String senha) {
        if (senha == null || senha.length() < 8) {
            throw new IllegalArgumentException("A senha deve ter no mínimo 8 caracteres.");
        }
        if (!senha.matches(".*[A-Z].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos uma letra maiúscula.");
        }
        if (!senha.matches(".*[a-z].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos uma letra minúscula.");
        }
        if (!senha.matches(".*\\d.*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos um número.");
        }
        if (!senha.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            throw new IllegalArgumentException("A senha deve conter pelo menos um caractere especial.");
        }
    }

// Adicione este método no seu ClienteService
public List<Cliente> filtrarClientes(String nome, String email, String cpf, String telefone, 
                                   String tipoTelefone, String genero, Boolean ativo) {
    return clienteRepository.findAll((root, query, cb) -> {
        Predicate predicate = cb.conjunction();
        
        if (nome != null && !nome.isBlank()) {
            predicate = cb.and(predicate, 
                cb.like(cb.lower(root.get("nome")), "%" + nome.toLowerCase() + "%"));
        }
        if (email != null && !email.isBlank()) {
            predicate = cb.and(predicate, 
                cb.like(cb.lower(root.get("email")), "%" + email.toLowerCase() + "%"));
        }
        if (cpf != null && !cpf.isBlank()) {
            predicate = cb.and(predicate, 
                cb.like(root.get("cpf"), "%" + cpf + "%"));
        }
        if (telefone != null && !telefone.isBlank()) {
            predicate = cb.and(predicate, 
                cb.like(root.get("telefone"), "%" + telefone + "%"));
        }
        if (tipoTelefone != null && !tipoTelefone.isBlank()) {
            predicate = cb.and(predicate, 
                cb.equal(root.get("tipoTelefone"), tipoTelefone));
        }
        if (genero != null && !genero.isBlank()) {
            predicate = cb.and(predicate, 
                cb.equal(root.get("genero"), genero));
        }
        if (ativo != null) {
            predicate = cb.and(predicate, 
                cb.equal(root.get("ativo"), ativo));
        }
        
        return predicate;
    });
}

@Transactional
public void excluirCliente(Long id) {
    Cliente cliente = clienteRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

    logService.salvarLog(new Log(cliente.getId(), cliente.getNome(), "exclusao", "Cliente excluído", "info"));

    clienteRepository.delete(cliente);
}


public Cliente login(String email, String senha) {
    Cliente cliente = clienteRepository.findByEmail(email);

    if (cliente != null && BCrypt.checkpw(senha, cliente.getSenha())) {
        Log log = new Log(cliente.getId(), cliente.getNome(), "login", "Cliente logado com sucesso", "success");
        logService.salvarLog(log);
        return cliente;
    }

    return null;
}

@Transactional
public Cliente atualizarDadosPessoais(Long id, Cliente clienteAtualizado) {
    Cliente clienteAtual = clienteRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

    clienteAtual.setNome(clienteAtualizado.getNome());
    clienteAtual.setEmail(clienteAtualizado.getEmail());
    clienteAtual.setTelefone(clienteAtualizado.getTelefone());
    clienteAtual.setTipotelefone(clienteAtualizado.getTipotelefone());
    clienteAtual.setCpf(clienteAtualizado.getCpf());
    clienteAtual.setNascimento(clienteAtualizado.getNascimento());
    clienteAtual.setGenero(clienteAtualizado.getGenero());

    Cliente atualizado = clienteRepository.save(clienteAtual);

    Log log = new Log(id, atualizado.getNome(), "atualizacao", "Dados do cliente atualizados", "info");
    logService.salvarLog(log);

    return atualizado;
}


public void deletarCliente(Long id) {
    Optional<Cliente> clienteOpt = clienteRepository.findById(id);
    if (clienteOpt.isPresent()) {
        Cliente cliente = clienteOpt.get();
        
        // Limpa as associações
        cliente.getEnderecos().clear();
        cliente.getCartoes().clear();

        clienteRepository.delete(cliente); // o cascade agora vai funcionar
    }
}
public List<ClienteRankingDTO> obterRankingClientes() {
    List<ClienteRankingDTO> ranking = clienteRepository.buscarRankingClientes();
    ranking.forEach(r -> System.out.println(r.getNome() + " - " + r.getValorTotalGasto()));
    return ranking;
}


}
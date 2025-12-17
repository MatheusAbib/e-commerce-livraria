package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.model.Endereco;
import com.biblioteca.biblioteca_online.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository enderecoRepository;

    public Endereco salvarEndereco(Endereco endereco) {
        return enderecoRepository.save(endereco);
    }

    public List<Endereco> listarEnderecos() {
        return enderecoRepository.findAll();
    }

    public List<Endereco> listarPorCliente(Long clienteId) {
        return enderecoRepository.findByClienteId(clienteId);
    }

    public Endereco buscarPorId(Long id) {
        return enderecoRepository.findById(id).orElse(null);
    }

    public void removerEnderecosDoCliente(Long clienteId) {
        enderecoRepository.deleteByClienteId(clienteId);
    }

    public boolean atualizarNomeEndereco(Long enderecoId, String novoNome) {
        Endereco endereco = enderecoRepository.findById(enderecoId).orElse(null);
        if (endereco == null) {
            return false;
        }
        endereco.setNomeEndereco(novoNome);
        enderecoRepository.save(endereco);
        return true;
    }

    @Transactional
    public void excluir(Long id) {
        Endereco endereco = enderecoRepository.findById(id).orElse(null);
        if (endereco != null && endereco.getCliente() != null) {
            endereco.getCliente().getEnderecos().remove(endereco); 
            enderecoRepository.delete(endereco);
        }
    }
}

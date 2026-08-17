package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.model.Endereco;
import com.biblioteca.biblioteca_online.model.Log;
import com.biblioteca.biblioteca_online.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository enderecoRepository;

    @Autowired
    private LogService logService;

    public Endereco salvarEndereco(Endereco endereco) {
        Endereco salvo = enderecoRepository.save(endereco);
        if (salvo.getCliente() != null) {
            Log log = new Log();
            log.setUserId(salvo.getCliente().getId());
            log.setUserName(salvo.getCliente().getNome());
            log.setAction("endereco_adicionado");
            log.setDetails("Endereço \"" + salvo.getNomeEndereco() + "\" adicionado: " + 
                salvo.getRua() + ", " + salvo.getNumero() + " - " + 
                salvo.getCidade() + "/" + salvo.getEstado());
            log.setLevel("info");
            logService.salvarLog(log);
        }
        return salvo;
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
        String nomeAntigo = endereco.getNomeEndereco();
        endereco.setNomeEndereco(novoNome);
        enderecoRepository.save(endereco);
        if (endereco.getCliente() != null) {
            Log log = new Log();
            log.setUserId(endereco.getCliente().getId());
            log.setUserName(endereco.getCliente().getNome());
            log.setAction("endereco_editado");
            log.setDetails("Endereço \"" + nomeAntigo + "\" teve o nome alterado para \"" + novoNome + "\"");
            log.setLevel("info");
            logService.salvarLog(log);
        }
        return true;
    }

    @Transactional
    public void excluir(Long id) {
        Endereco endereco = enderecoRepository.findById(id).orElse(null);
        if (endereco != null && endereco.getCliente() != null) {
            String nomeEndereco = endereco.getNomeEndereco();
            Long clienteId = endereco.getCliente().getId();
            String nomeCliente = endereco.getCliente().getNome();
            endereco.getCliente().getEnderecos().remove(endereco);
            enderecoRepository.delete(endereco);
            Log log = new Log();
            log.setUserId(clienteId);
            log.setUserName(nomeCliente);
            log.setAction("endereco_removido");
            log.setDetails("Endereço \"" + nomeEndereco + "\" removido");
            log.setLevel("info");
            logService.salvarLog(log);
        }
    }
}
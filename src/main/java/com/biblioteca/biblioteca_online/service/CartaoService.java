package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.model.Cartao;
import com.biblioteca.biblioteca_online.model.Cliente;
import com.biblioteca.biblioteca_online.repository.CartaoRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartaoService {

    @Autowired
    private CartaoRepository cartaoRepository;

    public List<Cartao> listarCartoesPorCliente(Long clienteId) {
        return cartaoRepository.findAll().stream()
                .filter(c -> c.getCliente() != null && c.getCliente().getId().equals(clienteId))
                .toList();
    }

    public Cartao salvarCartao(Long clienteId, Cartao cartao) {
        return cartaoRepository.save(cartao);
    }

@Transactional
public boolean excluirPorId(Long clienteId, Long cartaoId) {
    Optional<Cartao> cartaoOpt = cartaoRepository.findById(cartaoId);

    if (cartaoOpt.isEmpty()) {
        return false;
    }

    Cartao cartao = cartaoOpt.get();

    if (cartao.getCliente() == null || !cartao.getCliente().getId().equals(clienteId)) {
        throw new IllegalArgumentException("Cartão não pertence ao cliente.");
    }

    Cliente cliente = cartao.getCliente();
    cliente.getCartoes().remove(cartao);  
    cartao.setCliente(null);         

    cartaoRepository.delete(cartao);
    return true;
}

@Transactional
public Cartao atualizarCartao(Long clienteId, Long cartaoId, Cartao cartaoAtualizado) {
    Optional<Cartao> cartaoOpt = cartaoRepository.findById(cartaoId);

    if (cartaoOpt.isEmpty()) {
        return null;
    }

    Cartao cartao = cartaoOpt.get();

    if (cartao.getCliente() == null || !cartao.getCliente().getId().equals(clienteId)) {
        throw new IllegalArgumentException("Cartão não pertence ao cliente.");
    }

    cartao.setNumero(cartaoAtualizado.getNumero());
    cartao.setNomeTitular(cartaoAtualizado.getNomeTitular());
    cartao.setBandeira(cartaoAtualizado.getBandeira());
    cartao.setCvv(cartaoAtualizado.getCvv());
    cartao.setDataValidade(cartaoAtualizado.getDataValidade());
    cartao.setPreferencial(cartaoAtualizado.isPreferencial());

    return cartaoRepository.save(cartao);
}


}

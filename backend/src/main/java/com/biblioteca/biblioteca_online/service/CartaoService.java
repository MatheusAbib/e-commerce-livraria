package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.model.Cartao;
import com.biblioteca.biblioteca_online.model.Cliente;
import com.biblioteca.biblioteca_online.model.Log;
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

    @Autowired
    private LogService logService;

    public List<Cartao> listarCartoesPorCliente(Long clienteId) {
        return cartaoRepository.findAll().stream()
                .filter(c -> c.getCliente() != null && c.getCliente().getId().equals(clienteId))
                .toList();
    }

    public Cartao salvarCartao(Long clienteId, Cartao cartao) {
        Cartao salvo = cartaoRepository.save(cartao);
        if (salvo.getCliente() != null) {
            String ultimosDigitos = salvo.getNumero().substring(Math.max(0, salvo.getNumero().length() - 4));
            Log log = new Log();
            log.setUserId(salvo.getCliente().getId());
            log.setUserName(salvo.getCliente().getNome());
            log.setAction("cartao_adicionado");
            log.setDetails("Cartão " + salvo.getBandeira() + " ****" + ultimosDigitos + " adicionado");
            log.setLevel("info");
            logService.salvarLog(log);
        }
        return salvo;
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

        String bandeira = cartao.getBandeira();
        String ultimosDigitos = cartao.getNumero().substring(Math.max(0, cartao.getNumero().length() - 4));
        String nomeCliente = cartao.getCliente().getNome();
        Long idCliente = cartao.getCliente().getId();

        Cliente cliente = cartao.getCliente();
        cliente.getCartoes().remove(cartao);
        cartao.setCliente(null);

        cartaoRepository.delete(cartao);

        Log log = new Log();
        log.setUserId(idCliente);
        log.setUserName(nomeCliente);
        log.setAction("cartao_removido");
        log.setDetails("Cartão " + bandeira + " ****" + ultimosDigitos + " removido");
        log.setLevel("info");
        logService.salvarLog(log);

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

        String bandeira = cartao.getBandeira();
        String ultimosDigitos = cartao.getNumero().substring(Math.max(0, cartao.getNumero().length() - 4));
        String validadeAntiga = cartao.getDataValidade();
        String titularAntigo = cartao.getNomeTitular();

        cartao.setNumero(cartaoAtualizado.getNumero());
        cartao.setNomeTitular(cartaoAtualizado.getNomeTitular());
        cartao.setBandeira(cartaoAtualizado.getBandeira());
        cartao.setCvv(cartaoAtualizado.getCvv());
        cartao.setDataValidade(cartaoAtualizado.getDataValidade());
        cartao.setPreferencial(cartaoAtualizado.isPreferencial());

        Cartao salvo = cartaoRepository.save(cartao);

        StringBuilder detalhes = new StringBuilder();
        detalhes.append("Cartão ").append(bandeira).append(" ****").append(ultimosDigitos).append(" editado: ");
        if (!validadeAntiga.equals(salvo.getDataValidade())) {
            detalhes.append("Validade ").append(validadeAntiga).append(" → ").append(salvo.getDataValidade()).append("; ");
        }
        if (!titularAntigo.equals(salvo.getNomeTitular())) {
            detalhes.append("Titular ").append(titularAntigo).append(" → ").append(salvo.getNomeTitular());
        }

        Log log = new Log();
        log.setUserId(clienteId);
        log.setUserName(cartao.getCliente().getNome());
        log.setAction("cartao_editado");
        log.setDetails(detalhes.toString());
        log.setLevel("info");
        logService.salvarLog(log);

        return salvo;
    }
}
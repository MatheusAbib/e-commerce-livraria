package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.dto.CupomClienteDTO;
import com.biblioteca.biblioteca_online.model.Cliente;
import com.biblioteca.biblioteca_online.model.Cupom;
import com.biblioteca.biblioteca_online.model.Pedido;
import com.biblioteca.biblioteca_online.repository.CupomRepository;
import com.biblioteca.biblioteca_online.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CupomService {

    @Autowired
    private CupomRepository cupomRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

public List<CupomClienteDTO> listarCuponsDisponiveis(Long clienteId) {
    List<Cupom> cupons = cupomRepository.findDisponiveisByClienteId(clienteId);
    List<CupomClienteDTO> result = new ArrayList<>();

    for (Cupom cupom : cupons) {
        result.add(new CupomClienteDTO(
            cupom.getCodigo(),
            cupom.getPorcentagem().doubleValue(),
            cupom.getDataExpiracao(),
            false,
            cupom.getPedidoOrigem() != null ? cupom.getPedidoOrigem().getId() : null,
            false,
            null
        ));
    }

    return result;
}

public List<CupomClienteDTO> listarCuponsUsados(Long clienteId) {
    List<Cupom> cupons = cupomRepository.findUsadosByClienteId(clienteId);
    List<CupomClienteDTO> result = new ArrayList<>();

    for (Cupom cupom : cupons) {
        result.add(new CupomClienteDTO(
            cupom.getCodigo(),
            cupom.getPorcentagem().doubleValue(),
            cupom.getDataExpiracao(),
            true,
            cupom.getPedidoOrigem() != null ? cupom.getPedidoOrigem().getId() : null,
            false,
            cupom.getDataUso()
        ));
    }

    return result;
}

    public boolean usarCupom(String codigo, Long clienteId) {
        Cupom cupom = cupomRepository.findDisponivelByClienteIdAndCodigo(clienteId, codigo);

        if (cupom == null) {
            throw new RuntimeException("Cupom não encontrado ou já utilizado");
        }

        if (cupom.getDataExpiracao().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cupom expirado");
        }

        cupom.setUsado(true);
        cupom.setDataUso(LocalDateTime.now());
        cupomRepository.save(cupom);
        return true;
    }

public void gerarCupomDevolucao(Long pedidoId, Long clienteId, String codigo, BigDecimal porcentagem) {
    Cupom cupom = new Cupom();
    cupom.setCodigo(codigo);
    cupom.setCliente(new Cliente());
    cupom.getCliente().setId(clienteId);
    cupom.setPedidoOrigem(new Pedido());
    cupom.getPedidoOrigem().setId(pedidoId);
    cupom.setPorcentagem(porcentagem);
    cupom.setUsado(false);
    cupom.setDataGeracao(LocalDateTime.now());
    cupom.setDataExpiracao(LocalDateTime.now().plusDays(30));
    cupom.setOrigem("DEVOLUCAO");

    cupomRepository.save(cupom);
}
}

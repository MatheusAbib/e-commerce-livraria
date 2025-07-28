package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.dto.ItemPedidoDTO;
import com.biblioteca.biblioteca_online.model.*;
import com.biblioteca.biblioteca_online.repository.ClienteRepository;
import com.biblioteca.biblioteca_online.repository.PedidoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

import static java.util.Map.entry;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final LivroService livroService;
    private final ClienteService clienteService;
    private final ClienteRepository clienteRepository;

    @Autowired
private LogService logService;



    @Autowired
    public PedidoService(PedidoRepository pedidoRepository,
                         LivroService livroService,
                         ClienteService clienteService,
                         ClienteRepository clienteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.livroService = livroService;
        this.clienteService = clienteService;
        this.clienteRepository = clienteRepository;
    }

@Transactional
public Pedido criarPedido(Long clienteId, List<ItemPedidoDTO> itensDTO,
                          Long enderecoId, Long cartaoId,
                          BigDecimal valorDesconto, String codigoCupom,
                          BigDecimal valorSubtotalRecebido) {

    Cliente cliente = clienteService.buscarPorId(clienteId)
        .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

    Pedido pedido = new Pedido();
    pedido.setCliente(cliente);

    for (ItemPedidoDTO itemDTO : itensDTO) {
        Livro livro = livroService.buscarPorId(itemDTO.getLivroId())
            .orElseThrow(() -> new RuntimeException("Livro não encontrado: " + itemDTO.getLivroId()));

        if (livro.getEstoque() < itemDTO.getQuantidade()) {
            throw new RuntimeException("Estoque insuficiente para o livro: " + livro.getTitulo());
        }

        pedido.adicionarItem(livro, itemDTO.getQuantidade());
    }

    Endereco endereco = cliente.getEnderecos().stream()
        .filter(e -> e.getId().equals(enderecoId))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

    Cartao cartao = cliente.getCartoes().stream()
        .filter(c -> c.getId().equals(cartaoId))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Cartão não encontrado"));

    pedido.setEnderecoEntrega(endereco);
    pedido.setCartao(cartao);

    BigDecimal subtotal = valorSubtotalRecebido != null ? valorSubtotalRecebido :
        pedido.getItens().stream()
              .map(item -> item.getPrecoUnitario().multiply(BigDecimal.valueOf(item.getQuantidade())))
              .reduce(BigDecimal.ZERO, BigDecimal::add);

    pedido.setValorSubtotal(subtotal);

    BigDecimal frete = calcularFrete(subtotal, endereco.getEstado());
    pedido.setValorFrete(frete);

    BigDecimal descontoAplicado = valorDesconto != null ? valorDesconto : BigDecimal.ZERO;
    pedido.setValorDesconto(descontoAplicado);
    pedido.setCodigoCupom(codigoCupom);

    BigDecimal totalFinal = subtotal.subtract(descontoAplicado).add(frete);
    pedido.setValorTotal(totalFinal);

    Pedido pedidoSalvo = pedidoRepository.save(pedido);
    atualizarEstoque(pedidoSalvo);

    // 🔽 ADICIONANDO LOG DA COMPRA 🔽
    try {
Log log = new Log();
log.setUserId(cliente.getId());      // ID do usuário que comprou
log.setUserName(cliente.getNome());  // Nome do usuário que comprou
log.setAction("compra");
log.setDetails("Compra realizada no valor de R$ " + pedido.getValorTotal());
log.setLevel("success");
logService.salvarLog(log);

    } catch (Exception e) {
        System.err.println("Erro ao registrar log de compra: " + e.getMessage());
    }

    return pedidoSalvo;
}


    private void atualizarEstoque(Pedido pedido) {
        for (ItemPedido item : pedido.getItens()) {
            livroService.processarCompra(
                item.getLivro().getId(),
                item.getQuantidade()
            );
        }
    }

    @Transactional
    public Pedido atualizarStatus(Long pedidoId, StatusPedido novoStatus) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarPedidosPorCliente(Long clienteId) {
        return pedidoRepository.findPedidosPorClienteOrdenadosPorData(clienteId);
    }

    public Pedido buscarPorId(Long id) {
        return pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
    }

    @Transactional
    public void excluirClienteComPedidos(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
            .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        pedidoRepository.deleteByCliente(cliente);
        clienteRepository.delete(cliente);
    }

    private BigDecimal calcularFrete(BigDecimal subtotal, String estado) {
        Map<String, BigDecimal> acrescimosPorEstado = Map.ofEntries(
            entry("AC", new BigDecimal("9.75")),
            entry("AL", new BigDecimal("6.45")),
            entry("AP", new BigDecimal("10.00")),
            entry("AM", new BigDecimal("9.85")),
            entry("BA", new BigDecimal("5.30")),
            entry("CE", new BigDecimal("6.10")),
            entry("DF", new BigDecimal("4.25")),
            entry("ES", new BigDecimal("3.15")),
            entry("GO", new BigDecimal("4.55")),
            entry("MA", new BigDecimal("7.60")),
            entry("MT", new BigDecimal("6.90")),
            entry("MS", new BigDecimal("5.40")),
            entry("MG", new BigDecimal("4.75")),
            entry("PA", new BigDecimal("9.05")),
            entry("PB", new BigDecimal("6.85")),
            entry("PR", new BigDecimal("2.50")),
            entry("PE", new BigDecimal("6.30")),
            entry("PI", new BigDecimal("7.20")),
            entry("RJ", new BigDecimal("5.00")),
            entry("RN", new BigDecimal("6.55")),
            entry("RS", new BigDecimal("2.90")),
            entry("RO", new BigDecimal("8.35")),
            entry("RR", new BigDecimal("10.00")),
            entry("SC", new BigDecimal("2.75")),
            entry("SP", new BigDecimal("3.95")),
            entry("SE", new BigDecimal("5.25")),
            entry("TO", new BigDecimal("7.10"))
        );

        BigDecimal freteBase = new BigDecimal("15.00");

        if (subtotal.compareTo(new BigDecimal("300")) >= 0) {
            return BigDecimal.ZERO; // frete grátis
        }

        BigDecimal adicional = new BigDecimal(subtotal.divide(new BigDecimal("70"), 0, RoundingMode.DOWN).intValue() * 7);
        freteBase = freteBase.add(adicional);

        BigDecimal acrescimoEstado = acrescimosPorEstado.getOrDefault(estado.toUpperCase(), BigDecimal.ZERO);

        return freteBase.add(acrescimoEstado);
    }

    @Transactional
    public void cancelarPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedido.setStatus(StatusPedido.CANCELADO);
        pedidoRepository.save(pedido);
    }

    @Transactional
    public void excluirPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        pedidoRepository.delete(pedido);
    }
public List<Pedido> listarTodosPedidos() {
    return pedidoRepository.findAll();
}

    
}
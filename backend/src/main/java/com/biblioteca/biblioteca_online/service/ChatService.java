package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.model.MensagemChat;
import com.biblioteca.biblioteca_online.model.Pedido;
import com.biblioteca.biblioteca_online.model.Cliente;
import com.biblioteca.biblioteca_online.repository.MensagemChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    @Autowired
    private MensagemChatRepository mensagemChatRepository;

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private ClienteService clienteService;

    @Transactional
    public MensagemChat enviarMensagemCliente(Long pedidoId, Long clienteId, String mensagem) {
        Pedido pedido = pedidoService.buscarPorId(pedidoId);
        Cliente cliente = clienteService.buscarPorId(clienteId)
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        MensagemChat msg = new MensagemChat();
        msg.setPedido(pedido);
        msg.setCliente(cliente);
        msg.setMensagem(mensagem);
        msg.setDoAdmin(false);
        msg.setDataEnvio(LocalDateTime.now());
        msg.setLida(false);

        return mensagemChatRepository.save(msg);
    }

    @Transactional
    public MensagemChat enviarMensagemAdmin(Long pedidoId, String mensagem) {
        Pedido pedido = pedidoService.buscarPorId(pedidoId);
        Cliente cliente = pedido.getCliente();

        MensagemChat msg = new MensagemChat();
        msg.setPedido(pedido);
        msg.setCliente(cliente);
        msg.setMensagem(mensagem);
        msg.setDoAdmin(true);
        msg.setDataEnvio(LocalDateTime.now());
        msg.setLida(false);

        return mensagemChatRepository.save(msg);
    }

    public List<MensagemChat> buscarMensagensPorPedido(Long pedidoId) {
        return mensagemChatRepository.findByPedidoIdOrderByDataEnvioAsc(pedidoId);
    }

    public List<MensagemChat> buscarMensagensCliente(Long pedidoId, Long clienteId) {
        return mensagemChatRepository.findByPedidoIdAndClienteIdOrderByDataEnvioAsc(pedidoId, clienteId);
    }

    public List<Long> listarPedidosComMensagens() {
        return mensagemChatRepository.findPedidosComMensagens();
    }

    public Long contarNaoLidasCliente(Long pedidoId) {
        return mensagemChatRepository.countNaoLidasPorPedido(pedidoId, true);
    }


    @Transactional
    public void marcarMensagensClienteComoLidas(Long pedidoId) {
        mensagemChatRepository.marcarComoLidas(pedidoId, true);
    }

    @Transactional
    public void marcarMensagensAdminComoLidas(Long pedidoId) {
        mensagemChatRepository.marcarComoLidas(pedidoId, false);
    }

    public String getUltimaMensagem(Long pedidoId) {
        MensagemChat ultima = mensagemChatRepository.findUltimaMensagemPorPedido(pedidoId);
        return ultima != null ? ultima.getMensagem() : null;
    }

public Map<Long, Map<String, Object>> getResumoConversas() {
    List<Long> pedidosIds = mensagemChatRepository.findPedidosComMensagens();
    Map<Long, Map<String, Object>> resumo = new HashMap<>();

    for (Long pedidoId : pedidosIds) {
        Map<String, Object> info = new HashMap<>();
        Pedido pedido = pedidoService.buscarPorId(pedidoId);
        info.put("clienteNome", pedido.getCliente().getNome());
        info.put("clienteId", pedido.getCliente().getId());
        info.put("status", pedido.getStatus().name());
        info.put("dataPedido", pedido.getDataPedido());
        info.put("ultimaMensagem", getUltimaMensagem(pedidoId));
        info.put("naoLidasAdmin", contarNaoLidasAdmin(pedidoId));
        
        List<MensagemChat> mensagens = mensagemChatRepository.findByPedidoIdOrderByDataEnvioAsc(pedidoId);
        boolean ativo = true;
        if (!mensagens.isEmpty()) {
            ativo = mensagens.get(0).isAtendimentoAtivo();
        }
        info.put("ativo", ativo);
        
        resumo.put(pedidoId, info);
    }

    return resumo;
}
    public boolean isAtendimentoAtivo(Long pedidoId) {
        List<MensagemChat> mensagens = mensagemChatRepository.findByPedidoIdOrderByDataEnvioAsc(pedidoId);
        if (mensagens.isEmpty()) {
            return true;
        }
        return mensagens.get(0).isAtendimentoAtivo();
    }

    public Long getTotalNaoLidasAdmin() {
    return mensagemChatRepository.countNaoLidasAdmin();
}

@Transactional
public void reativarAtendimento(Long pedidoId) {
    List<MensagemChat> mensagens = mensagemChatRepository.findByPedidoIdOrderByDataEnvioAsc(pedidoId);
    for (MensagemChat msg : mensagens) {
        msg.setAtendimentoAtivo(true);
    }
    mensagemChatRepository.saveAll(mensagens);
}

public Map<String, List<Map<String, Object>>> getConversasCliente(Long clienteId) {
    List<Long> pedidosIds = mensagemChatRepository.findPedidosComMensagens();
    List<Map<String, Object>> ativos = new ArrayList<>();
    List<Map<String, Object>> encerrados = new ArrayList<>();

    for (Long pedidoId : pedidosIds) {
        Pedido pedido = pedidoService.buscarPorId(pedidoId);
        if (!pedido.getCliente().getId().equals(clienteId)) continue;

        List<MensagemChat> mensagens = mensagemChatRepository.findByPedidoIdOrderByDataEnvioAsc(pedidoId);
        if (mensagens.isEmpty()) continue;

        Map<String, Object> chatInfo = new HashMap<>();
        chatInfo.put("pedidoId", pedidoId);
        chatInfo.put("ultimaMensagem", mensagens.get(mensagens.size() - 1).getMensagem());
        chatInfo.put("naoLidas", mensagemChatRepository.countNaoLidasPorPedido(pedidoId, true));
        
        boolean ativo = mensagens.get(0).isAtendimentoAtivo();
        chatInfo.put("ativo", ativo);

        if (ativo) {
            ativos.add(chatInfo);
        } else {
            encerrados.add(chatInfo);
        }
    }

    Map<String, List<Map<String, Object>>> resultado = new HashMap<>();
    resultado.put("ativos", ativos);
    resultado.put("encerrados", encerrados);
    return resultado;
}

@Transactional
public void encerrarAtendimento(Long pedidoId) {
    List<MensagemChat> mensagens = mensagemChatRepository.findByPedidoIdOrderByDataEnvioAsc(pedidoId);
    for (MensagemChat msg : mensagens) {
        msg.setAtendimentoAtivo(false);
        msg.setDataEncerramento(LocalDateTime.now());
    }
    mensagemChatRepository.saveAll(mensagens);
}

@Transactional
public void deletarChatsExpirados() {
    LocalDateTime umaHoraAtras = LocalDateTime.now().minusMinutes(5);
    List<MensagemChat> expirados = mensagemChatRepository.findExpirados(umaHoraAtras);
    if (!expirados.isEmpty()) {
        mensagemChatRepository.deleteAll(expirados);
    }
}

public Long contarNaoLidasAdmin(Long pedidoId) {
    return mensagemChatRepository.countNaoLidasPorPedido(pedidoId, false);
}
}
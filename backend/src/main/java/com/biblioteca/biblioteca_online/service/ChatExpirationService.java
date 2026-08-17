package com.biblioteca.biblioteca_online.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ChatExpirationService {

    @Autowired
    private ChatService chatService;

    @Scheduled(fixedRate = 60000)
    public void deletarChatsExpirados() {
        chatService.deletarChatsExpirados();
    }
}
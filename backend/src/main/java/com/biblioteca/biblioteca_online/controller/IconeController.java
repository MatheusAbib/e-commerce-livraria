package com.biblioteca.biblioteca_online.controller;

import com.biblioteca.biblioteca_online.model.Icone;
import com.biblioteca.biblioteca_online.service.IconeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/icones")
public class IconeController {

    @Autowired
    private IconeService iconeService;

    @GetMapping(value = "/favicon")
    public ResponseEntity<String> getFavicon() {
        String conteudo = iconeService.getConteudoPorNome("favicon");
        if (conteudo != null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf("image/svg+xml"))
                    .body(conteudo);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping(value = "/logo")
    public ResponseEntity<byte[]> getLogo() {
        String base64 = iconeService.getConteudoPorNome("pilha-livros");
        if (base64 != null) {
            byte[] imageBytes = java.util.Base64.getDecoder().decode(base64);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(imageBytes);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{nome}")
    public ResponseEntity<String> getIconePorNome(@PathVariable String nome) {
        String conteudo = iconeService.getConteudoPorNome(nome);
        if (conteudo != null) {
            return ResponseEntity.ok(conteudo);
        }
        return ResponseEntity.notFound().build();
    }
}
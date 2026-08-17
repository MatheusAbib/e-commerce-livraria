package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.model.Icone;
import com.biblioteca.biblioteca_online.repository.IconeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class IconeService {

    @Autowired
    private IconeRepository iconeRepository;

    public Optional<Icone> buscarPorNome(String nome) {
        return iconeRepository.findByNomeAndAtivoTrue(nome);
    }

    public Optional<Icone> buscarPorTipo(String tipo) {
        return iconeRepository.findByTipoAndAtivoTrue(tipo);
    }

    public String getConteudoPorNome(String nome) {
        return iconeRepository.findByNomeAndAtivoTrue(nome)
                .map(Icone::getConteudo)
                .orElse(null);
    }

    public Icone salvar(Icone icone) {
        return iconeRepository.save(icone);
    }
}
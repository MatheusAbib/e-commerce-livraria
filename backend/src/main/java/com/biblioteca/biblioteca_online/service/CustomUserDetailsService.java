package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.model.Cliente;
import com.biblioteca.biblioteca_online.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Cliente cliente = clienteRepository.findByEmail(email);
        
        if (cliente == null) {
            throw new UsernameNotFoundException("Usuário não encontrado: " + email);
        }

        if (cliente.getEmail() == null || cliente.getEmail().isEmpty()) {
            throw new UsernameNotFoundException("Usuário sem email válido: " + email);
        }

        String senha = cliente.getSenha();
        if (senha == null || senha.isEmpty()) {
            senha = "DUMMY_PASSWORD_NOT_USED";
        }

        String role = "ROLE_" + (cliente.getPerfil() != null ? cliente.getPerfil() : "CLIENTE");
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);

        return new User(
            cliente.getEmail(),
            senha,
            Collections.singletonList(authority)
        );
    }
}
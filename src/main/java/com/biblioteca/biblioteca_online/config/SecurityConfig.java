package com.biblioteca.biblioteca_online.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())       // desabilita CSRF para facilitar testes
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()) // libera todas as requisições sem login
            .httpBasic(Customizer.withDefaults()); 

        return http.build();
    }
}

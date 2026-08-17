package com.biblioteca.biblioteca_online;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BibliotecaOnlineApplication {

    public static void main(String[] args) {
        SpringApplication.run(BibliotecaOnlineApplication.class, args);
    }
}
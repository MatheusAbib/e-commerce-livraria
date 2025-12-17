package com.biblioteca.biblioteca_online.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Entity
@Table(name = "logs")
public class Log {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;       // id do cliente que fez a ação
    private String userName;   
    private String action;     // ação realizada (ex: "cadastro", "login", "atualizacao", "exclusao")
    private String details;    
    private String level;      // nível do log (ex: "info", "success", "error")

    private LocalDateTime timestamp;

    private static final DateTimeFormatter ISO_FORMATTER = 
        DateTimeFormatter.ISO_DATE_TIME;

    public Log() {
        this.timestamp = LocalDateTime.now();
    }

    public Log(Long userId, String userName, String action, 
               String details, String level) {
        this.userId = userId;
        this.userName = userName;
        this.action = action;
        this.details = details;
        this.level = level;
        this.timestamp = LocalDateTime.now();
    }

    // Getters e setters padrão
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public LocalDateTime getTimestamp() { return timestamp; }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setTimestamp(String timestampString) {
        try {
            this.timestamp = LocalDateTime.parse(timestampString, ISO_FORMATTER);
        } catch (DateTimeParseException e) {
            this.timestamp = LocalDateTime.now();
        }
    }

    // Método para obter timestamp formatado (opcional)
    public String getFormattedTimestamp() {
        return timestamp.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));
    }

    @Override
    public String toString() {
        return "Log{" +
                "id=" + id +
                ", userId=" + userId +
                ", userName='" + userName + '\'' +
                ", action='" + action + '\'' +
                ", details='" + details + '\'' +
                ", level='" + level + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
package com.biblioteca.biblioteca_online.controller;

import com.biblioteca.biblioteca_online.model.Log;
import com.biblioteca.biblioteca_online.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    @Autowired
    private LogService logService;

    @GetMapping
    public List<Log> listarLogs() {
        return logService.listarLogs();
    }

@PostMapping("/registrar")
public ResponseEntity<?> registrarLog(@RequestBody Log log) {
    ZoneId zone = ZoneId.of("America/Sao_Paulo");
    
    if (log.getTimestamp() == null) {
        log.setTimestamp(LocalDateTime.now(zone));
    } else {
        ZonedDateTime zonedDt = log.getTimestamp().atZone(zone);
        log.setTimestamp(zonedDt.toLocalDateTime());
    }
    
    logService.salvarLog(log);
    return ResponseEntity.ok().build();
}
}
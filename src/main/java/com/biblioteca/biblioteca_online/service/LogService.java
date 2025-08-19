package com.biblioteca.biblioteca_online.service;

import com.biblioteca.biblioteca_online.model.Log;
import com.biblioteca.biblioteca_online.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    public Log salvarLog(Log log) {
        return logRepository.save(log);
    }

    public List<Log> listarLogs() {
        return logRepository.findAll();
    }
}
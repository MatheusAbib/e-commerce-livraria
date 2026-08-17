package com.biblioteca.biblioteca_online.repository;

import com.biblioteca.biblioteca_online.model.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {
    List<Log> findByUserIdOrderByTimestampDesc(Long userId);
}
package com.retinaai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.management.ManagementFactory;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping({"/api/health", "/health", "/api/ping", "/ping"})
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> health = new LinkedHashMap<>();
        health.put("status", "UP");
        health.put("service", "OCTalyze Spring Boot Backend");
        health.put("version", "1.0.0");
        health.put("timestamp", Instant.now().toString());
        health.put("uptimeSeconds", ManagementFactory.getRuntimeMXBean().getUptime() / 1000);
        health.put("message", "Service is healthy and awake on Render");
        return ResponseEntity.ok(health);
    }
}

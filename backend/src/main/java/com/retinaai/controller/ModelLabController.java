package com.retinaai.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/models")
public class ModelLabController {

    @Value("${app.ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public ResponseEntity<Map> listModels() {
        try {
            Map response = restTemplate.getForObject(aiServiceUrl + "/models", Map.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "production_model", "Attention U-Net",
                "message", "AI service catalog in local fallback mode."
            ));
        }
    }
}

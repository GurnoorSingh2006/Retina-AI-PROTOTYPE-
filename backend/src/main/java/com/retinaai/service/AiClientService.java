package com.retinaai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiClientService {

    @Value("${app.ai-service.url:http://localhost:8000}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> analyzeOctImage(MultipartFile file) {
        String endpoint = aiServiceUrl + "/predict";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "oct_scan.png";
                }
            };
            body.add("file", fileResource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.exchange(endpoint, HttpMethod.POST, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
            throw new RuntimeException("AI inference returned non-success status: " + response.getStatusCode());
        } catch (Exception e) {
            log.error("AI service inference error on endpoint {}: {}", endpoint, e.getMessage());
            throw new RuntimeException("AI inference service communication failed: " + e.getMessage(), e);
        }
    }
}

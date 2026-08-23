package com.retinaai.service;

import com.retinaai.dto.DashboardStatsDto;
import com.retinaai.dto.ScanResponse;
import com.retinaai.dto.ScanSummaryDto;
import com.retinaai.entity.Prediction;
import com.retinaai.entity.Scan;
import com.retinaai.entity.User;
import com.retinaai.repository.ReportRepository;
import com.retinaai.repository.ScanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ScanService {

    private final ScanRepository scanRepository;
    private final ReportRepository reportRepository;
    private final AiClientService aiClientService;

    @Transactional
    public ScanResponse processAndSaveScan(MultipartFile file, User user) {
        Map<String, Object> aiResult = aiClientService.analyzeOctImage(file);

        String predictionClass = (String) aiResult.getOrDefault("prediction", "NORMAL");
        Double confidence = ((Number) aiResult.getOrDefault("confidence", 0.0)).doubleValue();
        String priority = (String) aiResult.getOrDefault("screening_priority", "LOW");
        String modelName = (String) aiResult.getOrDefault("model", "Attention U-Net");
        String heatmapImage = (String) aiResult.get("heatmap_image");
        String overlayImage = (String) aiResult.get("overlay_image");
        String attentionFinding = (String) aiResult.get("attention_finding");
        String description = (String) aiResult.get("description");

        String originalImageB64 = null;
        try {
            originalImageB64 = "data:" + file.getContentType() + ";base64," +
                    Base64.getEncoder().encodeToString(file.getBytes());
        } catch (Exception ignored) {}

        Scan scan = Scan.builder()
                .user(user)
                .originalFilename(file.getOriginalFilename())
                .prediction(predictionClass)
                .confidence(confidence)
                .modelName(modelName)
                .priority(priority)
                .heatmapImage(heatmapImage)
                .overlayImage(overlayImage)
                .originalImage(originalImageB64)
                .attentionFinding(attentionFinding)
                .description(description)
                .build();

        Map<String, Object> probsMap = (Map<String, Object>) aiResult.get("probabilities");
        if (probsMap != null) {
            Prediction prediction = Prediction.builder()
                    .scan(scan)
                    .normalProbability(((Number) probsMap.getOrDefault("NORMAL", 0.0)).doubleValue())
                    .dmeProbability(((Number) probsMap.getOrDefault("DME", 0.0)).doubleValue())
                    .drusenProbability(((Number) probsMap.getOrDefault("DRUSEN", 0.0)).doubleValue())
                    .cnvProbability(((Number) probsMap.getOrDefault("CNV", 0.0)).doubleValue())
                    .build();
            scan.setProbabilityDistribution(prediction);
        }

        scan = scanRepository.save(scan);
        return toScanResponse(scan);
    }

    @Transactional(readOnly = true)
    public List<ScanSummaryDto> getUserScans(User user) {
        return scanRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toScanSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ScanResponse getScanById(Long scanId, User user) {
        Scan scan = scanRepository.findById(scanId)
                .orElseThrow(() -> new IllegalArgumentException("Scan not found with id: " + scanId));

        if (!scan.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized access to requested scan.");
        }

        return toScanResponse(scan);
    }

    @Transactional
    public void deleteScan(Long scanId, User user) {
        Scan scan = scanRepository.findById(scanId)
                .orElseThrow(() -> new IllegalArgumentException("Scan not found with id: " + scanId));

        if (!scan.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized access to requested scan.");
        }

        scanRepository.delete(scan);
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(User user) {
        Long userId = user.getId();
        long totalScans = scanRepository.countByUserId(userId);
        long highPriority = scanRepository.countByUserIdAndPriority(userId, "HIGH");
        long normalScans = scanRepository.countByUserIdAndPrediction(userId, "NORMAL");
        long reportsGenerated = reportRepository.countByScanUserId(userId);

        Map<String, Long> conditionDistribution = new HashMap<>();
        conditionDistribution.put("NORMAL", scanRepository.countByUserIdAndPrediction(userId, "NORMAL"));
        conditionDistribution.put("DME", scanRepository.countByUserIdAndPrediction(userId, "DME"));
        conditionDistribution.put("DRUSEN", scanRepository.countByUserIdAndPrediction(userId, "DRUSEN"));
        conditionDistribution.put("CNV", scanRepository.countByUserIdAndPrediction(userId, "CNV"));

        List<ScanSummaryDto> recentScans = scanRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .limit(5)
                .map(this::toScanSummaryDto)
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .totalScans(totalScans)
                .highPriorityScans(highPriority)
                .normalScans(normalScans)
                .reportsGenerated(reportsGenerated)
                .conditionDistribution(conditionDistribution)
                .recentScans(recentScans)
                .build();
    }

    public ScanResponse toScanResponse(Scan scan) {
        Map<String, Double> probs = new HashMap<>();
        if (scan.getProbabilityDistribution() != null) {
            probs.put("NORMAL", scan.getProbabilityDistribution().getNormalProbability());
            probs.put("DME", scan.getProbabilityDistribution().getDmeProbability());
            probs.put("DRUSEN", scan.getProbabilityDistribution().getDrusenProbability());
            probs.put("CNV", scan.getProbabilityDistribution().getCnvProbability());
        }

        return ScanResponse.builder()
                .id(scan.getId())
                .originalFilename(scan.getOriginalFilename())
                .prediction(scan.getPrediction())
                .confidence(scan.getConfidence())
                .priority(scan.getPriority())
                .modelName(scan.getModelName())
                .description(scan.getDescription())
                .attentionFinding(scan.getAttentionFinding())
                .heatmapImage(scan.getHeatmapImage())
                .overlayImage(scan.getOverlayImage())
                .originalImage(scan.getOriginalImage())
                .probabilities(probs)
                .hasReport(scan.getReport() != null)
                .reportNumber(scan.getReport() != null ? scan.getReport().getReportNumber() : null)
                .createdAt(scan.getCreatedAt())
                .build();
    }

    private ScanSummaryDto toScanSummaryDto(Scan scan) {
        return ScanSummaryDto.builder()
                .id(scan.getId())
                .originalFilename(scan.getOriginalFilename())
                .prediction(scan.getPrediction())
                .confidence(scan.getConfidence())
                .priority(scan.getPriority())
                .modelName(scan.getModelName())
                .createdAt(scan.getCreatedAt())
                .build();
    }
}

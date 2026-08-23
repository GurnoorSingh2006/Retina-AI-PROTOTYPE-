package com.retinaai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanResponse {
    private Long id;
    private String originalFilename;
    private String prediction;
    private Double confidence;
    private String priority;
    private String modelName;
    private String description;
    private String attentionFinding;
    private String heatmapImage;
    private String overlayImage;
    private String originalImage;
    private Map<String, Double> probabilities;
    private Boolean hasReport;
    private String reportNumber;
    private LocalDateTime createdAt;
}

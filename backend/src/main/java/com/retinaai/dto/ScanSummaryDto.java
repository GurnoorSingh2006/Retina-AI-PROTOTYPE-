package com.retinaai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScanSummaryDto {
    private Long id;
    private String originalFilename;
    private String prediction;
    private Double confidence;
    private String priority;
    private String modelName;
    private LocalDateTime createdAt;
}

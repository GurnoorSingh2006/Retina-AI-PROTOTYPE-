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
public class ReportResponse {
    private Long id;
    private String reportNumber;
    private Long scanId;
    private String clinicalSummary;
    private String status;
    private ScanResponse scanData;
    private LocalDateTime createdAt;
}

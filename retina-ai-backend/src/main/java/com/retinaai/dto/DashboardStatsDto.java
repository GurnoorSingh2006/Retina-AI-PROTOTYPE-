package com.retinaai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalScans;
    private long highPriorityScans;
    private long normalScans;
    private long reportsGenerated;
    private Map<String, Long> conditionDistribution;
    private List<ScanSummaryDto> recentScans;
}

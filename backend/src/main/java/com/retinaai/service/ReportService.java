package com.retinaai.service;

import com.retinaai.dto.ReportResponse;
import com.retinaai.entity.Report;
import com.retinaai.entity.Scan;
import com.retinaai.entity.User;
import com.retinaai.repository.ReportRepository;
import com.retinaai.repository.ScanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ScanRepository scanRepository;
    private final ScanService scanService;

    @Transactional
    public ReportResponse generateReportForScan(Long scanId, User user) {
        Scan scan = scanRepository.findById(scanId)
                .orElseThrow(() -> new IllegalArgumentException("Scan not found: " + scanId));

        if (!scan.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized scan access.");
        }

        Report report = reportRepository.findByScanId(scanId).orElse(null);
        if (report == null) {
            String reportNo = "RPT-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + scanId;
            String clinicalSummary = generateClinicalSummary(scan);

            report = Report.builder()
                    .scan(scan)
                    .reportNumber(reportNo)
                    .clinicalSummary(clinicalSummary)
                    .status("FINAL")
                    .build();

            report = reportRepository.save(report);
        }

        return toReportResponse(report, scan);
    }

    @Transactional(readOnly = true)
    public ReportResponse getReportByScanId(Long scanId, User user) {
        Scan scan = scanRepository.findById(scanId)
                .orElseThrow(() -> new IllegalArgumentException("Scan not found: " + scanId));

        if (!scan.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized scan access.");
        }

        Report report = reportRepository.findByScanId(scanId)
                .orElseThrow(() -> new IllegalArgumentException("Report has not yet been generated for scan: " + scanId));

        return toReportResponse(report, scan);
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getUserReports(User user) {
        return reportRepository.findByScanUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(r -> toReportResponse(r, r.getScan()))
                .collect(Collectors.toList());
    }

    private String generateClinicalSummary(Scan scan) {
        return String.format("Automated screening analysis performed using %s with input dimensions (128, 128, 3). " +
                        "Classification yielded %s with %.1f%% confidence, categorized as %s screening priority. %s",
                scan.getModelName(),
                scan.getPrediction(),
                scan.getConfidence() * 100,
                scan.getPriority(),
                scan.getAttentionFinding() != null ? scan.getAttentionFinding() : "");
    }

    private ReportResponse toReportResponse(Report report, Scan scan) {
        return ReportResponse.builder()
                .id(report.getId())
                .reportNumber(report.getReportNumber())
                .scanId(scan.getId())
                .clinicalSummary(report.getClinicalSummary())
                .status(report.getStatus())
                .scanData(scanService.toScanResponse(scan))
                .createdAt(report.getCreatedAt())
                .build();
    }
}

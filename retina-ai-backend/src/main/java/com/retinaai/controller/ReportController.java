package com.retinaai.controller;

import com.retinaai.dto.ReportResponse;
import com.retinaai.entity.User;
import com.retinaai.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/{scanId}")
    public ResponseEntity<ReportResponse> generateReport(
            @PathVariable Long scanId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reportService.generateReportForScan(scanId, user));
    }

    @GetMapping("/scan/{scanId}")
    public ResponseEntity<ReportResponse> getReportByScanId(
            @PathVariable Long scanId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reportService.getReportByScanId(scanId, user));
    }

    @GetMapping
    public ResponseEntity<List<ReportResponse>> getUserReports(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reportService.getUserReports(user));
    }
}

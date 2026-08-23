package com.retinaai.controller;

import com.retinaai.dto.DashboardStatsDto;
import com.retinaai.dto.ScanResponse;
import com.retinaai.dto.ScanSummaryDto;
import com.retinaai.entity.User;
import com.retinaai.service.ScanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/scans")
@RequiredArgsConstructor
public class ScanController {

    private final ScanService scanService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ScanResponse> uploadAndAnalyzeScan(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(scanService.processAndSaveScan(file, user));
    }

    @GetMapping
    public ResponseEntity<List<ScanSummaryDto>> getUserScans(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(scanService.getUserScans(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScanResponse> getScanById(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(scanService.getScanById(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScan(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        scanService.deleteScan(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(scanService.getDashboardStats(user));
    }
}

package com.retinaai.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "scans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Scan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "original_filename")
    private String originalFilename;

    @Column(nullable = false)
    private String prediction;

    @Column(nullable = false)
    private Double confidence;

    @Column(name = "model_name", nullable = false)
    private String modelName;

    @Column(nullable = false)
    private String priority;

    @Lob
    @Column(name = "heatmap_image", columnDefinition = "TEXT")
    private String heatmapImage;

    @Lob
    @Column(name = "overlay_image", columnDefinition = "TEXT")
    private String overlayImage;

    @Lob
    @Column(name = "original_image", columnDefinition = "TEXT")
    private String originalImage;

    @Column(name = "attention_finding", length = 1000)
    private String attentionFinding;

    @Column(name = "description", length = 1000)
    private String description;

    @OneToOne(mappedBy = "scan", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Prediction probabilityDistribution;

    @OneToOne(mappedBy = "scan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Report report;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

package com.retinaai.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "scan_id", nullable = false)
    private Scan scan;

    @Column(name = "normal_probability", nullable = false)
    private Double normalProbability;

    @Column(name = "dme_probability", nullable = false)
    private Double dmeProbability;

    @Column(name = "drusen_probability", nullable = false)
    private Double drusenProbability;

    @Column(name = "cnv_probability", nullable = false)
    private Double cnvProbability;
}

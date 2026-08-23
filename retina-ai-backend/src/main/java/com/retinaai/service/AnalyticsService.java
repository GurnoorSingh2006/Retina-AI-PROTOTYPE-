package com.retinaai.service;

import com.retinaai.dto.AnalyticsDto;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {

    public AnalyticsDto getAnalytics() {
        Map<String, Integer> classDist = new LinkedHashMap<>();
        classDist.put("NORMAL", 26315);
        classDist.put("DME", 11347);
        classDist.put("DRUSEN", 8616);
        classDist.put("CNV", 37215);

        List<Map<String, Object>> models = new ArrayList<>();
        models.add(Map.of("model", "Deep CNN", "accuracy", 74.0, "loss", 0.6899, "type", "Baseline"));
        models.add(Map.of("model", "FCN", "accuracy", 85.0, "loss", 0.4936, "type", "Convolutional"));
        models.add(Map.of("model", "Baseline U-Net", "accuracy", 85.0, "loss", 0.4070, "type", "Encoder-Decoder"));
        models.add(Map.of("model", "U-Net + Dropout", "accuracy", 85.8, "loss", 0.3850, "type", "Regularized"));
        models.add(Map.of("model", "U-Net + Increased Filters", "accuracy", 86.8, "loss", 0.3620, "type", "Scaled"));
        models.add(Map.of("model", "U-Net + Residual Blocks", "accuracy", 88.6, "loss", 0.3410, "type", "Residual"));
        models.add(Map.of("model", "ResU-Net (Evaluated)", "accuracy", 90.5, "loss", 0.3124, "type", "Deep Residual"));
        models.add(Map.of("model", "Attention U-Net (Production)", "accuracy", 90.4, "loss", 0.2980, "type", "Attention Gated"));

        Map<String, Object> highlights = new HashMap<>();
        highlights.put("productionModel", "Attention U-Net");
        highlights.put("championAccuracy", "90.4%");
        highlights.put("bestResUnetAccuracy", "90.5%");
        highlights.put("totalDatasetScans", 83493);
        highlights.put("experimentalSubset", "5,000 images balanced across 4 classes");

        return AnalyticsDto.builder()
                .datasetName("OCT2017 Retinal Coherence Dataset")
                .totalOriginalImages(83493)
                .classDistribution(classDist)
                .modelComparison(models)
                .researchHighlights(highlights)
                .build();
    }
}

# RetinaAI - Hackathon Product Specification

**Tagline**: *See Beyond the Scan.*  
**Track**: AI Healthcare / Computer Vision / Medical Diagnostics  

---

## 1. Problem Statement
Retinal diseases such as **Choroidal Neovascularization (CNV)**, **Diabetic Macular Edema (DME)**, and **Drusen (Age-Related Macular Degeneration)** are leading causes of preventable global blindness. Early diagnosis via **Optical Coherence Tomography (OCT)** is essential for vision preservation. However:
- High volume of B-scans overwhelms specialized ophthalmologists.
- Traditional "black box" deep learning classifiers lack interpretability, causing clinician distrust.
- Primary clinics lack immediate access to subspecialty retinal diagnosis.

---

## 2. Our Solution: RetinaAI
RetinaAI transforms cutting-edge research into a deployable clinical decision support platform:
1. **Explainable AI**: Gated Attention U-Net and Grad-CAM spatial colormaps highlight precise pathological structures (fluid spaces, RPE disruption, subretinal neovascular membranes).
2. **Transparent Architecture**: Evaluates and benchmarks 8 distinct neural network architectures (Baseline CNN to Attention U-Net).
3. **Clinical Priority Triage**: Automated rule-based triage flags urgent abnormal scans (`HIGH`), intermediate AMD findings (`REVIEW`), and normal retinas (`LOW`).
4. **Instant PDF Reporting**: Generates standardized clinical screening reports with confidence metrics, attention maps, and legal disclaimers.

---

## 3. Empirical Research & Model Benchmarks (Source: Major project.ipynb)

| Architecture | Parameters | Reported Accuracy | Loss | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Deep CNN** | 5,111,492 | 74.0% | 0.6899 | Research Baseline |
| **FCN** | 1,572,548 | 85.0% | 0.4936 | Convolutional Baseline |
| **Baseline U-Net** | ~14.8M | 85.0% | 0.4070 | Encoder-Decoder |
| **U-Net + Dropout** | ~15.2M | 85.8% | 0.3850 | Regularized |
| **U-Net + Increased Filters** | ~34.1M | 86.8% | 0.3620 | Capacity Scaled |
| **U-Net + Residual Blocks** | ~19.8M | 88.6% | 0.3410 | Residual Skip |
| **ResU-Net (Evaluated)** | ~28.2M | 90.5% | 0.3124 | Deep Residual |
| **Attention U-Net (Production)** | ~31.4M | **90.4%** | **0.2980** | **Deployed Production** |

---

## 4. Live Demo Flow for Judges
1. **Landing Page**: View value proposition, technology breakdown, and supported retinal conditions.
2. **1-Click Demo Login**: Sign in as Dr. Sarah Lin (Retinal Specialist).
3. **Upload & Analyze**: Drag and drop an OCT scan or use 1-click sample pathology loader.
4. **Real-Time Inference**: Observe live pipeline (Upload -> Normalization -> Inference -> Grad-CAM).
5. **Interactive Result Studio**: Toggle between Original OCT, Heatmap, and Overlay with diagnostic finding rationale.
6. **Download Clinical Report**: Generate clinical PDF report in one click.
7. **Explore Model Lab & Analytics**: Inspect all 8 models and dataset distributions.

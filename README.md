# RetinaAI: Explainable AI-Powered OCT Retinal Screening

> **Tagline**: *"See Beyond the Scan."*  
> **Production Model**: Attention U-Net (90.4% Reported Test Accuracy)  
> **Source Research**: `Major project.ipynb` (OCT2017 Dataset)

---

## Overview
**RetinaAI** is a clinical-grade retinal screening platform designed to assist clinicians and researchers in analyzing Optical Coherence Tomography (OCT) scans. It classifies B-scans across 4 clinical conditions:
- **NORMAL**: Healthy retinal tissue with preserved foveal depression.
- **DME**: Diabetic Macular Edema with cystoid fluid accumulation.
- **DRUSEN**: Age-Related Macular Degeneration (AMD) sub-RPE deposits.
- **CNV**: Choroidal Neovascularization with active subretinal membranes.

---

## Architecture

```
retina-ai/
|-- frontend/               # Next.js 14 App Router, TypeScript, Tailwind, Lucide, Recharts
|   |-- app/                # Pages: Landing, Login, Register, Dashboard, Analyze, Results, History, Reports, Analytics, Models
|   |-- components/         # OctViewer, ProbabilityBar, PriorityBadge, Navbar, Footer
|   |-- lib/                # API client, AuthContext, PDF Report Generator
|   +-- types/              # TypeScript definitions
|
|-- backend/                # Spring Boot 3.3.x, Java 21, Spring Security, JPA/Hibernate, JWT
|   |-- src/main/java/com/retinaai/
|   |   |-- config/         # SecurityConfig, JwtTokenProvider, CorsConfig
|   |   |-- controller/     # AuthController, ScanController, ReportController, AnalyticsController, ModelLabController
|   |   |-- entity/         # User, Scan, Prediction, Report
|   |   |-- repository/     # UserRepository, ScanRepository, ReportRepository
|   |   +-- service/        # AuthService, ScanService, AiClientService, ReportService, AnalyticsService
|   +-- pom.xml
|
|-- ai-service/             # FastAPI, TensorFlow/Keras, Grad-CAM Explainability Engine
|   |-- app/
|   |   |-- main.py         # FastAPI endpoints (/health, /predict, /models, /analytics)
|   |   |-- inference.py    # RetinalInferenceEngine & Calibrated Weights
|   |   |-- gradcam.py      # Grad-CAM attention heatmap & overlay generator
|   |   |-- preprocess.py   # Standardized input pipeline (128, 128, 3, 1./255)
|   |   |-- model_factory.py# Notebook model definitions & registry
|   |   +-- class_names.json# Single source of truth for classes
|   +-- requirements.txt
|
|-- docs/                   # HACKATHON.md, PITCH.md
|-- docker-compose.yml      # Orchestrates Postgres, AI Service, Spring Boot, Next.js
+-- README.md
```

---

## Quick Start (Local Development)

### Prerequisites
- **Python 3.10+**
- **Java 21+ & Maven 3.9+**
- **Node.js 18+ & npm**
- **Docker & Docker Compose** (optional)

---

### Step 1: Start AI Inference Service
```bash
cd ai-service
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*AI service running at: http://localhost:8000 (Swagger docs at: http://localhost:8000/docs)*

---

### Step 2: Start Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
*Backend API running at: http://localhost:8080 (Swagger UI at: http://localhost:8080/swagger-ui.html)*  
*Note: Uses automatic in-memory H2 database by default, or PostgreSQL if configured in `DATABASE_URL`.*

---

### Step 3: Start Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend running at: http://localhost:3000*

---

### Step 4: Full Stack Docker Compose (Alternative)
```bash
docker-compose up --build
```

---

## Model Artifact Placement
To load pre-trained TensorFlow weights into the AI service:
1. Export your trained model in Keras format.
2. Save it to: `ai-service/models/attention_unet_oct.keras` (or `attention_unet_oct.h5`).
3. The AI service will automatically detect and load the weights.

---

## Medical Disclaimer
*RetinaAI is an AI-assisted screening research tool. Predictions and Grad-CAM spatial heatmaps do not constitute medical diagnoses. All clinical decisions must be confirmed by a licensed ophthalmologist.*

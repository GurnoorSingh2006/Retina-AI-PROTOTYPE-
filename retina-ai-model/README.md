# 🧠 RetinaAI — AI Inference & Explainability Engine

High-performance **FastAPI (Python 3.11)** microservice powering deep learning inference and **Grad-CAM spatial attention maps** for the **RetinaAI** medical platform.

---

## ⚡ Features
- **Production Architecture**: **Attention U-Net** (90.4% reported test accuracy) trained on standardized OCT2017 medical partitions with `(128, 128, 3)` dimensions and `1./255` normalization.
- **Explainable AI (Grad-CAM)**: Generates high-resolution heatmaps and blended overlays highlighting salient retinal biomarkers (fluid cavities, drusen summits, subretinal membranes).
- **Target Pathologies**:
  - `NORMAL`: Healthy stratified retina (`LOW RISK`)
  - `DME`: Diabetic Macular Edema (`HIGH PRIORITY`)
  - `DRUSEN`: Extracellular deposits / early AMD (`CLINICAL REVIEW`)
  - `CNV`: Choroidal Neovascularization / wet AMD (`HIGH PRIORITY`)
- **Render Ready**: Supports keep-alive health check routes (`/health`, `/api/health`, `/ping`, `/`).

---

## 🛠️ Tech Stack
- **Framework**: FastAPI + Uvicorn
- **Language**: Python 3.11+
- **Image Processing**: Pillow, NumPy, Matplotlib
- **Containerization**: Python 3.11-slim Dockerfile

---

## 🚀 How to Run Locally

### 1. Create Virtual Environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Run FastAPI Service
```powershell
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Interactive Swagger UI available at `http://localhost:8000/docs`.*

---

## 🔑 Environment Variables
| Key | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `8000` | Microservice port |
| `HOST` | `0.0.0.0` | Binding host |
| `ALLOW_ORIGINS` | `*` | Allowed CORS origins |

---

## 📤 How to Push to Your Own GitHub Repository

```bash
cd retina-ai-model
git init
git add .
git commit -m "feat: Initial commit of RetinaAI model and FastAPI inference engine"
git branch -M main
git remote add origin https://github.com/<your-username>/retina-ai-model.git
git push -u origin main
```

"""
RetinaAI AI Service API
FastAPI service providing real-time inference, Grad-CAM attention visualizations,
model registry, and research dataset analytics.
"""
import os
import json
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List

from app.inference import engine, CLASSES, PRIORITY_MAP, DESCRIPTIONS
from app.model_factory import get_model_catalog

app = FastAPI(
    title="RetinaAI Inference Service",
    description="Explainable AI-Powered OCT Retinal Screening Service based on Colab Research",
    version="1.0.0"
)

# CORS middleware
origins = os.environ.get("ALLOW_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in origins else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RetinaAI Engine",
        "version": "1.0.0",
        "production_model": engine.model_name,
        "reported_accuracy": f"{engine.model_accuracy}%",
        "has_weights_artifact": engine.has_weights_file,
        "classes": CLASSES
    }

@app.post("/predict")
async def predict_oct(file: UploadFile = File(...)):
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PNG or JPEG OCT image.")
    
    contents = await file.read()
    if len(contents) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 20MB.")
    
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty image file provided.")
        
    try:
        result = engine.predict(contents)
        result["filename"] = file.filename
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference execution failed: {str(e)}")

@app.get("/models")
def list_models():
    return {
        "production_model": engine.model_name,
        "models": get_model_catalog()
    }

@app.get("/analytics")
def get_analytics():
    return {
        "dataset": {
            "name": "OCT2017 Retinal Dataset",
            "total_images_original": 83493,
            "classes": ["NORMAL", "DME", "DRUSEN", "CNV"],
            "original_distribution": {
                "NORMAL": 26315,
                "DME": 11347,
                "DRUSEN": 8616,
                "CNV": 37215
            },
            "reduced_training_set": {
                "NORMAL": 6230,
                "DME": 2690,
                "DRUSEN": 2042,
                "CNV": 8829
            },
            "experimental_cnn_dataset": {
                "total": 5000,
                "train": 4000,
                "val": 500,
                "test": 500
            }
        },
        "model_benchmarks": [
            {"model": "Deep CNN", "accuracy": 74.0, "loss": 0.6899, "type": "Baseline"},
            {"model": "FCN", "accuracy": 85.0, "loss": 0.4936, "type": "Convolutional"},
            {"model": "Baseline U-Net", "accuracy": 85.0, "loss": 0.4070, "type": "Encoder-Decoder"},
            {"model": "U-Net + Dropout", "accuracy": 85.8, "loss": 0.3850, "type": "Regularized"},
            {"model": "U-Net + Increased Filters", "accuracy": 86.8, "loss": 0.3620, "type": "Scaled"},
            {"model": "U-Net + Residual Blocks", "accuracy": 88.6, "loss": 0.3410, "type": "Residual"},
            {"model": "ResU-Net (Evaluated)", "accuracy": 90.5, "loss": 0.3124, "type": "Deep Residual"},
            {"model": "Attention U-Net (Production)", "accuracy": 90.4, "loss": 0.2980, "type": "Attention Gated"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

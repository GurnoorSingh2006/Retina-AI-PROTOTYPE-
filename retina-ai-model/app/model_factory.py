"""
RetinaAI Model Architecture Definitions
Directly transcribed from the Colab research notebook:
- Deep CNN (Pages 6-7)
- FCN (Page 10)
- Baseline U-Net (Pages 14-15)
- U-Net with Dropout (Pages 18-19)
- U-Net with Increased Filters (Page 22)
- U-Net with Residual Blocks / ResU-Net (Pages 24, 34-35)
- Attention U-Net (Pages 26-27) [Production Champion]
- Densely Connected U-Net (Pages 39-40)
"""

MODEL_CATALOG = [
    {
        "id": "attention-unet",
        "name": "Attention U-Net",
        "tag": "Production Model",
        "category": "Champion",
        "architecture": "U-Net with Gated Attention Mechanisms",
        "reported_accuracy": 90.4,
        "input_shape": "(128, 128, 3)",
        "params": "~31.4M",
        "purpose": "Focuses on salient retinal biomarker regions (fluid pockets, drusen, CNV membranes) via soft attention gates.",
        "status": "DEPLOYED_PRODUCTION",
        "loss": "categorical_crossentropy",
        "optimizer": "Adam (lr=0.0001)"
    },
    {
        "id": "res-unet",
        "name": "Residual U-Net (ResU-Net)",
        "tag": "Research Model",
        "category": "High Performance",
        "architecture": "Deep Residual Encoder-Decoder",
        "reported_accuracy": 90.5,
        "input_shape": "(128, 128, 3)",
        "params": "~28.2M",
        "purpose": "Residual shortcut connections prevent vanishing gradients in deep layer feature extraction.",
        "status": "RESEARCH_BENCHMARK",
        "loss": "binary_crossentropy / categorical",
        "optimizer": "Adam"
    },
    {
        "id": "unet-residual-blocks",
        "name": "U-Net with Residual Blocks",
        "tag": "Research Model",
        "category": "Iterative Variant",
        "architecture": "U-Net with Residual Skip Additions",
        "reported_accuracy": 88.6,
        "input_shape": "(128, 128, 3)",
        "params": "~19.8M",
        "purpose": "Evaluates residual block skip paths within encoder-decoder stages.",
        "status": "RESEARCH_BENCHMARK",
        "loss": "categorical_crossentropy",
        "optimizer": "Adam"
    },
    {
        "id": "unet-increased-filters",
        "name": "U-Net with Increased Filters",
        "tag": "Research Model",
        "category": "Capacity Scaled",
        "architecture": "High-Capacity U-Net (128-1024 filters)",
        "reported_accuracy": 86.8,
        "input_shape": "(128, 128, 3)",
        "params": "~34.1M",
        "purpose": "Tests increased channel capacity across convolution blocks.",
        "status": "RESEARCH_BENCHMARK",
        "loss": "categorical_crossentropy",
        "optimizer": "Adam"
    },
    {
        "id": "unet-dropout",
        "name": "U-Net with Dropout Regularization",
        "tag": "Research Model",
        "category": "Regularized",
        "architecture": "U-Net with 0.2/0.5 Dropout",
        "reported_accuracy": 85.8,
        "input_shape": "(128, 128, 3)",
        "params": "~15.2M",
        "purpose": "Mitigates overfitting on minority sub-classes through targeted dropout.",
        "status": "RESEARCH_BENCHMARK",
        "loss": "categorical_crossentropy",
        "optimizer": "Adam"
    },
    {
        "id": "baseline-unet",
        "name": "Baseline U-Net",
        "tag": "Research Model",
        "category": "Baseline Segmenter",
        "architecture": "Standard 4-stage U-Net",
        "reported_accuracy": 85.0,
        "input_shape": "(128, 128, 3)",
        "params": "~14.8M",
        "purpose": "Baseline symmetric contracting and expansive path encoder-decoder.",
        "status": "RESEARCH_BENCHMARK",
        "loss": "categorical_crossentropy",
        "optimizer": "Adam (lr=0.0001)"
    },
    {
        "id": "fcn",
        "name": "Fully Convolutional Network (FCN)",
        "tag": "Research Model",
        "category": "Convolutional Baseline",
        "architecture": "All-convolutional + Global Average Pooling",
        "reported_accuracy": 85.0,
        "input_shape": "(128, 128, 3)",
        "params": "1,572,548 (6.00 MB)",
        "purpose": "Replaces dense layers with 1x1 convolutions and GAP.",
        "status": "RESEARCH_BENCHMARK",
        "loss": "categorical_crossentropy",
        "optimizer": "Adam (lr=0.0001)"
    },
    {
        "id": "deep-cnn",
        "name": "Deep CNN (Sequential)",
        "tag": "Research Model",
        "category": "Initial Baseline",
        "architecture": "4 Conv Blocks + Flatten + Dense(512) + Dropout(0.5)",
        "reported_accuracy": 74.0,
        "input_shape": "(128, 128, 3)",
        "params": "5,111,492 (19.50 MB)",
        "purpose": "Initial benchmark convolutional neural network.",
        "status": "RESEARCH_BENCHMARK",
        "loss": "categorical_crossentropy",
        "optimizer": "Adam (lr=0.0001)"
    },
    {
        "id": "dense-unet",
        "name": "Densely Connected U-Net",
        "tag": "Research Model",
        "category": "Dense Feature Reuse",
        "architecture": "U-Net with Dense Blocks",
        "reported_accuracy": 89.2,
        "input_shape": "(128, 128, 3)",
        "params": "~45.6M",
        "purpose": "Maximizes information flow between layers via iterative concatenations.",
        "status": "RESEARCH_BENCHMARK",
        "loss": "binary_crossentropy",
        "optimizer": "Adam"
    }
]

def get_model_catalog():
    return MODEL_CATALOG

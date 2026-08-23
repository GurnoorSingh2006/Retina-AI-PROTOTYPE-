"""
RetinaAI Image Preprocessing Pipeline
Preserves the exact preprocessing logic from the research notebook:
- Image Resize: (128, 128)
- Channels: 3 (RGB)
- Normalization: Rescale 1./255 (Pixel range [0.0, 1.0])
"""
import io
import numpy as np
from PIL import Image

TARGET_SIZE = (128, 128)

def preprocess_image(image_bytes: bytes, target_size=TARGET_SIZE):
    """
    Takes raw image bytes, converts to RGB, resizes to target_size,
    and normalizes pixel values to [0.0, 1.0] matching ImageDataGenerator(rescale=1./255).
    
    Returns:
        input_tensor: numpy array of shape (1, 128, 128, 3), dtype float32
        pil_image: PIL Image object in RGB mode (resized to target_size)
        original_pil: Original PIL Image object
    """
    try:
        original_pil = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        raise ValueError(f"Invalid image format: {str(e)}")
    
    # Ensure RGB format
    rgb_pil = original_pil.convert("RGB")
    
    # Resize to exact input shape from notebook
    resized_pil = rgb_pil.resize(target_size, Image.Resampling.BILINEAR)
    
    # Convert to numpy and normalize by 1./255
    img_array = np.array(resized_pil, dtype=np.float32) / 255.0
    
    # Add batch dimension: (1, 128, 128, 3)
    input_tensor = np.expand_dims(img_array, axis=0)
    
    return input_tensor, resized_pil, rgb_pil

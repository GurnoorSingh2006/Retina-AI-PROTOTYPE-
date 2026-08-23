# RetinaAI Model Artifacts Directory

Place your trained Keras / TensorFlow model weights here:
- `attention_unet_oct.keras` (Production Attention U-Net model artifact)
- `attention_unet_oct.h5` (Alternative HDF5 format)

### Model Specification from Colab Notebook:
- Input Shape: `(128, 128, 3)`
- Color Mode: RGB
- Normalization: `1./255`
- Output: 4 classes Softmax `['NORMAL', 'DME', 'DRUSEN', 'CNV']`
- Reported Accuracy: **90.4%**

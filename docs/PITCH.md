# RetinaAI - 2-Minute Hackathon Pitch

**Hook (0:00 - 0:20)**:
"Over 200 million people worldwide suffer from macular diseases that lead to blindness if untreated. Optical Coherence Tomography, or OCT, is the gold standard for diagnosis, but analyzing thousands of B-scans manually creates a massive bottleneck, while generic 'black box' AI cannot be trusted by doctors."

**Problem & Innovation (0:20 - 0:50)**:
"Introducing **RetinaAI: Explainable AI-Powered OCT Retinal Screening**.
Unlike traditional AI models that just output a single label, RetinaAI shows doctors *exactly why* it made its decision. 
Using an **Attention U-Net** architecture trained on over 83,000 OCT scans across 4 key conditions-NORMAL, DME, DRUSEN, and CNV-our platform achieves over 90% accuracy while generating real-time **Grad-CAM attention heatmaps** highlighting fluid cavities, drusen summits, and neovascular membranes."

**The Product & Workflow (0:50 - 1:30)**:
"Clinicians can upload an OCT scan and receive an instant multi-class probability breakdown, an interactive overlay viewer, and an automated rule-based screening priority. In one click, RetinaAI generates a comprehensive, standardized PDF clinical screening report ready for patient records or specialist referral."

**Architecture & Scalability (1:30 - 1:50)**:
"Our architecture is built for production:
- A high-speed **FastAPI & TensorFlow** microservice running Attention U-Net inference.
- A secure **Spring Boot 3** backend with JWT authentication and PostgreSQL persistence.
- A responsive, medical-grade **Next.js 14** web application with interactive canvas visualizers."

**Vision & Call to Action (1:50 - 2:00)**:
"RetinaAI empowers primary care clinics to detect sight-threatening conditions earlier and gives retinal specialists explainable confidence.
*RetinaAI - See Beyond the Scan.* Thank you!"

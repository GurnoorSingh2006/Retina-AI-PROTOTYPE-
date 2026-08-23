# 💻 RetinaAI — Web Application Platform

The complete clinician-facing web application for **RetinaAI**, built with **Next.js 14 (App Router)** and **Tailwind CSS**.

---

## ⚡ Features
- **Cinematic Homepage**: Scroll-synchronized frame scrubbing with transparent glass cards.
- **OCT Scan Studio (`/analyze`)**: Drag-and-drop file upload with 1-click evaluation samples (`NORMAL`, `DME`, `DRUSEN`, `CNV`).
- **Interactive OCT Visualizer (`/results/[id]`)**: Real-time layer switching between **Original OCT**, **Grad-CAM Heatmap**, and **Overlay**.
- **Automated Clinical PDF Export**: Generates standardized clinical screening reports on demand.
- **Clinician Dashboard (`/dashboard`)**: Overview statistics, condition distribution charts, and recent scan logs.
- **Scan Archives (`/history`)**: Searchable and filterable history of evaluated OCT scans.
- **Reports Directory (`/reports`)**: Archive of generated clinical summary documents.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14.2.5 (App Router, React 18, TypeScript)
- **Styling**: Tailwind CSS + Lucide Icons + Recharts
- **PDF Generation**: jsPDF + jspdf-autotable
- **Theme**: Void Black (`#050505`), Frosted Glass, Retinal Red (`#8F1515`, `#E0533C`)

---

## 🚀 How to Run Locally

### 1. Install Dependencies
```powershell
npm install
```

### 2. Configure Environment
Create `.env.local` (or copy `.env.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Run Development Server
```powershell
npm run dev
```
*Open `http://localhost:3000` in your browser.*

### 4. Build for Production
```powershell
npm run build
npm start
```

---

## 📤 How to Push to Your Own GitHub Repository

```bash
cd retina-ai-frontend
git init
git add .
git commit -m "feat: Initial commit of RetinaAI Next.js 14 frontend"
git branch -M main
git remote add origin https://github.com/<your-username>/retina-ai-frontend.git
git push -u origin main
```

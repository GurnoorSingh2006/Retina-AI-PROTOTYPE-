# 🚀 RETINAAI: Complete Step-by-Step Deployment Guide

This guide provides end-to-end instructions for deploying all components of the **RetinaAI** platform:
1. **FastAPI AI Microservice** (Attention U-Net & Grad-CAM inference)
2. **Spring Boot 3 Enterprise Backend** (JWT Auth, PostgreSQL/H2 persistence, PDF reports)
3. **Next.js 14 Web Application** (Cinematic interactive UI & visualizer)
4. **PostgreSQL Database** (Production medical record persistence)

---

## 📑 Table of Contents
- [Architecture & Ports](#-architecture--ports)
- [Method 1: Cloud Deployment on Render (Recommended)](#-method-1-cloud-deployment-on-render)
  - [Step 1: Deploy PostgreSQL Database](#step-1-deploy-postgresql-database-on-render)
  - [Step 2: Deploy FastAPI AI Microservice](#step-2-deploy-fastapi-ai-microservice)
  - [Step 3: Deploy Spring Boot Backend](#step-3-deploy-spring-boot-backend)
  - [Step 4: Deploy Next.js Frontend (Render / Vercel)](#step-4-deploy-nextjs-frontend)
  - [Step 5: Setup Keep-Alive Monitoring](#step-5-setup-keep-alive-pings-to-prevent-sleep)
- [Method 2: 1-Command Docker Compose Deployment](#-method-2-1-command-docker-compose-deployment)
- [Method 3: Manual Local Development Setup](#-method-3-manual-local-development-setup)
- [Environment Variables Reference](#-environment-variables-reference)
- [Troubleshooting & Verification](#-troubleshooting--verification)

---

## 🌐 Architecture & Ports

```mermaid
flowchart LR
    Client["Browser / Client"] -->|Port 3000| Frontend["Next.js 14 Frontend"]
    Frontend -->|Port 8080| Backend["Spring Boot 3.3.2 Backend"]
    Backend -->|Port 8000| AIService["FastAPI AI Engine"]
    Backend -->|Port 5432| DB[("PostgreSQL Database")]
```

| Service | Technology | Port | Root Path in Repo |
| :--- | :--- | :--- | :--- |
| **Frontend** | Next.js 14 (App Router, Tailwind) | `3000` | `retina-ai/frontend` |
| **Backend** | Spring Boot 3.3.2 (Java 21, Security) | `8080` | `retina-ai/backend` |
| **AI Service** | FastAPI (Python 3.11, TensorFlow) | `8000` | `retina-ai/ai-service` |
| **Database** | PostgreSQL 16 / In-Memory H2 | `5432` | Hosted / Docker |

---

## ☁️ Method 1: Cloud Deployment on Render

### Step 1: Deploy PostgreSQL Database on Render
1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** -> **PostgreSQL**.
3. Configure the database:
   - **Name**: `retina-postgres`
   - **Database**: `retinaai`
   - **User**: `retina_user`
   - **Region**: Choose closest to you (e.g., Oregon / Frankfurt / Singapore).
   - **Plan**: **Free**.
4. Click **Create Database**.
5. Once created, copy the **Internal Database URL** (e.g., `postgresql://retina_user:password@dpg-xxxx-a:5432/retinaai`) and **External Database URL**.

---

### Step 2: Deploy FastAPI AI Microservice
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure service settings:
   - **Name**: `retina-ai-service`
   - **Region**: Same region as database.
   - **Root Directory**: `retina-ai/ai-service`
   - **Runtime**: **Python** (or **Docker** using `retina-ai/ai-service/Dockerfile`).
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `PORT` | `8000` | Port listened by uvicorn |
   | `ALLOW_ORIGINS` | `*` | CORS whitelist |
5. Set **Health Check Path**:
   - Go to **Settings** -> **Health Check Path**: `/health`
6. Click **Deploy Web Service**.
7. Note your public AI service URL: `https://retina-ai-service.onrender.com`.

---

### Step 3: Deploy Spring Boot Backend
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure service settings:
   - **Name**: `retina-backend`
   - **Region**: Same region as database.
   - **Root Directory**: `retina-ai/backend`
   - **Runtime**: **Docker** (Render will automatically detect `retina-ai/backend/Dockerfile`).
4. Add **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `jdbc:postgresql://<host>:5432/retinaai` | JDBC Connection String |
   | `DATABASE_DRIVER` | `org.postgresql.Driver` | PostgreSQL JDBC Driver |
   | `DATABASE_DIALECT` | `org.hibernate.dialect.PostgreSQLDialect` | Hibernate Dialect |
   | `DATABASE_USER` | `retina_user` | Render DB Username |
   | `DATABASE_PASSWORD` | `<your_db_password>` | Render DB Password |
   | `AI_SERVICE_URL` | `https://retina-ai-service.onrender.com` | URL of deployed FastAPI service |
   | `JWT_SECRET` | `RetinaAISecretKeyForMedicalScreeningHackathon2026SecureKeyWithHighEntropy998877` | 64+ char signing key |
   | `PORT` | `8080` | Server port |

   > **Note on H2 Fallback**: If deploying without PostgreSQL, omit the database variables and the backend will automatically initialize its in-memory H2 database.

5. Set **Health Check Path**:
   - Go to **Settings** -> **Health Check Path**: `/health` or `/api/health`
6. Click **Deploy Web Service**.
7. Note your public backend URL: `https://retina-backend.onrender.com`.

---

### Step 4: Deploy Next.js Frontend

#### Option 4A: Deploy on Render
1. Click **New +** -> **Web Service**.
2. Configure settings:
   - **Name**: `retina-frontend`
   - **Root Directory**: `retina-ai/frontend`
   - **Runtime**: **Node**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Add **Environment Variables**:
   | Key | Value |
   | :--- | :--- |
   | `NEXT_PUBLIC_API_URL` | `https://retina-backend.onrender.com/api` |
4. Set **Health Check Path**: `/api/health`.
5. Click **Deploy**.

#### Option 4B: Deploy on Vercel (Fastest for Next.js)
1. Go to [Vercel Dashboard](https://vercel.com/) -> **Add New...** -> **Project**.
2. Import repository and set **Root Directory** to `retina-ai/frontend`.
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://retina-backend.onrender.com/api`
4. Click **Deploy**.

---

### Step 5: Setup Keep-Alive Pings (To Prevent Sleep)
Render free-tier web services spin down after 15 minutes of inactivity. To keep your platform instantly responsive 24/7:
1. Create a free account at [Cron-Job.org](https://cron-job.org) or [UptimeRobot](https://uptimerobot.com).
2. Create two recurring 5-minute HTTP GET monitors:
   - **Backend Ping**: `https://<your-backend-app>.onrender.com/health`
   - **AI Service Ping**: `https://<your-ai-service>.onrender.com/health`
3. Both endpoints respond with status `200 OK` and `{ "status": "UP" }` to maintain warm containers.

---

## 🐳 Method 2: 1-Command Docker Compose Deployment

If deploying on a VPS (AWS EC2, DigitalOcean Droplet, GCP Compute, or locally):

### Prerequisites
- [Docker Engine](https://docs.docker.com/engine/install/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+

### Steps
1. Clone repository and navigate to the project directory:
   ```bash
   git clone <repo-url>
   cd "d:/timepass/oosc hackathon/retina-ai"
   ```
2. Run full multi-container build:
   ```bash
   docker compose up --build -d
   ```
3. Check container statuses:
   ```bash
   docker compose ps
   ```
4. Access the services:
   - **Frontend App**: `http://localhost:3000`
   - **Backend REST API**: `http://localhost:8080/swagger-ui.html`
   - **AI Inference Engine**: `http://localhost:8000/docs`
   - **Backend Health Check**: `http://localhost:8080/health`
   - **AI Health Check**: `http://localhost:8000/health`

5. View real-time logs:
   ```bash
   docker compose logs -f
   ```

---

## 💻 Method 3: Manual Local Development Setup

### 1. Start AI Inference Service
```powershell
cd "d:\timepass\oosc hackathon\retina-ai\ai-service"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Start Spring Boot Backend
```powershell
cd "d:\timepass\oosc hackathon\retina-ai\backend"
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080` (uses in-memory H2 database by default).*

### 3. Start Next.js Frontend
```powershell
cd "d:\timepass\oosc hackathon\retina-ai\frontend"
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## 🔑 Environment Variables Reference

### Backend (`retina-ai/backend`)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | HTTP port |
| `DATABASE_URL` | `jdbc:h2:mem:retinaaidb` | PostgreSQL / H2 Connection String |
| `DATABASE_USER` | `sa` | DB User |
| `DATABASE_PASSWORD` | *(empty)* | DB Password |
| `DATABASE_DRIVER` | `org.h2.Driver` | JDBC Driver Class |
| `DATABASE_DIALECT` | `org.hibernate.dialect.H2Dialect` | Hibernate Dialect |
| `AI_SERVICE_URL` | `http://localhost:8000` | AI service endpoint |
| `JWT_SECRET` | *(64-char key)* | Secret for signing JWT tokens |

### AI Service (`retina-ai/ai-service`)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8000` | Microservice port |
| `HOST` | `0.0.0.0` | Binding host |
| `ALLOW_ORIGINS` | `*` | Allowed CORS origins |

### Frontend (`retina-ai/frontend`)
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080/api` | Base URL for backend REST API |

---

## 🔍 Troubleshooting & Verification

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| **CORS Errors in Browser** | Backend rejected Origin header | Ensure `SecurityConfig.java` has `allowedOriginPatterns = List.of("*")` and `allowCredentials = true`. |
| **Render Cold Start 500/504** | Free container was suspended | Add a 5-minute cron ping on [Cron-job.org](https://cron-job.org) targeting `/health`. |
| **Database Connection Failure** | Incorrect JDBC URL or driver | When using PostgreSQL on Render, ensure driver is `org.postgresql.Driver` and URL starts with `jdbc:postgresql://`. |
| **AI Model Weights Not Found** | Weights file not loaded | Service automatically falls back to deterministic research emulation if `.keras` file is absent. |
| **Next.js Video 404** | Missing video file | Ensure video is located in `public/videos/eyenew.mp4`. |

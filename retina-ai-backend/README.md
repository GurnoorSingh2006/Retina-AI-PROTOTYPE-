# 🏥 RetinaAI — Enterprise Backend Service

Production-ready **Spring Boot 3.3.2 (Java 21)** REST API for the **RetinaAI** medical screening platform. Provides secure JWT authentication, patient scan persistence, rule-based clinical triage, AI microservice coordination, and automated PDF report generation.

---

## ⚡ Features
- **Stateless JWT Security**: BCrypt password hashing, role-based authorization (`ROLE_CLINICIAN`), and 24h expiration tokens.
- **Dual Database Support**: Automatic fallback to in-memory **H2 database** locally and production **PostgreSQL** in cloud.
- **AI Microservice Bridge**: Seamless multipart/form-data forwarding to the FastAPI inference engine.
- **Clinical Priority Triage**: Automated classification into `HIGH PRIORITY` (CNV/DME), `CLINICAL REVIEW` (Drusen), or `LOW RISK` (Normal).
- **Keep-Alive Health Controller**: Dedicated `/health`, `/api/health`, and `/ping` endpoints for 24/7 Render uptime.

---

## 🛠️ Tech Stack
- **Framework**: Spring Boot 3.3.2
- **Language**: Java 21
- **Security**: Spring Security + JJWT 0.12.6
- **Database / ORM**: Spring Data JPA + Hibernate (PostgreSQL / H2)
- **Containerization**: Multi-stage Dockerfile (Eclipse Temurin 21 JRE)

---

## 🚀 How to Run Locally

### Prerequisites
- Java 21 JDK
- Maven 3.9+

### Run Application
```powershell
mvn clean spring-boot:run
```
*API starts on `http://localhost:8080`.*

### Test Health Endpoint
```powershell
curl http://localhost:8080/health
```

---

## 🔑 Environment Variables
| Key | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | Server port |
| `DATABASE_URL` | `jdbc:h2:mem:retinaaidb` | PostgreSQL / H2 Connection String |
| `DATABASE_USER` | `sa` | Database User |
| `DATABASE_PASSWORD` | *(empty)* | Database Password |
| `AI_SERVICE_URL` | `http://localhost:8000` | FastAPI Inference Service URL |
| `JWT_SECRET` | *(64-char key)* | Secret key for signing tokens |

---

## 📤 How to Push to Your Own GitHub Repository

```bash
cd retina-ai-backend
git init
git add .
git commit -m "feat: Initial commit of RetinaAI Spring Boot backend"
git branch -M main
git remote add origin https://github.com/<your-username>/retina-ai-backend.git
git push -u origin main
```

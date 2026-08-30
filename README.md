# 👁️ Neural Vision — Missing Person Facial Detection & Vector Matching System

> **Case-Matching System & 512-Dimensional Facial Embedding Engine**  
> *A high-precision investigative platform designed to compare field photography against enrolled missing-person dossiers using normalized 512-dimensional vector similarity.*

---

## 📸 System Overview

**Neural Vision** is an investigative web application and microservice suite engineered to assist field investigators in identifying missing persons. Using multi-box facial detection (MTCNN) combined with 512-dimensional facial embedding extraction and Cosine Similarity distance metrics, Neural Vision rapidly cross-references field photographs against enrolled case records to surface high-confidence candidate leads.

---

## ✨ Key Features

- ** 512-Dimensional Vector Case Matching**: Compares facial embeddings using Cosine Similarity ($\mathbf{u} \cdot \mathbf{v}$) to rank candidate matches with calibrated accuracy.
- ** Multi-Box Face Detection**: MTCNN & OpenCV facial detection isolates individual bounding boxes in single portraits or dense crowd scenes.
- ** Live Operational Dashboard**: Real-time tracking of enrolled profiles, field scans executed, matches confirmed, and recent active case dossiers.
- ** Calibrated Analog Match Gauges**: Interactive visual confidence dials that provide intuitive similarity score readouts ($\ge 40\%$ threshold).
- ** Official Dossier Inspection**: Detailed case file modals with headshots, age, height, last seen location, distinguishing features, and case notes.
- ** Multi-Cloud & Serverless Database Ready**: Serverless **Neon PostgreSQL** integration, Vercel Serverless Functions, and static GitHub Pages deployment.

---

## 🌐 Production Cloud Architecture

```
                               ┌────────────────────────────────────────────────┐
                               │       GitHub Pages (Static Web Frontend)       │
                               │     https://<username>.github.io/counter-webdev │
                               └───────────────────────┬────────────────────────┘
                                                       │
                                                       │ HTTPS API Fetch Calls
                                                       ▼
                               ┌────────────────────────────────────────────────┐
                               │       Vercel (API Backend & Serverless)        │
                               │          https://<your-project>.vercel.app     │
                               └──────────────┬──────────────────┬──────────────┘
                                              │                  │
                                              ▼                  ▼
┌──────────────────────────────────────────────┐        ┌───────────────────────────────────────┐
│     Neon Serverless PostgreSQL Database      │        │ Python Flask Detection & Embeddings   │
│   - missing_persons (512-dim JSONB vectors)  │        │ - MTCNN face bounding box detection   │
│   - system_stats (real-time metrics)         │        │ - 512-dim feature vector extraction   │
└──────────────────────────────────────────────┘        └───────────────────────────────────────┘
```

---

## 🚀 Cloud Deployment Guide

### 1. Database Deployment (Neon Serverless PostgreSQL)

1. Create a free project at **[neon.tech](https://neon.tech)**.
2. Copy your PostgreSQL connection string:
   ```env
   NEON_DATABASE_URL=postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require
   ```
3. *Note*: Database tables (`missing_persons` and `system_stats`) will automatically be initialized on the first request!

---

### 2. Backend API Deployment (Vercel)

1. Connect your GitHub repository to **[Vercel](https://vercel.com/new)**.
2. In the Vercel project settings, set **Environment Variables**:
   - `NEON_DATABASE_URL`: Your Neon PostgreSQL connection URL.
   - `FLASK_URL`: `http://localhost:5000` (or URL of hosted Python service on Render/Railway).
3. Click **Deploy**. Vercel will build and host your API routes at `https://<your-project>.vercel.app`.

---

### 3. Frontend UI Deployment (GitHub Pages)

1. In your GitHub repository, go to **Settings** $\rightarrow$ **Pages** $\rightarrow$ **Source**: Select **GitHub Actions**.
2. Go to **Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions** $\rightarrow$ **New repository secret**:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://<your-project>.vercel.app` (your Vercel backend URL)
3. Push your repository to `main`:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages & Vercel with Neon DB"
   git push origin main
   ```
4. The `.github/workflows/deploy.yml` action will automatically build and publish your static frontend to `https://<username>.github.io/counter-webdev`.

---

## 💻 Running the Application Locally

To run the complete system locally:

### Terminal 1: Next.js Web Frontend
```bash
npm run dev
```
> Web App running at: **`http://localhost:3000`**

### Terminal 2: Flask Face Embedding Service (Port 5000)
```bash
cd flask-api
.\venv\Scripts\python.exe embedding.py
```
> Embedding API running at: **`http://localhost:5000`**

### Terminal 3: Flask Face Detection Service (Port 5001)
```bash
cd flask-api
.\venv\Scripts\python.exe app.py
```
> Detection API running at: **`http://localhost:5001`**

---

## 📄 License

This project is open-source under the MIT License.

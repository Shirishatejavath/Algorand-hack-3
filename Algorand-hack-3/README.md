# BlockSentinel.ai
> **Secure every crypto transaction with real-time on-chain intelligence.**

BlockSentinel.ai is a production-ready security layer for the Algorand blockchain. Powered by the **TXS Engine**, it analyzes on-chain behavior in real-time to detect fraud, assign risk scores, and store critical security signals in an immutable on-chain registry.

![System Architecture](C:/Users/tejas/.gemini/antigravity/brain/9107103d-7e84-459d-a101-65cc3fe76571/blocksentinel_architecture_visual_1776335176055.png)

> **[View Detailed Architecture & System Flow →](docs/architecture.md)**  
> **[Lora (App Lab) — deploy, ABI calls, box refs →](docs/app-lab.md)**

---


## 🚀 Core Features

### ⚡ TXS Engine (Transaction Security System)
Our proprietary analysis engine fetches live data from the **Algorand Indexer API** and performs behavioral heuristics to identify malicious patterns before users sign irreversible transactions.

### 🔗 On-Chain Risk Registry
Verified high-risk signals are registered directly on the Algorand blockchain using **PyTeal Smart Contracts**, creating a decentralized, tamper-proof trust layer for the ecosystem.

### 📱 Intelligence Dashboard
A high-fidelity React interface tailored for B2B platforms and retail investors, featuring real-time risk gauges, on-chain verification badges, and human-readable risk factors.

---

## 🛠 Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS v4
- **Backend**: Python, FastAPI, Uvicorn
- **Blockchain**: Algorand Indexer SDK, PyTeal (Smart Contracts)
- **Deployment**: Vercel (Frontend), Render (Backend)

---

## 📁 Repository Structure

```text
BlockSentinel.ai/
├── frontend/           # React Application (Vite + Tailwind)
├── backend/            # FastAPI Service (TXS Engine)
│   ├── services/       # Core intelligence & Engine logic
│   └── routes/         # API endpoint definitions
├── contracts/          # PyTeal Smart Contracts (Risk Registry)
├── docs/               # Architecture diagrams & technical specs
└── README.md           # Project configuration & overview
```

---

## 🏁 Getting Started

### 0. Environment
- Copy `backend/.env.example` to `backend/.env` and set `CREATOR_MNEMONIC`, `RISK_REGISTRY_APP_ID` (after deploy), and optionally `ALGOD_*`.
- Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL=http://localhost:8000` (or your Render URL).

### 1. Backend (TXS Engine)
```bash
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

`POST /analyze-wallet` returns an `on_chain` field when the registry env vars are set.

### 2. Frontend (Dashboard)
```bash
cd frontend
npm install
npm run dev
```

### 3. Smart contract artifacts & Lora
```bash
python contracts/build.py   # writes ARC-32 / ARC-56 + TEAL under contracts/artifacts/
```
See **[docs/app-lab.md](docs/app-lab.md)** for App Lab upload, ABI calls, and box references.

---

## 🎯 Our Mission
Blockchain transactions are irreversible. BlockSentinel.ai is the missing intelligence layer that makes Web3 safer, one transaction at a time. We are building the trust infrastructure required for the next billion users on Algorand.

---
## 🔐 Security Practices
- `.env` is excluded via `.gitignore`.
- Secrets are never pushed to GitHub.
- Keys are rotated immediately if exposed.
- Environment variables are used securely in code and deployment.

---
*Built for Algorand Hack Series 3.*

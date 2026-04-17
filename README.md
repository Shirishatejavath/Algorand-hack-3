<div align="center">
  <img src="frontend/public/logo.png" alt="BlockSentinel.ai Logo" width="120" height="120" />
  <h1>BlockSentinel.ai</h1>
  <p><strong>Deterministic Transaction Security & Intelligence Layer for Algorand</strong></p>
  
  <p>
    <a href="#vision">Vision</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## 👁️ Vision

In the rapidly expanding Web3 ecosystem, malicious actors exploit sophisticated multi-signature and smart-contract vulnerabilities that human oversight cannot catch in real-time. 

**BlockSentinel.ai** was engineered to solve this. Built natively for **Algorand**, BlockSentinel acts as a deterministic, AI-driven transaction surveillance engine. By analyzing on-chain heuristics, circular fund routing, and ultra-high-speed behavioral velocity, BlockSentinel flags threats *before* they execute, providing institutional-grade trust to decentralized networks.

---

## ⚙️ How It Works

BlockSentinel leverages the Algorand Indexer API combined with a high-fidelity predictive heuristic engine. 

1. **Scan & Ingest**: Users connect their Pera Wallet (or input an address). BlockSentinel ingests the historical protocol events and active transacting vectors.
2. **Deterministic Analysis**: The **TXS Engine** evaluates the behavioral velocity, temporal recency, and counterparty matrix, looking for known threat signatures (e.g., rapid repeat executions, circular flows).
3. **Transparent Execution**: The frontend **Terminal Display** renders the raw heuristic telemetry in real-time, outputting dynamic Risk Vectors and Engine Confidence metadata.

---

## ⚡ Core Features

- **The "Alive" Command Center**: A purely code-driven, abstract gradient interface featuring glowing deterministic gauges, data-wave rhythm animations, and a prestigious 'no-distraction' technical aesthetic.
- **Authentic Wallet Execution**: Flawless integration reproducing the official Pera Wallet Connect UX—including a high-fidelity encoded QR scanner with dynamic targeting reticles.
- **Transparent Heuristic Console**: Instead of hiding the math, BlockSentinel features a simulated live-terminal that types out real-time engine events (`NODE > Relaying to Algorand Primary Indexer`, `HEUR > CRITICAL: Circular Fund...`).
- **Sentinel Sub-Systems**: Features Live On-chain Data Feed mockups, Recent Audit logs, and high-stakes surveillance metrics (`1.2 THz Active Sync`, `Inference Latency 14ms`).

---

## 🏗️ Architecture

BlockSentinel adheres to a clean, modern full-stack decoupling:

*   **Frontend**: React + Vite + Tailwind CSS + Lucide Icons. Engineered for hyper-performance, utilizing 'glass-premium' CSS properties for deep visual immersion.
*   **Backend Engine**: FastAPI (Python) running the `txs_engine` and `scoring.py`. Handles dynamic metadata generation, API indexing wrappers, and the heuristic trace modeling pipeline.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js `v18+`
- Python `3.10+`

### 1. Start the Backend (TXS Engine)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (Windows: venv\Scripts\activate)
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Start the Frontend (Command Center)
Open a new terminal session:
```bash
cd frontend
npm install
npm run dev
```

The BlockSentinel array will map to `http://localhost:5173`. Connect your wallet and witness the transparent heuristics in real-time.

---

> *"Security shouldn't be a black box. BlockSentinel brings the engine to the surface."*

**Built for the Algorand Global Hackathon.**

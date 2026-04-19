# BlockSentinel.ai Architecture

This document details the technical architecture and data flow of the BlockSentinel security platform.

## 🏗 System Overview

BlockSentinel.ai consists of four primary layers:
1.  **Frontend (React/Vite)**: The user-facing dashboard for wallet analysis and risk visualization.
2.  **TXS Engine (FastAPI)**: The intelligence layer that fetches and analyzes blockchain data.
3.  **Algorand Indexer**: The source of truth for on-chain transaction history.
4.  **Risk Registry (PyTeal)**: The decentralized trust layer for storing verified risk signals.

## 🌊 Data Flow Diagram

```mermaid
graph TD
    User((User)) -->|Enters Wallet| FE[Frontend - React]
    FE -->|POST /analyze-wallet| BE[Backend - FastAPI]
    
    subgraph TXS Engine
        BE -->|Query| IDX[Algorand Indexer API]
        IDX -->|TX History| BE
        BE -->|Score & Explanation| SCORER[Risk Scorer]
        SCORER -->|Intelligence| BE
    end
    
    subgraph On-Chain Registry
        BE -->|Update (Optional)| CONTRACT[PyTeal Smart Contract]
        CONTRACT -->|Immutable Record| ALGO[(Algorand Blockchain)]
    end
    
    BE -->|TXS Results| FE
    FE -->|Visualize| User
    
    style FE fill:#0a192f,stroke:#00f3ff,stroke-width:2px,color:#fff
    style BE fill:#0a192f,stroke:#7000ff,stroke-width:2px,color:#fff
    style IDX fill:#000,stroke:#00f3ff,stroke-dasharray: 5 5,color:#fff
    style ALGO fill:#000,stroke:#7000ff,stroke-dasharray: 5 5,color:#fff
```

## 🧠 Intelligence Heuristics
The TXS Engine analyzes the following vectors to derive its 0-100 risk score:
- **Transaction Depth**: Total on-chain history and activity longevity.
- **Frequency Analysis**: Detection of high-pressure micro-transaction bursts.
- **Entity Linkage**: Proximity to known blacklisted or high-risk wallet clusters.
- **Value Patterns**: Sudden, abnormal spikes in transfer amounts relative to historical norms.

## 🛡 Resiliency & Demo-Safety
BlockSentinel implements a multi-tiered fallback architecture. If the Algorand Indexer API is unreachable or rate-limited, the system automatically transitions to a localized simulation model to ensure uninterrupted demo stability while maintaining high-fidelity results.

## 🔗 Operating the Risk Registry (Lora / TestNet)
For uploading ARC specs, calling ABI methods, box references, and creator wallet requirements, see **[app-lab.md](app-lab.md)**.

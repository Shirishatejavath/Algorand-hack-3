from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import time
from datetime import datetime
from typing import List, Optional, Dict, Any

app = FastAPI(title="BlockSentinel.ai TXS Engine + Predictor")

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from services.txs_engine.analyzer import analyze_wallet as txs_analyze
from services.simulate import simulate_transaction as txs_simulate

# Data Models
class WalletRequest(BaseModel):
    wallet_address: str

class AnalysisResponse(BaseModel):
    score: int
    risk: str
    reasons: List[str]
    breakdown: Optional[Dict[str, int]] = None
    timestamp: str
    tx_count: int
    is_real_data: bool

class Transaction(BaseModel):
    tx_id: str
    from_wallet: str
    to_wallet: str
    amount: float
    timestamp: str

class SimulateRequest(BaseModel):
    from_wallet: str
    to_wallet: str
    amount: float
    asset: str = "ALGO"

class SimulateResponse(BaseModel):
    simulation: str
    risk_score: int
    risk_level: str
    warnings: List[str]
    recommendation: str

# Mock Database
analysis_history = []

@app.post("/analyze-wallet", response_model=AnalysisResponse)
async def analyze_wallet_endpoint(request: WalletRequest):
    if not request.wallet_address or len(request.wallet_address) < 10:
        raise HTTPException(status_code=400, detail="Invalid wallet address")
    
    result_data = txs_analyze(request.wallet_address)
    
    result = {
        "score": result_data["score"],
        "risk": result_data["risk"],
        "reasons": result_data["reasons"],
        "breakdown": result_data.get("breakdown"),
        "tx_count": result_data["tx_count"],
        "is_real_data": result_data["is_real_data"],
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    analysis_history.append({**result, "wallet_address": request.wallet_address})
    return result

@app.post("/simulate-transaction", response_model=SimulateResponse)
async def simulate_transaction_endpoint(request: SimulateRequest):
    if not request.to_wallet or len(request.to_wallet) < 10:
        raise HTTPException(status_code=400, detail="Invalid receiver address")
        
    tx_data = {
        "from": request.from_wallet,
        "to": request.to_wallet,
        "amount": request.amount,
        "asset": request.asset
    }
    
    result_data = txs_simulate(tx_data)
    
    return {
        "simulation": result_data["simulation"],
        "risk_score": result_data["risk_score"],
        "risk_level": result_data["risk_level"],
        "warnings": result_data["warnings"],
        "recommendation": result_data["recommendation"]
    }

@app.get("/transactions/{wallet}", response_model=List[Transaction])
async def get_transactions(wallet: str):
    return [
        {
            "tx_id": f"TX_{random.randint(100000, 999999)}",
            "from_wallet": wallet,
            "to_wallet": "EXTERNAL_ENTITY",
            "amount": round(random.uniform(1.0, 1000.0), 2),
            "timestamp": "2024-04-15 14:30:22"
        } for _ in range(5)
    ]

@app.get("/alerts")
async def get_alerts():
    return [item for item in analysis_history if item["risk"] == "HIGH"][-5:]

@app.get("/")
async def root():
    return {"status": "online", "engine": "TXS v2.0.0", "blockchain": "Algorand"}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)

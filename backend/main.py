from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import time
from datetime import datetime
from typing import List, Optional

app = FastAPI(title="BlockSentinel.ai TXS Engine")

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the Vite dev server URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class WalletRequest(BaseModel):
    wallet_address: str

class AnalysisResponse(BaseModel):
    score: int
    risk: str
    reasons: List[str]
    timestamp: str

class Transaction(BaseModel):
    tx_id: str
    from_wallet: str
    to_wallet: str
    amount: float
    timestamp: str

# Mock Database
analysis_history = []
flagged_wallets = [
    "AAAAA_SCAM_WALLET_DO_NOT_SEND",
    "PRTM9YVZW8KLNHQX7GCM2BU6XIE4S3D5ZF1VRYJA", # High risk sample
]

def calculate_txs_score(address: str):
    """
    TXS Engine Logic (MVP)
    Implement rule-based detection for Algorand transactions
    """
    score = 0
    reasons = []
    
    # 1. Flagged Wallet Check
    if address in flagged_wallets:
        score += random.randint(70, 95)
        reasons.append("Interaction with known high-risk or flagged wallet")
    
    # 2. Mock Transaction Frequency (Simulated)
    tx_count = random.randint(1, 500)
    if tx_count > 300:
        score += 25
        reasons.append(f"Abnormal transaction frequency detected ({tx_count} in 24h)")
    
    # 3. Sudden Large Transfers (Simulated)
    last_amount = random.randint(1, 1000000)
    if last_amount > 500000:
        score += 20
        reasons.append(f"Large sudden transfer detected: {last_amount:,} ALGO")
        
    # 4. New Account Check (Simulated)
    is_new = random.choice([True, False, False, False])
    if is_new:
        score += 15
        reasons.append("Recently activated account with high initial activity")

    # Normalize score
    final_score = min(max(score, 5), 100)
    
    # Determine Risk Level
    if final_score < 30:
        risk = "Low"
    elif final_score < 65:
        risk = "Medium"
    else:
        risk = "High"
        
    if not reasons:
        reasons.append("Normalized transaction behavior")
        
    return final_score, risk, reasons

@app.post("/analyze-wallet", response_model=AnalysisResponse)
async def analyze_wallet(request: WalletRequest):
    if not request.wallet_address or len(request.wallet_address) < 10:
        raise HTTPException(status_code=400, detail="Invalid wallet address")
    
    score, risk, reasons = calculate_txs_score(request.wallet_address)
    
    result = {
        "score": score,
        "risk": risk,
        "reasons": reasons,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    analysis_history.append({**result, "wallet_address": request.wallet_address})
    return result

@app.get("/transactions/{wallet}", response_model=List[Transaction])
async def get_transactions(wallet: str):
    # Simulated transaction history
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
    # Return recent high-risk findings
    return [item for item in analysis_history if item["risk"] == "High"][-5:]

@app.get("/")
async def root():
    return {"status": "online", "engine": "TXS v1.0.0", "blockchain": "Algorand"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from algosdk.v2client import indexer
from typing import Dict, Any, List
from datetime import datetime
import time
import random

from .scoring import calculate_risk_score
from .patterns import check_rapid_repeat, check_circular_flow
from .explanation import generate_reasons

# Mock Database / Registry
FLAGGED_WALLETS = [
    "AAAAA_SCAM_WALLET_DO_NOT_SEND",
    "PRTM9YVZW8KLNHQX7GCM2BU6XIE4S3D5ZF1VRYJA", # High risk sample
]

class TXSEngine:
    def __init__(self):
        self.indexer_client = indexer.IndexerClient(
            "", 
            "https://testnet-idx.algonode.cloud", 
            headers={}
        )

    def fetch_transactions(self, address: str) -> List[Dict[str, Any]]:
        try:
            response = self.indexer_client.search_transactions_by_address(address, limit=100)
            return response.get("transactions", [])
        except Exception as e:
            print(f"Indexer API Error: {e}. Falling back to simulation.")
            return [{"mock": True}] * random.randint(5, 50)

    def parse_wallet_data(self, address: str, transactions: list) -> dict:
        is_mock = transactions[0].get("mock", False) if transactions else False
        
        if is_mock or not transactions:
            return {
                "tx_count": len(transactions),
                "avg_tx_per_day": random.uniform(1.0, 25.0) if transactions else 0,
                "wallet_age_days": random.randint(1, 100) if transactions else 0,
                "unique_addresses": random.randint(1, 60) if transactions else 0,
                "max_tx_amount": random.uniform(10.0, 5000.0) if transactions else 0,
                "rapid_repeat_tx": check_rapid_repeat(transactions),
                "circular_flow_detected": check_circular_flow(transactions),
                "is_real_data": False
            }
            
        # Parse real data
        tx_count = len(transactions)
        
        timestamps = [tx.get("round-time") for tx in transactions if tx.get("round-time")]
        if timestamps:
            min_ts = min(timestamps)
            max_ts = max(timestamps)
            wallet_age_seconds = max(max_ts - min_ts, 1) # Prevent div by zero
            wallet_age_days = float(wallet_age_seconds) / (24 * 3600)
        else:
            wallet_age_days = 0
            
        avg_tx_per_day = tx_count / wallet_age_days if wallet_age_days > 0 else tx_count
        
        counterparties = set()
        max_amount = 0.0
        
        for tx in transactions:
            ptx = tx.get("payment-transaction", {})
            if ptx:
                amt = ptx.get("amount", 0) / 1000000.0 # Convert microAlgos to ALGO
                if amt > max_amount:
                    max_amount = amt
                receiver = ptx.get("receiver")
                if receiver and receiver != address:
                    counterparties.add(receiver)
            sender = tx.get("sender")
            if sender and sender != address:
                counterparties.add(sender)
                
        return {
            "tx_count": tx_count,
            "avg_tx_per_day": avg_tx_per_day,
            "wallet_age_days": wallet_age_days,
            "unique_addresses": len(counterparties),
            "max_tx_amount": max_amount,
            "rapid_repeat_tx": check_rapid_repeat(transactions),
            "circular_flow_detected": check_circular_flow(transactions),
            "is_real_data": True
        }

    def analyze_wallet(self, address: str) -> Dict[str, Any]:
        transactions = self.fetch_transactions(address)
        
        wallet_data = self.parse_wallet_data(address, transactions)
        
        # Override for flagged wallets
        if address in FLAGGED_WALLETS:
            return {
                "score": 95,
                "risk": "HIGH",
                "reasons": ["DIRECT LINK: Identified as a high-risk or flagged entity"],
                "breakdown": {"activity": 25, "frequency": 25, "recency": 20, "interaction": 0, "large_tx": 0, "pattern": 25},
                "tx_count": wallet_data["tx_count"],
                "is_real_data": wallet_data["is_real_data"]
            }
            
        # Calculate scores
        result = calculate_risk_score(wallet_data)
        
        # Generate explanations
        reasons = generate_reasons(wallet_data)
        
        return {
            "score": result["score"],
            "risk": result["risk"],
            "reasons": reasons,
            "breakdown": result["breakdown"],
            "tx_count": wallet_data["tx_count"],
            "is_real_data": wallet_data["is_real_data"]
        }

engine = TXSEngine()

def analyze_wallet(address: str):
    return engine.analyze_wallet(address)

from .txs_engine.analyzer import analyze_wallet

def receiver_is_new(wallet_data: dict) -> bool:
    return wallet_data.get("tx_count", 1) == 0

def receiver_flagged(wallet_data: dict) -> bool:
    return wallet_data.get("risk", "LOW") == "HIGH"

def simulate_transaction(tx_data: dict) -> dict:
    result = {}
    risks = []
    warnings = []
    
    amount = tx_data.get("amount", 0.0)
    receiver = tx_data.get("to")
    sender = tx_data.get("from")
    
    # 1. Basic transfer simulation
    result["action"] = f"Transfer {amount} ALGO to {receiver[:8]}..."
    
    # 2. Analyze Receiver via TXS Engine
    receiver_analysis = analyze_wallet(receiver)

    # 3. Risk checks
    if amount > 10.0:
        risks.append("large_amount")
        warnings.append("Large transaction amount")

    if receiver_is_new(receiver_analysis):
        risks.append("new_receiver")
        warnings.append("Receiver wallet is new / no history")

    if receiver_flagged(receiver_analysis):
        risks.append("flagged_receiver")
        warnings.append("Receiver has suspicious activity (HIGH RISK)")

    # 4. Final Risk score (Blended)
    simulation_score = len(risks) * 20
    final_score = (simulation_score + receiver_analysis["score"]) / 2
    final_score = min(final_score, 100)
    
    risk_level = "LOW"
    if final_score > 30:
        risk_level = "MEDIUM"
    if final_score > 70:
        risk_level = "HIGH"
        
    recommendation = "Safe to proceed"
    if risk_level == "MEDIUM":
        recommendation = "Proceed with caution"
    elif risk_level == "HIGH":
        recommendation = "Strongly advise against transaction"

    if not warnings:
        warnings.append("No immediate red flags detected")

    return {
        "simulation": result["action"],
        "risk_score": final_score,
        "risk_level": risk_level,
        "warnings": warnings,
        "recommendation": recommendation,
        "receiver_analysis": receiver_analysis
    }

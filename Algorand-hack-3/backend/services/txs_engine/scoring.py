def get_activity_score(tx_count: int) -> int:
    if tx_count < 5: return 5
    elif tx_count < 20: return 15
    elif tx_count < 50: return 25
    else: return 35

def get_frequency_score(avg_tx_per_day: float) -> int:
    if avg_tx_per_day > 20: return 25
    elif avg_tx_per_day > 10: return 15
    elif avg_tx_per_day > 5: return 10
    return 0

def get_recency_score(wallet_age_days: int) -> int:
    if wallet_age_days < 7: return 25
    elif wallet_age_days < 30: return 15
    return 0

def get_interaction_score(unique_addresses: int) -> int:
    if unique_addresses == 0: return 0
    elif unique_addresses < 3: return 15
    elif unique_addresses > 50: return 20
    return 0

def calculate_risk_score(data: dict) -> dict:
    activity_score = get_activity_score(data.get("tx_count", 0))
    frequency_score = get_frequency_score(data.get("avg_tx_per_day", 0))
    recency_score = get_recency_score(data.get("wallet_age_days", 100))
    interaction_score = get_interaction_score(data.get("unique_addresses", 0))
    
    # Large TX
    max_amount = data.get("max_tx_amount", 0)
    large_tx_score = 15 if max_amount > 1000.0 else 0

    # Patterns
    pattern_score = 0
    if data.get("rapid_repeat_tx"): pattern_score += 20
    if data.get("circular_flow_detected"): pattern_score += 25
    
    total_score = activity_score + frequency_score + recency_score + interaction_score + large_tx_score + pattern_score
    total_score = min(total_score, 100)
    total_score = max(total_score, 5) # Minimum 5 for existing wallets
    
    if data.get("tx_count", 0) == 0:
        total_score = 15 # New empty wallet
        
    # Classification
    if total_score <= 30:
        risk_level = "LOW"
    elif total_score <= 70:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"
        
    return {
        "score": total_score,
        "risk": risk_level,
        "breakdown": {
            "activity": activity_score,
            "frequency": frequency_score,
            "recency": recency_score,
            "interaction": interaction_score,
            "large_tx": large_tx_score,
            "pattern": pattern_score
        }
    }

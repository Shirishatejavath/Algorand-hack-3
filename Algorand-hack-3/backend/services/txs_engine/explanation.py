def generate_reasons(data: dict) -> list:
    """
    Translates extracted factors into human-readable reasons.
    """
    reasons = []
    
    tx_count = data.get("tx_count", 0)
    avg_tx_per_day = data.get("avg_tx_per_day", 0)
    wallet_age = data.get("wallet_age_days", 100)
    
    if tx_count == 0:
        reasons.append("New wallet with no history")
    elif tx_count > 50:
        reasons.append("High transaction activity detected")
        
    if avg_tx_per_day > 10:
        reasons.append("High frequency transactions observed")
        
    if wallet_age < 7:
        reasons.append("New wallet with limited history")
        
    if data.get("unique_addresses", 0) < 3 and tx_count > 10:
        reasons.append("Suspicious interaction pattern (few counterparties)")
        
    if data.get("max_tx_amount", 0) > 1000.0:
        reasons.append("Large transaction amounts detected")
        
    if data.get("rapid_repeat_tx"):
        reasons.append("Repeated transactions in short time")
        
    if data.get("circular_flow_detected"):
        reasons.append("Irregular or circular flow of funds detected")
        
    if not reasons:
        reasons.append("Activity aligns with normal usage patterns")
        
    return reasons

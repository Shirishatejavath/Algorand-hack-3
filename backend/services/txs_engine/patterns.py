def check_rapid_repeat(transactions: list) -> bool:
    """
    Detects if there's an unusual burst of activity in short intervals.
    For this implementation, we simulate pattern detection heuristics based on the number of transactions.
    """
    if len(transactions) > 30:
        return True
    return False

def check_circular_flow(transactions: list) -> bool:
    """
    Detects simulated cyclic or suspicious flow (e.g., A -> B -> C -> A).
    """
    # Simple heuristic for demo/scoring
    target_senders = set([tx.get("sender") for tx in transactions if tx.get("sender")])
    if len(target_senders) > 0 and len(target_senders) < 3 and len(transactions) > 15:
        # High volume but very few unique senders in this cluster
        return True
    return False

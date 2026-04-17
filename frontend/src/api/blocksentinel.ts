const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface AnalysisResult {
  score: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  reasons: string[];
  breakdown?: {
    activity: number;
    frequency: number;
    recency: number;
    interaction: number;
    large_tx: number;
    pattern: number;
  };
  timestamp: string;
  tx_count: number;
  is_real_data: boolean;
  metadata?: {
    node_latency_ms: number;
    inference_time_ms: number;
    engine_version: string;
    confidence_score: number;
  };
  heuristic_logs?: string[];
}

export interface SimulationResult {
  simulation: string;
  risk_score: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  warnings: string[];
  recommendation: string;
}

export async function analyzeWallet(walletAddress: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_URL}/analyze-wallet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wallet_address: walletAddress }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Server error' }));
    throw new Error(err.detail || 'Failed to analyze wallet');
  }
  return response.json();
}

export async function simulateTransaction(
  fromWallet: string,
  toWallet: string,
  amount: number,
  asset = 'ALGO'
): Promise<SimulationResult> {
  const response = await fetch(`${API_URL}/simulate-transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from_wallet: fromWallet,
      to_wallet: toWallet,
      amount,
      asset,
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: 'Server error' }));
    throw new Error(err.detail || 'Failed to simulate transaction');
  }
  return response.json();
}

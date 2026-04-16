const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface BackendAnalysisResponse {
    score: number;
    risk: string;
    reasons: string[];
    timestamp: string;
}

export const analyzeWallet = async (walletAddress: string): Promise<BackendAnalysisResponse> => {
    const response = await fetch(`${API_BASE_URL}/analyze-wallet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: walletAddress }),
    });

    if (!response.ok) {
        throw new Error('Failed to analyze wallet');
    }

    return response.json();
};

export const getTransactions = async (walletAddress: string) => {
    const response = await fetch(`${API_BASE_URL}/transactions/${walletAddress}`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
};

export const getAlerts = async () => {
    const response = await fetch(`${API_BASE_URL}/alerts`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
};

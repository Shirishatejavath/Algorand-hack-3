export type RiskLevel = 'low' | 'medium' | 'high';

export interface RiskFactor {
    reason: string;
    severity: number;
}

export interface TXSResult {
    walletAddress: string;
    txsScore: number; // 0-100
    riskLevel: RiskLevel;
    riskFactors: RiskFactor[];
    analysisTime: number; // ms
    timestamp: string;
    transactionCount: number;
    network: 'algorand';
}

// Simulate TXS Engine analysis (placeholder for real Algorand Indexer integration)
export async function analyzWallet(address: string): Promise<TXSResult> {
    await new Promise((r) => setTimeout(r, 1400 + Math.random() * 800));

    // Deterministic-ish score based on address characteristics
    const charSum = address.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const seed = charSum % 100;

    let txsScore: number;
    let riskFactors: RiskFactor[] = [];

    // Known blacklisted addresses (demo)
    const blacklisted = ['AAAAA', 'SCAM1', 'FRAUD'];
    const isBlacklisted = blacklisted.some(b => address.toUpperCase().includes(b));

    if (isBlacklisted) {
        txsScore = 85 + Math.floor(Math.random() * 15);
        riskFactors = [
            { reason: 'Address found on known scam registry', severity: 90 },
            { reason: 'Associated with blacklisted wallet cluster', severity: 80 },
            { reason: 'Multiple phishing reports linked', severity: 75 },
        ];
    } else if (seed < 30) {
        txsScore = 5 + Math.floor(seed * 0.8);
        riskFactors = [
            { reason: 'Normal transaction frequency', severity: 5 },
            { reason: 'No suspicious wallet interactions detected', severity: 0 },
        ];
    } else if (seed < 65) {
        txsScore = 35 + Math.floor((seed - 30) * 0.9);
        riskFactors = [
            { reason: 'Interacted with 2 medium-risk wallets', severity: 40 },
            { reason: 'Above-average transaction volume in 24h', severity: 30 },
            { reason: 'New wallet — limited history available', severity: 25 },
        ];
    } else {
        txsScore = 68 + Math.floor((seed - 65) * 0.9);
        riskFactors = [
            { reason: 'High-frequency micro-transactions detected', severity: 70 },
            { reason: 'Linked to flagged mixer-like wallet patterns', severity: 65 },
            { reason: 'Rapid fund movement across multiple addresses', severity: 60 },
            { reason: 'Connected to 4 previously flagged wallets', severity: 55 },
        ];
    }

    const riskLevel: RiskLevel =
        txsScore < 34 ? 'low' : txsScore < 67 ? 'medium' : 'high';

    return {
        walletAddress: address,
        txsScore,
        riskLevel,
        riskFactors,
        analysisTime: Math.floor(1400 + Math.random() * 800),
        timestamp: new Date().toISOString(),
        transactionCount: Math.floor(50 + Math.random() * 500),
        network: 'algorand',
    };
}

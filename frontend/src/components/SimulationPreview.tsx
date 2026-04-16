import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import type { SimulationResult } from '../api/blocksentinel';

interface SimulationPreviewProps {
  fromWallet: string;
  toWallet: string;
  amount: number;
  result: SimulationResult | null;
  loading: boolean;
}

const riskColor = {
  LOW: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-400' },
  MEDIUM: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-400' },
  HIGH: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-400' },
};

export default function SimulationPreview({ fromWallet, toWallet, amount, result, loading }: SimulationPreviewProps) {
  const colors = result ? riskColor[result.risk_level] : riskColor.LOW;
  const shortTo = toWallet ? `${toWallet.slice(0, 8)}...${toWallet.slice(-6)}` : '';
  const shortFrom = fromWallet ? `${fromWallet.slice(0, 8)}...${fromWallet.slice(-6)}` : '—';

  return (
    <div
      className="rounded-2xl border border-white/10 overflow-hidden"
      style={{ backgroundColor: '#121826' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
        <TrendingUp size={18} className="text-indigo-400" />
        <span className="font-semibold text-white text-sm">Transaction Simulation</span>
        <span className="ml-auto text-xs text-white/40 flex items-center gap-1">
          <Clock size={11} /> Pre-flight Analysis
        </span>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Transfer summary */}
        <div className="rounded-xl border border-white/8 bg-white/3 px-4 py-4">
          <p className="text-xs text-white/40 mb-3 uppercase tracking-widest font-medium">You are about to</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/50 mb-0.5">From</p>
              <p className="text-sm font-mono text-white/80 truncate">{shortFrom}</p>
            </div>
            <div className="w-8 h-px bg-indigo-500/50 relative">
              <div className="absolute -top-1 right-0 w-2 h-2 border-t border-r border-indigo-500/50 rotate-45" />
            </div>
            <div className="flex-1 min-w-0 text-right">
              <p className="text-xs text-white/50 mb-0.5">To</p>
              <p className="text-sm font-mono text-white/80 truncate">{shortTo}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between">
            <span className="text-xs text-white/50">Amount</span>
            <span className="text-lg font-bold text-white">{amount} <span className="text-indigo-400 text-sm">ALGO</span></span>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-8 gap-3">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-white/50">Running simulation...</span>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <>
            {/* Risk level badge */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${colors.bg} ${colors.border}`}>
              <span className="text-sm font-medium text-white/80">Simulation Risk Level</span>
              <div className={`flex items-center gap-2 font-bold text-sm ${colors.text}`}>
                <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                {result.risk_level}
              </div>
            </div>

            {/* Expected Outcome */}
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
              <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-400 mb-0.5">Expected Outcome</p>
                <p className="text-sm text-white/70">Funds will be transferred on-chain (if proceeded)</p>
              </div>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-2">⚠ Potential Risks</p>
                <div className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <div key={i} className="flex items-start gap-2.5 px-3 py-2 rounded-lg bg-amber-500/8 border border-amber-500/20">
                      <AlertTriangle size={13} className="text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-amber-200/80">{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colors.bg} ${colors.border}`}>
              <span className="text-xs text-white/50">Recommendation</span>
              <span className={`ml-auto text-sm font-semibold ${colors.text}`}>
                {result.recommendation}
              </span>
            </div>
          </>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <div className="text-center py-6">
            <p className="text-sm text-white/30">Simulation results will appear after analysis</p>
          </div>
        )}
      </div>
    </div>
  );
}

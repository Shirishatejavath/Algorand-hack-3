import { ShieldCheck, AlertTriangle, XCircle, Activity, Clock, Users, Zap } from 'lucide-react';
import type { ReactElement } from 'react';
import type { AnalysisResult } from '../api/blocksentinel';

interface RiskResultProps {
  result: AnalysisResult;
  walletAddress: string;
}

const riskConfig = {
  LOW: {
    label: 'LOW RISK',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: '0 0 30px rgba(16,185,129,0.15)',
    icon: <ShieldCheck size={20} className="text-emerald-400" />,
    barColor: '#22c55e',
    gradient: 'from-emerald-500/20 to-transparent',
  },
  MEDIUM: {
    label: 'MEDIUM RISK',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: '0 0 30px rgba(245,158,11,0.15)',
    icon: <AlertTriangle size={20} className="text-amber-400" />,
    barColor: '#f59e0b',
    gradient: 'from-amber-500/20 to-transparent',
  },
  HIGH: {
    label: 'HIGH RISK',
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    glow: '0 0 30px rgba(239,68,68,0.15)',
    icon: <XCircle size={20} className="text-red-400" />,
    barColor: '#ef4444',
    gradient: 'from-red-500/20 to-transparent',
  },
};

const breakdownIcons: Record<string, ReactElement> = {
  activity: <Activity size={12} />,
  frequency: <Zap size={12} />,
  recency: <Clock size={12} />,
  interaction: <Users size={12} />,
  large_tx: <AlertTriangle size={12} />,
  pattern: <Zap size={12} />,
};

const breakdownLabels: Record<string, string> = {
  activity: 'Activity',
  frequency: 'Frequency',
  recency: 'Recency',
  interaction: 'Counterparty',
  large_tx: 'Large Tx',
  pattern: 'Pattern',
};

export default function RiskResult({ result, walletAddress }: RiskResultProps) {
  const config = riskConfig[result.risk];
  const shortAddress = `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`;

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${config.border}`}
      style={{ backgroundColor: '#121826', boxShadow: config.glow }}
    >
      {/* Header */}
      <div className={`px-6 py-4 border-b ${config.border} bg-gradient-to-r ${config.gradient}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {config.icon}
            <div>
              <p className="text-xs text-white/50 font-medium uppercase tracking-widest">Risk Analysis</p>
              <p className="font-mono text-xs text-white/40 mt-0.5">{shortAddress}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-black ${config.text}`}>{result.score}</div>
            <div className={`text-xs font-bold ${config.text} mt-0.5`}>{config.label}</div>
          </div>
        </div>

        {/* Score bar */}
        <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${result.score}%`, backgroundColor: config.barColor }}
          />
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Data source badge */}
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
            result.is_real_data
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${result.is_real_data ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {result.is_real_data ? `${result.tx_count} on-chain txs` : 'Simulated data'}
          </span>
          <span className="text-xs text-white/30">{result.timestamp}</span>
        </div>

        {/* Reasons */}
        <div>
          <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-3">Risk Factors Detected</p>
          <div className="space-y-2">
            {result.reasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-white/3 border border-white/8">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${config.text.replace('text-', 'bg-')}`} />
                <span className="text-sm text-white/70">{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Score Breakdown */}
        {result.breakdown && (
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-medium mb-3">Score Breakdown</p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(result.breakdown).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/3 border border-white/8">
                  <span className="text-white/40">{breakdownIcons[key] || <Zap size={12} />}</span>
                  <span className="text-xs text-white/60 flex-1">{breakdownLabels[key] || key}</span>
                  <span className={`text-xs font-bold ${val > 0 ? config.text : 'text-white/30'}`}>
                    +{val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Clock, Shield } from 'lucide-react';
import type { AnalysisResult } from '../api/blocksentinel';

interface RecentAnalysesProps {
  history: { wallet: string; result: AnalysisResult }[];
  onSelect: (wallet: string) => void;
}

const riskColors = {
  LOW: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  MEDIUM: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  HIGH: 'text-red-400 border-red-500/30 bg-red-500/10',
};

export default function RecentAnalyses({ history, onSelect }: RecentAnalysesProps) {
  if (history.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ backgroundColor: '#121826' }}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
        <Clock size={16} className="text-white/40" />
        <span className="text-sm font-semibold text-white">Recent Analyses</span>
      </div>
      <div className="divide-y divide-white/5">
        {history.slice().reverse().slice(0, 5).map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item.wallet)}
            className="w-full flex items-center justify-between px-6 py-3 hover:bg-white/3 transition-colors group text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Shield size={13} className="text-indigo-400 shrink-0" />
              <span className="text-xs font-mono text-white/60 truncate group-hover:text-white/80 transition-colors">
                {item.wallet.slice(0, 12)}...{item.wallet.slice(-6)}
              </span>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full border ml-3 shrink-0 ${riskColors[item.result.risk]}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {item.result.risk} ({item.result.score})
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

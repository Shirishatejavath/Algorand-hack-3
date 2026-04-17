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
    <div className="glass-premium overflow-hidden animate-scale-in border-white/5">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-accent-blue opacity-70" />
          <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Sentinel Audit Log</span>
        </div>
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Last 5 Sessions</span>
      </div>
      <div className="divide-y divide-white/5">
        {history.slice().reverse().slice(0, 5).map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item.wallet)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.04] transition-all group text-left"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-accent-blue/30 transition-colors">
                <Shield size={14} className="text-accent-blue opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 truncate group-hover:text-white transition-colors tracking-tight">
                {item.wallet.slice(0, 16)}...{item.wallet.slice(-8)}
              </span>
            </div>
            <div className={`flex items-center gap-2 text-[9px] font-black px-3 py-1 rounded border ml-4 shrink-0 uppercase tracking-widest ${riskColors[item.result.risk]}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {item.result.risk} <span className="opacity-50 font-bold">({item.result.score})</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

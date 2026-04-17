import { ShieldCheck, AlertTriangle, XCircle, Activity, Zap, Terminal, Database, Server, Lock, CheckCircle } from 'lucide-react';
import type { ReactElement } from 'react';
import type { AnalysisResult } from '../api/blocksentinel';
import React, { useEffect, useState } from 'react';

// ─── Pre-Transaction Prevention Layer ──────────────────────────────────────
function PreventionBanner({ risk }: { risk: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const [acknowledged, setAcknowledged] = useState(false);

  if (risk === 'LOW') {
    return (
      <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 animate-scale-in">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
          <CheckCircle size={22} className="text-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-black text-emerald-400 uppercase tracking-widest">TXS Engine Clearance — Safe to Proceed</p>
          <p className="text-xs text-slate-500 mt-0.5">No threat signals detected. Behavioral analysis indicates low risk activity.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Cleared</span>
        </div>
      </div>
    );
  }

  if (risk === 'MEDIUM') {
    return (
      <div className="rounded-2xl overflow-hidden border border-amber-500/30 animate-scale-in">
        <div className="flex items-center gap-4 px-6 py-5 bg-amber-500/10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-amber-400 uppercase tracking-widest">TXS Prevention Warning — Proceed with Caution</p>
            <p className="text-xs text-slate-500 mt-0.5">Unusual patterns detected. TXS Engine recommends reviewing findings before interacting with this wallet.</p>
          </div>
        </div>
        <div className="px-6 py-4 bg-amber-500/5 border-t border-amber-500/15 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={e => setAcknowledged(e.target.checked)}
              className="w-4 h-4 accent-amber-400 cursor-pointer"
            />
            <span className="text-xs text-slate-400 group-hover:text-white transition-colors">
              I understand the risks and accept responsibility for this interaction
            </span>
          </label>
          <button
            disabled={!acknowledged}
            className="ml-auto shrink-0 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
              disabled:bg-white/5 disabled:text-slate-600 disabled:cursor-not-allowed disabled:border-white/5
              enabled:bg-amber-500/20 enabled:text-amber-300 enabled:border-amber-500/30 enabled:hover:bg-amber-500/30
              border flex items-center gap-2"
          >
            {!acknowledged && <Lock size={12} />}
            {acknowledged ? 'Proceed (Acknowledged)' : 'Locked — Acknowledge First'}
          </button>
        </div>
      </div>
    );
  }

  // HIGH risk — hard warning, action permanently soft-blocked
  return (
    <div className="rounded-2xl overflow-hidden border border-red-500/40 animate-scale-in">
      <div className="flex items-start gap-4 px-6 py-5 bg-red-500/10">
        <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
          <XCircle size={22} className="text-red-500 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-black text-red-500 uppercase tracking-widest">⛔ TXS Prevention Alert — High-Risk Entity Detected</p>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            This wallet has been identified as a high-risk or fraudulent entity by the TXS Engine.
            Proceeding may result in <span className="text-red-400 font-bold">irreversible financial loss</span>.
            BlockSentinel strongly recommends blocking all interactions.
          </p>
        </div>
      </div>
      <div className="px-6 py-4 bg-red-500/5 border-t border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[10px] font-black text-red-400/70 uppercase tracking-widest">
          <Lock size={12} />
          Action Blocked by TXS Engine — Interaction Not Recommended
        </div>
        <button
          disabled
          className="shrink-0 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-white/[0.03] text-slate-700 border border-white/5 cursor-not-allowed flex items-center gap-2"
        >
          <Lock size={12} />
          Proceed — Blocked
        </button>
      </div>
    </div>
  );
}
// ───────────────────────────────────────────────────────────────────────────

interface RiskResultProps {
  result: AnalysisResult;
  walletAddress: string;
}

const riskConfig = {
  LOW: {
    label: 'SECURE',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: '0 0 40px rgba(16,185,129,0.2)',
    icon: <ShieldCheck size={28} className="text-emerald-400" />,
  },
  MEDIUM: {
    label: 'FLAGGED',
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: '0 0 40px rgba(245,158,11,0.2)',
    icon: <AlertTriangle size={28} className="text-amber-400" />,
  },
  HIGH: {
    label: 'CRITICAL RISK',
    text: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    glow: '0 0 40px rgba(239,68,68,0.25)',
    icon: <XCircle size={28} className="text-red-500" />,
  },
};

const breakdownLabels: Record<string, string> = {
  activity: 'Behavioral Velocity',
  frequency: 'Tx Frequency Rate',
  recency: 'Temporal Recency',
  interaction: 'Counterparty Web',
  large_tx: 'Volume Anomaly',
  pattern: 'Signature Match',
};

// Simulated Typewriter logic for the logs
const TypewriterLog = ({ logs }: { logs: string[] }) => {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < logs.length) {
        setVisibleLogs(prev => [...prev, logs[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 150); // fast terminal speed
    return () => clearInterval(interval);
  }, [logs]);

  return (
    <div className="font-mono text-[10px] sm:text-xs leading-relaxed space-y-1 w-full h-[200px] overflow-y-auto custom-scrollbar pr-2">
      {visibleLogs.map((log, i) => (
        <div key={i} className="animate-slow-fade flex items-start gap-3">
           <span className="text-slate-600 shrink-0 select-none">▶</span>
           <span className={`
             ${log.includes('CRITICAL') || log.includes('FATAL') ? 'text-red-400 font-bold bg-red-400/10 px-1' : ''}
             ${log.includes('DETECTED') ? 'text-amber-400 font-bold' : ''}
             ${log.includes('SYNC') || log.includes('CORE') ? 'text-emerald-400' : 'text-slate-400'}
           `}>
             {log}
           </span>
        </div>
      ))}
      {visibleLogs.length === logs.length && (
        <div className="flex items-center gap-2 mt-2 text-accent-blue animate-pulse">
           <div className="w-2 h-4 bg-accent-blue" />
           <span>AWAITING NEXT COMMAND...</span>
        </div>
      )}
    </div>
  );
};

export default function RiskResult({ result, walletAddress }: RiskResultProps) {
  const config = riskConfig[result.risk];

  return (
    <div className="space-y-5 animate-scale-in">
      
      {/* ── PRE-TRANSACTION PREVENTION LAYER ── */}
      <PreventionBanner risk={result.risk} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT COLUMN: Terminal Output & Deterministic Logs */}
      <div className="lg:col-span-7 space-y-6">

         {/* Main Score Header */}
         <div 
           className={`glass-premium p-6 lg:p-8 flex items-center justify-between border-l-4 ${config.border.replace('border-', 'border-l-')}`}
           style={{ boxShadow: config.glow }}
         >
            <div className="flex items-center gap-5">
               <div className={`p-4 rounded-2xl ${config.bg} border ${config.border}`}>
                  {config.icon}
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-1">Inference Complete</span>
                  <span className="text-sm font-mono text-slate-300 font-bold bg-white/5 px-3 py-1 rounded inline-block w-fit tracking-tighter">{walletAddress}</span>
               </div>
            </div>
            <div className="text-right flex flex-col items-end">
               <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-1 ${config.text}`}>{config.label}</span>
               <span className="text-5xl font-black text-white tracking-tighter">{result.score}</span>
            </div>
         </div>

         {/* Heuristic Terminal Console */}
         <div className="glass-premium overflow-hidden border-white/5">
            <div className="px-6 py-3 border-b border-white/5 bg-navy-950/80 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Terminal size={14} className="text-slate-500" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">TXS Console Output</span>
               </div>
               <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-400/50" />
               </div>
            </div>
            <div className="p-6 bg-[#0a0e17] min-h-[200px]">
               {result.heuristic_logs && result.heuristic_logs.length > 0 ? (
                  <TypewriterLog logs={result.heuristic_logs} />
               ) : (
                  <div className="text-slate-600 font-mono text-xs">No runtime logs emitted...</div>
               )}
            </div>
         </div>
      </div>

      {/* RIGHT COLUMN: Gauges & Metadata */}
      <div className="lg:col-span-5 space-y-6">
         
         {/* Deterministic Metadata Card */}
         <div className="glass-premium p-6 border-accent-blue/10">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-5 block">Execution Metrics</span>
            <div className="space-y-4">
               <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                     <Database size={12} /> Node Latency
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">{result.metadata?.node_latency_ms || 0}ms</span>
               </div>
               <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                     <Activity size={12} /> Inference Engine
                  </div>
                  <span className="text-xs font-mono font-bold text-accent-blue">{result.metadata?.inference_time_ms || 0}ms</span>
               </div>
               <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                     <Server size={12} /> Version Status
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase">{result.metadata?.engine_version || 'N/A'}</span>
               </div>
               <div className="flex items-center justify-between bg-accent-blue/10 px-4 py-3 rounded-xl border border-accent-blue/20">
                  <div className="flex items-center gap-2 text-accent-blue text-[10px] font-black uppercase tracking-widest">
                     <Zap size={12} /> Confidence Index
                  </div>
                  <span className="text-sm font-black text-accent-blue">{result.metadata?.confidence_score || 0}%</span>
               </div>
            </div>
         </div>

         {/* Segmented Gauges (Breakdown) */}
         {result.breakdown && (
            <div className="glass-premium p-6 border-white/5">
               <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 block">Vector Analysis</span>
               
               <div className="space-y-5">
                  {Object.entries(result.breakdown).map(([key, val]) => (
                     <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                           <span>{breakdownLabels[key] || key}</span>
                           <span className={val > 10 ? 'text-red-400' : val > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                              {val > 0 ? `Risk Factor +${val}` : 'Clear'}
                           </span>
                        </div>
                        <div className="flex gap-1 h-1.5 w-full">
                           {/* Create 10 segments for the gauge */}
                           {Array.from({ length: 10 }).map((_, i) => {
                              const activeSegments = Math.ceil(val / 3); // Max score per category is usually ~25-30
                              const isActive = i < activeSegments;
                              const color = i > 6 ? 'bg-red-400 shadow-[0_0_8px_#f87171]' : i > 3 ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-emerald-400 shadow-[0_0_8px_#34d399]';
                              return (
                                 <div 
                                    key={i} 
                                    className={`flex-1 rounded-full bg-white/5 transition-all duration-1000 ${isActive ? color : ''}`}
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                 />
                              );
                           })}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>

      </div>
    </div>
  );
}

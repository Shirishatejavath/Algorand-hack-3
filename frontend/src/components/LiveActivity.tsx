import React, { useState, useEffect } from 'react';
import { Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface Activity {
  id: string;
  type: 'SAFE' | 'RISK' | 'WARN';
  address: string;
  reason: string;
}

const MOCK_REASONS = [
  'Suspicious large volume',
  'Circular flow detected',
  'Rapid automated repeat',
  'New wallet verified',
  'Deterministic score: 98',
  'High-risk counterparty',
];

const MOCK_ADDRESSES = [
  'DMO7K...3EID',
  'PRTM9...RYJA',
  'AAAAA...SEND',
  'KJD83...LK22',
  'LW92M...PQN9',
];

export default function LiveActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: Activity = {
        id: Math.random().toString(36).substr(2, 9),
        type: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'RISK' : 'WARN') : 'SAFE',
        address: MOCK_ADDRESSES[Math.floor(Math.random() * MOCK_ADDRESSES.length)],
        reason: MOCK_REASONS[Math.floor(Math.random() * MOCK_REASONS.length)],
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 10));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-premium overflow-hidden flex flex-col h-full min-h-[450px] animate-scale-in border-accent-blue/10">
      <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-accent-blue animate-ping opacity-50" />
          </div>
          <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Sentinel Surveillance Feed</span>
        </div>
        <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
           <span className="text-[9px] text-slate-500 font-black tracking-widest">TXS-CORE V2.5.1</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
        {activities.map((act) => (
          <div 
            key={act.id} 
            className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group animate-slow-fade"
          >
            <div className={`mt-0.5 p-2 rounded-lg shadow-lg ${
              act.type === 'RISK' ? 'bg-red-500/10 text-red-500 shadow-red-500/10' :
              act.type === 'WARN' ? 'bg-amber-500/10 text-amber-500 shadow-amber-500/10' :
              'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10'
            }`}>
              {act.type === 'SAFE' ? <CheckCircle size={16} /> :
               act.type === 'WARN' ? <AlertCircle size={16} /> :
               <Shield size={16} />}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold text-slate-300 group-hover:text-white transition-colors tracking-tight">{act.address}</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded border ${
                  act.type === 'RISK' ? 'text-red-500 border-red-500/20 bg-red-500/5' :
                  act.type === 'WARN' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' :
                  'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
                }`}>
                  {act.type}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed truncate group-hover:text-slate-400">{act.reason}</p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-2 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Bridging Sentinel Network...</span>
          </div>
        )}
      </div>
      
      {/* Bottom Analytics Pulse */}
      <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
         <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Scan Latency: 4ms</span>
         <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`w-1 h-3 rounded-full bg-accent-blue/20 animate-pulse`} style={{ animationDelay: `${i * 200}ms` }} />
            ))}
         </div>
      </div>
    </div>
  );
}

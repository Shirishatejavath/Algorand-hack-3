import React from 'react';
import { Activity, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const stats = [
  { label: 'Network Scan Rate', value: '1.2M/min', icon: <Activity className="text-accent-blue" />, trend: 'ALGO-MAINNET' },
  { label: 'Sentinel Nodes', value: '42.8k', icon: <ShieldCheck className="text-emerald-400" />, trend: 'ACTIVE' },
  { label: 'Registry Anchors', value: '8.4M+', icon: <Users className="text-accent-purple" />, trend: '+4.2k/hr' },
  { label: 'Inference Precision', value: '99.98%', icon: <TrendingUp className="text-accent-cyan" />, trend: 'PEAK' },
];

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="glass-premium p-6 glass-card-hover animate-scale-in flex flex-col gap-3"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
              {stat.icon}
            </div>
            <span className="text-[9px] font-black px-2 py-1 rounded bg-white/5 text-slate-400 uppercase tracking-widest border border-white/5">
              {stat.trend}
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-white tracking-tighter">{stat.value}</div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

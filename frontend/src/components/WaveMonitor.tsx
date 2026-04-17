import React, { useEffect, useState } from 'react';
import { Activity, Zap, ShieldAlert } from 'lucide-react';

export default function WaveMonitor() {
  const [pulseLine, setPulseLine] = useState<number[]>(new Array(20).fill(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseLine(prev => {
        const next = [...prev.slice(1), Math.floor(Math.random() * 40) + 10];
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 border-white/5 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center">
            <Activity size={18} className="text-accent-blue animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Surveillance Pulse</h3>
            <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <Zap size={10} /> Live Frequency: 1.2 THz
            </p>
          </div>
        </div>
        
        <div className="flex gap-1.5">
           {[1,2,3].map(i => (
             <div key={i} className="w-1.5 h-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 animate-pulse-ring" style={{ animationDelay: `${i * 400}ms` }} />
           ))}
        </div>
      </div>

      {/* Rhythmic Waveform Visualizer */}
      <div className="h-24 flex items-end gap-1 px-2 relative">
         {pulseLine.map((height, i) => (
           <div 
             key={i} 
             className="flex-1 bg-gradient-to-t from-accent-blue/40 to-accent-blue rounded-t-sm transition-all duration-150"
             style={{ height: `${height}%`, opacity: (i + 1) / 20 }}
           />
         ))}
         
         {/* Baseline Grid */}
         <div className="absolute inset-0 border-b border-white/5 pointer-events-none" />
         <div className="absolute inset-x-0 top-1/2 border-t border-white/[0.02] pointer-events-none" />
      </div>

      <div className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
         <span>0.00ms</span>
         <span className="text-accent-blue italic">Full Spectrum Security Active</span>
         <span>Infinite</span>
      </div>

      {/* Floating Scanning UI elements */}
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
         <ShieldAlert size={14} className="text-accent-blue/20" />
      </div>
    </div>
  );
}

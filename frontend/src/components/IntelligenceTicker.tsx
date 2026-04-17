import React from 'react';
import { Radio, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function IntelligenceTicker() {
  const alerts = [
    { label: "NETWORK HEALTH", value: "OPTIMAL (99.9%)", icon: <Activity size={12} /> },
    { label: "THREAT LEVEL", value: "MINIMAL / LOW", icon: <ShieldCheck size={12} /> },
    { label: "SENTINEL PULSE", value: "1.2 THz ACTIVE", icon: <Radio size={12} /> },
    { label: "ON-CHAIN REGISTRY", value: "SYNCED (GENESIS+)", icon: <Zap size={12} /> },
    { label: "MARKET STATUS", value: "SURVEILLANCE LIVE", icon: <Activity size={12} /> }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] h-10 bg-navy-950/90 backdrop-blur-md border-t border-white/10 flex items-center overflow-hidden">
      <div className="flex items-center gap-8 animate-wave pl-6 whitespace-nowrap" style={{ animationDuration: '30s' }}>
        {/* Doubled for seamless loop */}
        {[...alerts, ...alerts, ...alerts].map((alert, i) => (
          <div key={i} className="flex items-center gap-3">
             <div className="text-accent-blue opacity-50">{alert.icon}</div>
             <span className="text-[10px] font-black text-slate-500 tracking-widest">{alert.label}: <span className="text-white italic">{alert.value}</span></span>
             <div className="w-1.5 h-1.5 rounded-full bg-white/10 mx-4" />
          </div>
        ))}
      </div>
      
      {/* Static Label Edge */}
      <div className="absolute right-0 top-0 bottom-0 bg-navy-950 pl-6 pr-6 flex items-center border-l border-white/10 shadow-[-20px_0_30px_rgba(10,14,26,1)] z-10">
         <span className="text-[9px] font-black text-accent-blue uppercase tracking-[0.3em]">BlockSentinel Pulse 0.1v</span>
      </div>
    </div>
  );
}

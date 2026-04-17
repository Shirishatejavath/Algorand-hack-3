import React from 'react';
import { ArrowRight, Shield, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden min-h-[650px] flex items-center mb-16 rounded-[40px] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-navy-950">
      
      {/* BACKGROUND LAYER: Abstract Navy gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-navy-900 via-navy-950 to-black" />

      
      {/* SENTINEL PULSE OVERLAY */}
      <div className="absolute inset-0 z-15 pointer-events-none">
         <div className="absolute inset-10 rounded-[30px] border border-accent-blue/10 animate-sentinel" />
      </div>

      {/* INTELLIGENCE HUB INDICATORS: High Transparency Branding */}
      <div className="absolute top-12 right-12 z-40 hidden xl:flex flex-col gap-4">
        {[
          { label: "Sentinel Integrity", status: "VERIFIED", color: "text-emerald-400" },
          { label: "Threat Intelligence", status: "SYNCHRONIZED", color: "text-accent-blue" },
          { label: "Secure Protocol", status: "ACTIVE .AI", color: "text-accent-purple" }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 px-6 py-3 glass-premium border-white/5 animate-scale-in" style={{ animationDelay: `${idx * 200}ms` }}>
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.4em]">{item.label}</span>
              <span className={`text-[10px] font-black ${item.color} flex items-center gap-2 mt-1 uppercase`}>
                <div className={`w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')} animate-pulse shadow-[0_0_10px_currentColor]`} />
                {item.status}
              </span>
            </div>
            <Shield size={16} className="text-white/20 ml-2" />
          </div>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="relative z-30 max-w-4xl px-12 py-16 animate-slow-fade">
        <div className="inline-flex items-center gap-5 mb-12">
           <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center border-[3px] border-accent-blue shadow-[0_20px_40px_rgba(59,130,246,0.25)] animate-float overflow-hidden">
              <img src="/logo.png" alt="BlockSentinel Logo" className="h-full w-full object-cover" />
           </div>
           <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue/5 border border-accent-blue/20 text-accent-blue text-[10px] font-black tracking-[0.3em] uppercase mb-2">
                <Shield size={14} />
                Sentinel Intel Hub
              </div>
              <h4 className="text-[12px] font-black text-white italic tracking-[0.1em]">BLOCK<span className="text-accent-blue">SENTINEL</span>.ai</h4>
           </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] mb-12 tracking-tighter">
          Secure every <br/>
          <span className="text-gradient-blue italic">crypto transaction.</span>
        </h1>
        
        <p className="text-xl text-slate-400 max-w-xl mb-14 leading-relaxed font-medium">
          A prestigious intelligence layer for deterministic transaction security. 
          Protecting every node, every wallet, every block.
        </p>
        
        <div className="flex flex-wrap gap-8 items-center">
          <a href="#analyze" className="px-14 py-5 bg-accent-blue hover:bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_25px_50px_-12px_rgba(59,130,246,0.4)] text-sm uppercase tracking-widest group">
            ACTIVATE SENTINEL <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
          
          <div className="flex flex-col px-6 border-l border-white/10">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Surveillance Power</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">1.2 Trillion Data Points / Hour</span>
          </div>
        </div>
      </div>
      
      {/* PRESTIGIOUS SAPPHIRE SCAN LINE */}
      <div className="absolute inset-0 z-25 pointer-events-none overflow-hidden opacity-30">
         <div className="w-[150%] h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-v2" />
      </div>

      {/* DATA HUB TERMINAL */}
      <div className="absolute bottom-10 left-12 z-40 hidden md:block">
         <div className="flex items-center gap-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">
            <Zap size={12} className="text-accent-blue" />
            BlockSentinel.ai — Absolute Protocol Protection Established
         </div>
      </div>
    </div>
  );
}

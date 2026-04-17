import React from 'react';
import { Target, Lightbulb, Compass, Milestone, ShieldCheck, Cpu, Zap, Radio } from 'lucide-react';

export default function VisionPortal() {
  return (
    <div className="space-y-16 animate-slow-fade pb-20">
      
      {/* SECTION 1: EXECUTIVE SUMMARY / THE IDEA */}
      <section className="text-center max-w-3xl mx-auto space-y-6 pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] font-black uppercase tracking-widest mb-4">
          <Lightbulb size={12} />
          The Execution Idea
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
          Redefining On-Chain <span className="text-gradient-blue italic">Transparency</span>
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed font-medium">
          Blockchain is immutable, but human error is inevitable. BlockSentinel.ai is the missing intelligence layer 
          that bridges the gap between complex network protocols and user safety.
        </p>
      </section>

      {/* SECTION 2: THE WHITE PAPER (FUNCTIONALITY & TRUST) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-10 space-y-6 border-white/10 flex flex-col justify-center">
          <div className="w-14 h-14 rounded-2xl bg-accent-blue/10 flex items-center justify-center mb-2 shadow-2xl shadow-blue-500/10">
            <Cpu size={28} className="text-accent-blue" />
          </div>
          <h2 className="text-3xl font-black text-white">How it Works: The TXS Engine</h2>
          <p className="text-slate-400 leading-relaxed font-medium">
            Unlike traditional blacklists that wait for a scam to happen, our **Deterministic Transaction Security (TXS) Engine** 
            analyzes live behavioral data from the Algorand Indexer API.
          </p>
          <ul className="space-y-4 pt-4">
            {[
              { icon: Zap, label: "Deterministic Heuristics", text: "We identify malicious logic patterns before they reach the mempool." },
              { icon: ShieldCheck, label: "On-Chain Anchoring", text: "Every high-risk signal is hashed and registered on Algorand for permanent verification." },
              { icon: Radio, label: "Real-Time Surveillance", text: "Continuous network scanning ensures zero-latency threat detection." }
            ].map((item, idx) => (
              <li key={idx} className="flex gap-4 items-start">
                <div className="mt-1 p-1 rounded-md bg-white/5"><item.icon size={16} className="text-accent-blue" /></div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider">{item.label}</h4>
                  <p className="text-xs text-slate-500">{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-10 space-y-8 bg-gradient-to-br from-accent-purple/10 via-transparent to-transparent border-accent-purple/20">
          <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 flex items-center justify-center mb-2 shadow-2xl shadow-purple-500/10">
            <Target size={28} className="text-accent-purple" />
          </div>
          <h2 className="text-3xl font-black text-white italic underline decoration-accent-purple decoration-4 underline-offset-8">Trust & Transparency</h2>
          <p className="text-slate-400 leading-relaxed font-medium">
            Our goal is simple: **Absolute Protocol Integrity**. By moving from reactive security to proactive intelligence, we build the trust infrastructure required for the next billion users on Algorand.
          </p>
          <div className="p-6 rounded-2xl bg-black/40 border border-white/5">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Core Principles</h4>
             <div className="space-y-4">
               <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-300">Privacy First Integration</span>
                 <span className="text-accent-purple font-black uppercase">Active</span>
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="w-full h-full bg-accent-purple rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
               </div>
               <div className="flex items-center justify-between text-xs">
                 <span className="text-slate-300">Open-Source Registry Access</span>
                 <span className="text-emerald-400 font-black uppercase">Live</span>
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="w-full h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: THE FUTURE ROADMAP (PLAN & GOALS) */}
      <section className="space-y-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Compass size={12} />
            The Future Roadmap
          </div>
          <h2 className="text-4xl font-black text-white">The Sentinel <span className="text-emerald-400 italic">Evolution</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { phase: "Phase 1", title: "Foundation", date: "Q1-Q2 2026", desc: "Release of the Core TXS Engine and real-time simulator.", icon: Zap, status: "Done", color: "text-accent-blue" },
            { phase: "Phase 2", title: "Transparency", date: "Q3-Q4 2026", desc: "Launch of the Immutable Risk Registry on Algorand Mainnet.", icon: Radio, status: "In Progress", color: "text-emerald-400" },
            { phase: "Phase 3", title: "Expansion", date: "Q1-Q2 2027", desc: "Cross-chain intelligence and B2B API gateway.", icon: Milestone, status: "Planned", color: "text-accent-purple" },
            { phase: "Phase 4", title: "Governance", date: "Q3-Q4 2027", desc: "Transition to a DAO-managed risk registry protocol.", icon: ShieldCheck, status: "Planned", color: "text-slate-500" }
          ].map((item, idx) => (
            <div key={idx} className="glass-panel p-6 flex flex-col gap-4 border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.phase}</span>
                <span className={`text-[10px] font-black ${item.color} uppercase tracking-widest`}>{item.status}</span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-accent-blue transition-colors">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-600">{item.date}</span>
                <item.icon size={16} className="text-slate-600 group-hover:scale-110 transition-transform" />
              </div>
              
              {/* Subtle background glow */}
              <div className={`absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-[40px] opacity-10 ${item.color.replace('text-', 'bg-')}`} />
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO TRUST */}
      <div className="glass-panel p-12 text-center bg-gradient-to-t from-accent-blue/5 to-transparent border-accent-blue/10">
        <h3 className="text-2xl font-black text-white mb-4 italic underline decoration-accent-blue decoration-2 underline-offset-4 font-mono">Build Secured. Audit Everything.</h3>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed mb-8">
          The goal is simple: Create the standard for transaction security on any blockchain. BlockSentinel 
          is more than a tool; it's the future of trust in normalized on-chain activity.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-3 bg-accent-blue text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20">
            Read Full Docs
          </button>
          <button className="px-8 py-3 bg-white/5 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
            Partner With Us
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Shield, ArrowUpRight, ArrowDownLeft, Zap, ExternalLink, ScrollText } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'RECEIVED' | 'SENT';
  amount: number;
  wallet: string;
  status: 'SECURE' | 'FLAGGED';
  timestamp: string;
}

const MOCK_TXS: Transaction[] = [
  { id: 'TX...83KL', type: 'RECEIVED', amount: 450.00, wallet: 'KJD83...LK22', status: 'SECURE', timestamp: '2h ago' },
  { id: 'TX...M9PQ', type: 'SENT', amount: 25.50, wallet: 'PRTM9...RYJA', status: 'FLAGGED', timestamp: '5h ago' },
  { id: 'TX...7KB8', type: 'RECEIVED', amount: 1200.00, wallet: 'DMO7K...3EID', status: 'SECURE', timestamp: '1d ago' },
];

interface WalletDashboardProps {
  address: string;
}

export default function WalletDashboard({ address }: WalletDashboardProps) {
  return (
    <div className="space-y-8 animate-slow-fade">
      {/* Wallet Header Card: Prestigious Command Center */}
      <div className="glass-premium p-10 bg-gradient-to-br from-accent-blue/5 via-navy-950/40 to-transparent flex flex-col lg:flex-row gap-10 items-center border-accent-blue/10">
        <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center shrink-0 border-2 border-accent-blue shadow-[0_20px_40px_rgba(59,130,246,0.3)] animate-float">
          <Shield size={44} className="text-accent-blue" />
        </div>
        
        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-3">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">Sentinel Command</h3>
            <div className="flex gap-2 justify-center lg:justify-start">
               <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                 Surveillance Active
               </div>
               <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                 DETERMINISTIC
               </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 font-mono mb-6 bg-white/5 py-1.5 px-4 rounded-lg inline-block">{address}</p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Audit Balance</span>
              <span className="text-2xl font-black text-white mt-1 uppercase">1,450.00 ALGO</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden lg:block" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Risk Probability</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 uppercase">Minimal (0.02%)</span>
            </div>
          </div>
        </div>

        <button className="px-8 py-4 glass-premium hover:bg-white/5 text-white transition-all text-[11px] font-black uppercase tracking-widest flex items-center gap-3 active:scale-95 border-white/10 shadow-xl group">
          <ScrollText size={18} className="text-accent-blue group-hover:scale-110 transition-transform" />
          Export Security Vault
        </button>
      </div>

      {/* Featured Transaction Display: Sentinel Audits */}
      <div className="glass-premium overflow-hidden border-white/5">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Recent Sentinel Audit Log</h4>
          <a href="#" className="text-[10px] font-black text-accent-blue flex items-center gap-2 hover:text-white transition-colors uppercase tracking-widest group">
            Global Index <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
        
        <div className="p-6 space-y-4">
          {MOCK_TXS.map((tx) => (
            <div 
              key={tx.id} 
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-6 group transition-all hover:bg-white/[0.04] hover:border-accent-blue/20"
            >
              <div className={`p-4 rounded-xl shadow-lg ${
                tx.type === 'RECEIVED' ? 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10' : 'bg-accent-blue/10 text-accent-blue shadow-blue-500/10'
              }`}>
                {tx.type === 'RECEIVED' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-white group-hover:text-accent-blue transition-colors uppercase tracking-tight">{tx.type === 'RECEIVED' ? 'Secure Node Entry' : 'Surveillance Exit'}</span>
                  <span className={`text-base font-black transition-colors ${
                    tx.type === 'RECEIVED' ? 'text-emerald-500' : 'text-white'
                  }`}>
                    {tx.type === 'RECEIVED' ? '+' : '-'}{tx.amount.toFixed(2)} ALGO
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-bold tracking-widest font-mono uppercase">{tx.wallet}</span>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{tx.timestamp}</span>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end pl-6 border-l border-white/5">
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase mb-1.5 ${
                  tx.status === 'SECURE' ? 'text-emerald-500' : 'text-accent-blue'
                }`}>
                  <Zap size={12} className="animate-pulse" />
                  Audit: {tx.status}
                </div>
                <span className="text-[10px] text-slate-600 font-mono font-bold tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">{tx.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

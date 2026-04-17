import { Settings, ShieldCheck, Zap, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'vision';
  onTabChange: (tab: 'dashboard' | 'vision') => void;
  connectedWallet: string | null;
  onOpenConnectModal: () => void;
  onDisconnectWallet: () => void;
}

export default function Navbar({ activeTab, onTabChange, connectedWallet, onOpenConnectModal, onDisconnectWallet }: NavbarProps) {
  const shortAddress = connectedWallet
    ? `${connectedWallet.slice(0, 6)}...${connectedWallet.slice(-4)}`
    : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-navy-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-4 transition-transform hover:scale-[1.02] group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border-2 border-accent-blue shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all overflow-hidden">
            <img src="/logo.png" alt="BS" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-white text-xl tracking-tighter leading-tight drop-shadow-sm">
              BLOCK<span className="text-accent-blue">SENTINEL</span>.ai
            </span>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">
                 Technical Intelligence
               </p>
            </div>
          </div>
        </button>

        {/* Links */}
        <div className="hidden md:flex items-center gap-10">
          <button 
            onClick={() => onTabChange('dashboard')}
            className={`text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
              activeTab === 'dashboard' ? 'text-accent-blue' : 'text-slate-500 hover:text-white'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'dashboard' ? 'bg-accent-blue animate-pulse' : 'bg-slate-700'}`} />
            Security Lab
          </button>
          
          <button 
            onClick={() => onTabChange('vision')}
            className={`text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
              activeTab === 'vision' ? 'text-accent-blue' : 'text-slate-500 hover:text-white'
            }`}
          >
            Vision Portal
          </button>

          <a href="#" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest hover:border-accent-blue/30 transition-all flex items-center gap-2 group">
             <Zap size={12} className="group-hover:text-accent-blue transition-colors" />
             TXS Engine v2.5.1 Live
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          
          {/* NETWORK SWITCHER (Flexibility Showcase) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 group hover:border-accent-blue/40 transition-all cursor-pointer">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-[10px] font-black text-slate-400 group-hover:text-white uppercase tracking-widest transition-colors">ALGO-MAINNET</span>
             <ChevronRight size={14} className="text-slate-600 group-hover:text-accent-blue rotate-90 transition-all" />
          </div>

          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
          
          {connectedWallet ? (
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/5">
                <ShieldCheck size={14} />
                {shortAddress}
              </div>
              <button
                onClick={onDisconnectWallet}
                className="text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
              >
                Exit
              </button>
            </div>
          ) : (
            <button
              id="btn-connect-wallet"
              onClick={onOpenConnectModal}
              className="px-5 py-2.5 rounded-xl text-sm font-bold border border-accent-blue/50 text-accent-blue bg-accent-blue/5 hover:bg-accent-blue hover:text-white transition-all shadow-lg shadow-blue-500/10"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

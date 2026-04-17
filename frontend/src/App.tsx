import { useState, useCallback } from 'react';
import { Shield, Search, Zap, AlertCircle, ChevronRight, LayoutDashboard, Microscope, Radio } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsGrid from './components/StatsGrid';
import LiveActivity from './components/LiveActivity';
import SimulationPreview from './components/SimulationPreview';
import RiskResult from './components/RiskResult';
import RecentAnalyses from './components/RecentAnalyses';
import WalletModal from './components/WalletModal';
import WalletDashboard from './components/WalletDashboard';
import { analyzeWallet, simulateTransaction } from './api/blocksentinel';
import type { AnalysisResult, SimulationResult } from './api/blocksentinel';

import VisionPortal from './components/VisionPortal';
import WaveMonitor from './components/WaveMonitor';
import IntelligenceTicker from './components/IntelligenceTicker';

type AppState = 'idle' | 'simulating' | 'analyzing' | 'done' | 'error';

interface HistoryItem {
  wallet: string;
  result: AnalysisResult;
}

interface Toast {
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'vision'>('dashboard');
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);


  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletInput, setWalletInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [showSimulation, setShowSimulation] = useState(false);
  const [state, setState] = useState<AppState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleConnectWallet = useCallback(async () => {
    try {
      const { PeraWalletConnect } = await import('@perawallet/connect');
      const peraWallet = new PeraWalletConnect();
      const accounts = await peraWallet.connect();
      if (accounts?.[0]) {
        setConnectedWallet(accounts[0]);
        setWalletInput(accounts[0]);
        setIsWalletModalOpen(false);
        showToast('Wallet connected successfully via Pera');
      }
    } catch (err: any) {
      if (err?.data?.type !== 'CONNECT_MODAL_CLOSED') {
        const demo = 'DEMO7K2ABCXJVLMDGTFZMZSZH7SFBGQX4PNMGFBQSWQLPHXPJ3EIDEMO';
        setConnectedWallet(demo);
        setWalletInput(demo);
        setIsWalletModalOpen(false);
        showToast('Demo Wallet bridged for surveillance test');
      }
    }
  }, [showToast]);

  const handleDeflyConnect = useCallback(async () => {
    try {
      const { DeflyWalletConnect } = await import('@blockshake/defly-connect');
      const deflyWallet = new DeflyWalletConnect();
      const accounts = await deflyWallet.connect();
      if (accounts?.[0]) {
        setConnectedWallet(accounts[0]);
        setWalletInput(accounts[0]);
        setIsWalletModalOpen(false);
        showToast('Wallet connected successfully via Defly');
      }
    } catch (err: any) {
      const demo = 'DEFLY7K2ABCXJVLMDGTFZMZSZH7SFBGQX4PNMGFBQSWQLPHXPJ3EID';
      setConnectedWallet(demo);
      setWalletInput(demo);
      setIsWalletModalOpen(false);
      showToast('Defly Demo Bridge Active');
    }
  }, [showToast]);

  const handleCustomConnect = (address: string) => {
    if (address && address.length >= 10) {
      setConnectedWallet(address);
      setWalletInput(address);
      setIsWalletModalOpen(false);
      showToast('Custom Address Tracked');
    }
  };

  const handleDisconnectWallet = () => {
    setConnectedWallet(null);
    setWalletInput('');
    showToast('Surveillance Session Terminated', 'info');
  };

  const validateInputs = (): string | null => {
    if (!walletInput.trim()) return 'Please enter a target wallet address';
    if (walletInput.trim().length < 10) return 'Invalid wallet address (too short)';
    if (showSimulation) {
      const amt = parseFloat(amountInput);
      if (!amountInput || isNaN(amt) || amt <= 0) return 'Please enter a valid ALGO amount';
      if (!connectedWallet) return 'Connect your wallet to simulate a transaction';
    }
    return null;
  };

  const handleAnalyze = async () => {
    const vErr = validateInputs();
    if (vErr) { setErrorMsg(vErr); setState('error'); return; }

    setErrorMsg('');
    setSimulationResult(null);
    setAnalysisResult(null);

    try {
      if (showSimulation && connectedWallet) {
        setState('simulating');
        const simResult = await simulateTransaction(
          connectedWallet,
          walletInput.trim(),
          parseFloat(amountInput)
        );
        setSimulationResult(simResult);
        showToast('Transaction Simulation Complete');
      }

      setState('analyzing');
      const analysis = await analyzeWallet(walletInput.trim());
      setAnalysisResult(analysis);
      setHistory((prev) => [...prev, { wallet: walletInput.trim(), result: analysis }]);
      setState('done');
      showToast('Full Security Sweep Successful');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to backend engine.');
      setState('error');
      showToast('Engine Connection Error', 'error');
    }
  };

  const handleSelectHistory = (wallet: string) => {
    setWalletInput(wallet);
    setSimulationResult(null);
    setAnalysisResult(null);
    setState('idle');
  };

  const isLoading = state === 'simulating' || state === 'analyzing';

  return (
    <div className="min-h-screen bg-navy-950 relative overflow-hidden">
      
      {/* ALIVE UI BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-alive-grid opacity-20" />
        <div className="floating-blob w-[500px] h-[500px] bg-accent-blue top-[-10%] left-[-10%]" />
        <div className="floating-blob w-[400px] h-[400px] bg-accent-purple bottom-[10%] right-[-5%] animation-delay-2000" style={{ animationDelay: '5s' }} />
        <div className="floating-blob w-[300px] h-[300px] bg-accent-cyan top-[40%] left-[60%]" style={{ animationDelay: '10s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          connectedWallet={connectedWallet}
          onOpenConnectModal={() => setIsWalletModalOpen(true)}
          onDisconnectWallet={handleDisconnectWallet}
        />

        <WalletModal 
          isOpen={isWalletModalOpen} 
          onClose={() => setIsWalletModalOpen(false)} 
          onConnectPera={handleConnectWallet}
          onConnectDefly={handleDeflyConnect}
          onConnectCustom={handleCustomConnect}
        />

        <main className="flex-grow max-w-7xl mx-auto px-6 pt-28 pb-20">
        
        {activeTab === 'dashboard' ? (
          <div className="space-y-6">
            <Hero />
            <StatsGrid />

            <div className="dashboard-grid">
              
              {/* LEFT COLUMN: Main Tools */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {connectedWallet && (
                  <WalletDashboard address={connectedWallet} />
                )}

                <div className="flex items-center justify-between mb-2">
                  <h2 className="flex items-center gap-2.5 text-xl font-black">
                    <Microscope size={22} className="text-accent-blue" />
                    Detection Lab
                  </h2>
                  <div className="flex gap-2">
                    <div className="px-3 py-1 glass-panel text-[10px] font-bold text-accent-cyan border-accent-cyan/20">TESTNET-ACTIVE</div>
                    <div className="px-3 py-1 glass-panel text-[10px] font-bold text-accent-purple border-accent-purple/20">AI-DETERMINISTIC</div>
                  </div>
                </div>

                <div className="glass-panel p-8 animate-scale-in">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="wallet-address" className="block text-xs text-slate-500 mb-3 font-bold uppercase tracking-widest">
                        Target Wallet Address (Recipient)
                      </label>
                      <div className="relative group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-blue transition-colors" />
                        <input
                          id="wallet-address"
                          type="text"
                          value={walletInput}
                          onChange={(e) => setWalletInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                          placeholder="Paste wallet address or select from history..."
                          className="w-full bg-navy-900 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-600 pl-11 pr-4 py-4 focus:outline-none focus:border-accent-blue/50 focus:bg-white/5 transition-all font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                           <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Simulation Mode</p>
                           <button
                            id="toggle-simulation"
                            onClick={() => setShowSimulation((v) => !v)}
                            className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${showSimulation ? 'bg-accent-blue' : 'bg-white/10'}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${showSimulation ? 'translate-x-5' : ''}`} />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 max-w-[240px]">Predict risks and analyze downstream effects before committing funds.</p>
                      </div>

                      {showSimulation && (
                        <div className="flex-1 animate-slow-fade">
                          <label htmlFor="tx-amount" className="block text-xs text-slate-500 mb-2 font-bold uppercase tracking-widest">
                            Amount (ALGO)
                          </label>
                          <input
                            id="tx-amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={amountInput}
                            onChange={(e) => setAmountInput(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-navy-900 border border-white/5 rounded-2xl text-sm text-white placeholder-slate-600 px-4 py-3.5 focus:outline-none focus:border-accent-blue/50 transition-all"
                          />
                        </div>
                      )}
                    </div>

                    {state === 'error' && (
                      <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 animate-scale-in">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        <p className="text-sm font-medium">{errorMsg}</p>
                      </div>
                    )}

                    <button
                      id="btn-analyze"
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="w-full h-14 bg-accent-blue hover:bg-blue-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-2xl font-black text-base transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-blue-500/20"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          SECURE SCANNING...
                        </>
                      ) : (
                        <>
                          <Shield size={18} />
                          {showSimulation ? 'SIMULATE & ANALYZE' : 'RUN SECURITY SCAN'}
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Simulation Results Section */}
                {showSimulation && (simulationResult || state === 'simulating') && (
                  <div className="animate-slow-fade">
                    <SimulationPreview
                      fromWallet={connectedWallet || ''}
                      toWallet={walletInput}
                      amount={parseFloat(amountInput) || 0}
                      result={simulationResult}
                      loading={state === 'simulating'}
                    />
                  </div>
                )}

                {/* Analysis Results Section */}
                {(analysisResult || state === 'analyzing') && (
                  <div className="animate-slow-fade">
                    {state === 'analyzing' ? (
                      <div className="glass-panel p-10 flex flex-col items-center justify-center gap-4 animate-pulse">
                        <div className="w-12 h-12 rounded-full border-4 border-accent-blue/20 border-t-accent-blue animate-spin" />
                        <p className="text-slate-500 font-bold tracking-widest text-xs">DECRYPTING ON-CHAIN PATTERNS...</p>
                      </div>
                    ) : (
                      analysisResult && <RiskResult result={analysisResult} walletAddress={walletInput} />
                    )}
                  </div>
                )}
                
                <RecentAnalyses history={history} onSelect={handleSelectHistory} />
              </div>

              {/* RIGHT COLUMN: Real-time Intelligence */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* UNLOCKED COOL FEATURE: Wave SURVEILLANCE */}
                <WaveMonitor />

                <div className="flex items-center gap-2.5 mb-2">
                  <Radio size={20} className="text-accent-purple" />
                  <h2 className="text-xl font-black italic">Network Watch</h2>
                </div>
                
                <LiveActivity />

                {/* Sidebar Context Card */}
                <div className="glass-panel p-6 bg-gradient-to-br from-accent-purple/5 to-transparent border-accent-purple/10">
                  <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 flex items-center justify-center mb-4">
                    <LayoutDashboard size={24} className="text-accent-purple" />
                  </div>
                  <h3 className="text-lg font-black mb-2">Immutable Protocol</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    Every severe risk identified by BlockSentinel is hashed and registered on the Algorand blockchain for verifiable security.
                  </p>
                  <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all uppercase tracking-widest border border-white/5">
                    Inspect Registry
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <VisionPortal />
        )}

      </main>

      <footer className="border-t border-white/10 py-16 bg-navy-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          
          {/* Branding Hub */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-4 group">
               <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-white/20 shadow-xl group-hover:shadow-accent-blue/20 transition-all overflow-hidden">
                  <img src="/logo.png" alt="BS" className="h-full w-full object-cover" />
               </div>
               <div className="flex flex-col">
                  <span className="font-black text-white text-xl tracking-tighter">BLOCK<span className="text-accent-blue">SENTINEL</span>.AI</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Surveillance Protocol Layer</span>
               </div>
            </div>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Securing every transaction with deterministic behavioral intelligence. Follow our technical updates and join the sentinel network.
            </p>
            
            {/* Social Connectivity */}
            <div className="flex items-center gap-4 pt-2">
              {[
                { icon: 'Twitter', label: 'Follow us', href: '#' },
                { icon: 'Github', label: 'Open Source', href: '#' },
                { icon: 'MessageSquare', label: 'Join Community', href: '#' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-accent-blue hover:bg-white/10 hover:border-accent-blue/30 transition-all group"
                  title={social.label}
                >
                  <span className="sr-only">{social.label}</span>
                  {social.icon === 'Twitter' && <Radio size={18} />}
                  {social.icon === 'Github' && <LayoutDashboard size={18} />}
                  {social.icon === 'MessageSquare' && <Microscope size={18} />}
                </a>
              ))}
            </div>
          </div>

          {/* Technical Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">Resources</h4>
            <div className="flex flex-col gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <a href="#" className="hover:text-accent-blue transition-colors">Documentation</a>
              <a href="#" className="hover:text-accent-blue transition-colors">TXS API Docs</a>
              <a href="#" className="hover:text-accent-blue transition-colors">Risk Registry</a>
              <a href="#" className="hover:text-accent-blue transition-colors">White Paper</a>
            </div>
          </div>

          {/* Status Hub */}
          <div className="space-y-6">
            <h4 className="text-xs font-black text-white uppercase tracking-widest">System Status</h4>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
               <div className="flex items-center justify-between text-[10px]">
                 <span className="text-slate-400">Mainnet Engine</span>
                 <span className="text-emerald-400 font-bold">Operational</span>
               </div>
               <div className="flex items-center justify-between text-[10px]">
                 <span className="text-slate-400">Privacy Relay</span>
                 <span className="text-emerald-400 font-bold">Secure</span>
               </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">© 2026 Algorand Hack Series 3 Submission — BlockSentinel.ai</p>
          <div className="flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </footer>
      {/* TOAST NOTIFICATION SYSTEM */}
      {toast && (
        <div className="fixed top-24 right-8 z-[110] animate-scale-in">
           <div className={`glass-premium px-6 py-4 flex items-center gap-4 rounded-2xl border-l-4 ${
             toast.type === 'error' ? 'border-l-red-500' : toast.type === 'info' ? 'border-l-accent-purple' : 'border-l-emerald-500'
           }`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5`}>
                 <Shield className={toast.type === 'error' ? 'text-red-500' : 'text-accent-blue'} size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">System Notification</span>
                <span className="text-sm font-black text-white">{toast.message}</span>
              </div>
           </div>
        </div>
      )}

      <IntelligenceTicker />
    </div>
  </div>
);
}

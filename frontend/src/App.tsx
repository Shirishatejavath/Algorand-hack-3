import { useState, useCallback } from 'react';
import { Shield, Search, Zap, AlertCircle, ChevronRight } from 'lucide-react';
import Navbar from './components/Navbar';
import SimulationPreview from './components/SimulationPreview';
import RiskResult from './components/RiskResult';
import RecentAnalyses from './components/RecentAnalyses';
import { analyzeWallet, simulateTransaction } from './api/blocksentinel';
import type { AnalysisResult, SimulationResult } from './api/blocksentinel';

type AppState = 'idle' | 'simulating' | 'analyzing' | 'done' | 'error';

interface HistoryItem {
  wallet: string;
  result: AnalysisResult;
}

export default function App() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
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
      }
    } catch (err: any) {
      if (err?.data?.type !== 'CONNECT_MODAL_CLOSED') {
        const demo = 'DEMO7K2ABCXJVLMDGTFZMZSZH7SFBGQX4PNMGFBQSWQLPHXPJ3EIDEMO';
        setConnectedWallet(demo);
        setWalletInput(demo);
      }
    }
  }, []);

  const handleDisconnectWallet = () => {
    setConnectedWallet(null);
    setWalletInput('');
  };

  const validateInputs = (): string | null => {
    if (!walletInput.trim()) return 'Please enter a wallet address';
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
      }

      setState('analyzing');
      const analysis = await analyzeWallet(walletInput.trim());
      setAnalysisResult(analysis);
      setHistory((prev) => [...prev, { wallet: walletInput.trim(), result: analysis }]);
      setState('done');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to backend. Is the server running?');
      setState('error');
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
    <div className="min-h-screen" style={{ backgroundColor: '#0B0F19' }}>
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(79,70,229,0.07)' }} />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(99,102,241,0.05)' }} />

      <Navbar
        connectedWallet={connectedWallet}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      <main className="relative max-w-5xl mx-auto px-6 pt-28 pb-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-medium text-indigo-300 mb-6">
            <Zap size={11} />
            Powered by TXS Engine v2 · Algorand Testnet
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Understand Blockchain Risk<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #818cf8, #6366f1)' }}>
              Before You Sign
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Analyze wallets, simulate transactions, and detect risks in real-time on Algorand.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Input */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ backgroundColor: '#121826' }}>
              <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
                <Shield size={16} className="text-indigo-400" />
                <span className="text-sm font-semibold text-white">Wallet Analysis</span>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div>
                  <label htmlFor="wallet-address" className="block text-xs text-white/50 mb-2 font-medium">
                    Target Wallet Address
                  </label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      id="wallet-address"
                      type="text"
                      value={walletInput}
                      onChange={(e) => setWalletInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                      placeholder="Enter Algorand wallet address..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 pl-9 pr-4 py-3 focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Simulation toggle */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-white/70 font-medium">Enable Simulation Preview</p>
                    <p className="text-xs text-white/35 mt-0.5">Predict risks before sending funds</p>
                  </div>
                  <button
                    id="toggle-simulation"
                    onClick={() => setShowSimulation((v) => !v)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${showSimulation ? 'bg-indigo-600' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${showSimulation ? 'translate-x-5' : ''}`} />
                  </button>
                </div>

                {showSimulation && (
                  <div>
                    <label htmlFor="tx-amount" className="block text-xs text-white/50 mb-2 font-medium">
                      Transaction Amount (ALGO)
                    </label>
                    <input
                      id="tx-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder="e.g. 2.5"
                      className="w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 px-4 py-3 focus:outline-none focus:border-indigo-500/60 transition-all"
                    />
                  </div>
                )}

                {state === 'error' && (
                  <div className="flex items-start gap-2.5 px-3 py-3 rounded-xl bg-red-500/10 border border-red-500/30">
                    <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-300">{errorMsg}</p>
                  </div>
                )}

                <button
                  id="btn-analyze"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {state === 'simulating' ? 'Running simulation...' : 'Analyzing wallet...'}
                    </>
                  ) : (
                    <>
                      <Shield size={15} />
                      {showSimulation ? 'Simulate & Analyze' : 'Analyze Wallet'}
                      <ChevronRight size={14} />
                    </>
                  )}
                </button>

                {!connectedWallet && (
                  <p className="text-center text-xs text-white/30">
                    Or{' '}
                    <button
                      onClick={handleConnectWallet}
                      className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
                    >
                      connect your wallet
                    </button>{' '}
                    to auto-fill
                  </p>
                )}
              </div>
            </div>

            {/* Simulation Preview Card */}
            {showSimulation && (simulationResult || state === 'simulating') && (
              <SimulationPreview
                fromWallet={connectedWallet || ''}
                toWallet={walletInput}
                amount={parseFloat(amountInput) || 0}
                result={simulationResult}
                loading={state === 'simulating'}
              />
            )}

            <RecentAnalyses history={history} onSelect={handleSelectHistory} />
          </div>

          {/* RIGHT: Results */}
          <div>
            {state === 'analyzing' && (
              <div className="rounded-2xl border border-white/10 overflow-hidden animate-pulse" style={{ backgroundColor: '#121826' }}>
                <div className="px-6 py-4 border-b border-white/10">
                  <div className="h-4 w-32 bg-white/10 rounded-lg" />
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-24 bg-white/10 rounded-xl" />
                    <div className="h-12 w-16 bg-white/10 rounded-xl" />
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full" />
                  <div className="space-y-2.5 mt-4">
                    {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-white/5 rounded-xl border border-white/8" />)}
                  </div>
                </div>
              </div>
            )}

            {analysisResult && state === 'done' && (
              <RiskResult result={analysisResult} walletAddress={walletInput} />
            )}

            {(state === 'idle' || state === 'error') && (
              <div className="rounded-2xl border border-white/8 flex flex-col items-center justify-center py-20 text-center" style={{ backgroundColor: '#121826' }}>
                <div className="w-16 h-16 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center mb-5">
                  <Shield size={28} className="text-indigo-400" />
                </div>
                <h2 className="text-white/80 font-semibold text-lg mb-2">Ready to Analyze</h2>
                <p className="text-white/35 text-sm max-w-xs">
                  Enter a wallet address and click Analyze to get an instant risk assessment powered by the TXS Engine.
                </p>
                <div className="flex items-center gap-4 mt-6 text-xs text-white/25">
                  <span>✦ Deterministic scoring</span>
                  <span>✦ Explainable results</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            { label: 'Wallets Analyzed', value: history.length.toString().padStart(3, '0') },
            { label: 'High Risk Flagged', value: history.filter(h => h.result.risk === 'HIGH').length.toString().padStart(3, '0') },
            { label: 'Engine Version', value: 'v2.0' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/8 px-4 py-3 text-center" style={{ backgroundColor: '#121826' }}>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-white/35 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-white/8 mt-8" style={{ backgroundColor: '#0B0F19' }}>
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">© 2026 BlockSentinel.ai — Built on Algorand</p>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <a href="#" className="hover:text-white/60 transition-colors">Docs</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors">GitHub</a>
            <a href="#" className="hover:text-white/60 transition-colors">License</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

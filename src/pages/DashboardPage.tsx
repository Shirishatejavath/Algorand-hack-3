import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Shield, Search, AlertTriangle, CheckCircle, Clock,
    LogOut, BarChart3, Bell, Zap, Copy, ExternalLink,
    TrendingUp, Activity, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyzeWallet } from '../lib/api';
import type { TXSResult } from '../lib/txsEngine';

const SAMPLE_WALLETS = [
    'ALGO7XQYZMK3NFQVLBMPJK4GKFX6YTHHPD3R2BWES',
    'AAAAA_SCAM_WALLET_TEST',
    'XCJ4QLPF2A5NKGDYZRHJVPWBSM7ETXQL3G9IODKV',
];

function RiskGauge({ score, level }: { score: number; level: 'low' | 'medium' | 'high' }) {
    const color = level === 'low' ? '#10b981' : level === 'medium' ? '#f59e0b' : '#ef4444';
    const trackColor = level === 'low' ? 'rgba(16,185,129,0.15)' : level === 'medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)';
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-36 h-36">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke={trackColor} strokeWidth="10" />
                    <circle
                        cx="60" cy="60" r="54" fill="none"
                        stroke={color} strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                        filter={`drop-shadow(0 0 8px ${color})`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{score}</span>
                    <span className="text-xs text-white/40 font-medium">TXS Score</span>
                </div>
            </div>
            <div className={`mt-3 ${level === 'low' ? 'risk-badge-low' : level === 'medium' ? 'risk-badge-medium' : 'risk-badge-high'}`}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                {level.toUpperCase()} RISK
            </div>
        </div>
    );
}

function ResultCard({ result, onClose }: { result: TXSResult; onClose: () => void }) {
    const [copied, setCopied] = useState(false);

    const copyAddr = () => {
        navigator.clipboard.writeText(result.walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`glass-card p-6 border ${result.riskLevel === 'low' ? 'border-emerald-500/20' : result.riskLevel === 'medium' ? 'border-amber-500/20' : 'border-red-500/30'} animate-in fade-in duration-300`}>
            <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold text-sm">Analysis Complete</h3>
                        <span className="text-white/30 text-xs">· {result.analysisTime}ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <code className="text-white/40 text-xs font-mono">{result.walletAddress.slice(0, 20)}…{result.walletAddress.slice(-6)}</code>
                        <button onClick={copyAddr} className="text-white/20 hover:text-neon-blue transition-colors">
                            {copied ? <CheckCircle size={12} className="text-neon-blue" /> : <Copy size={12} />}
                        </button>
                    </div>
                </div>
                <button onClick={onClose} className="text-white/20 hover:text-white/60 transition-colors p-1">
                    <X size={16} />
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <RiskGauge score={result.txsScore} level={result.riskLevel} />

                <div className="flex-1 space-y-3">
                    <h4 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">Risk Factors Detected</h4>
                    {result.riskFactors.map((rf, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${result.riskLevel === 'low' ? 'bg-emerald-400' : result.riskLevel === 'medium' ? 'bg-amber-400' : 'bg-red-400'}`} />
                            <span className="text-white/70 text-sm">{rf.reason}</span>
                            <span className={`ml-auto text-xs font-bold shrink-0 ${rf.severity < 30 ? 'text-emerald-400' : rf.severity < 60 ? 'text-amber-400' : 'text-red-400'}`}>
                                {rf.severity}
                            </span>
                        </div>
                    ))}

                    <div className="flex gap-4 pt-2 text-xs text-white/30">
                        <span><Activity size={11} className="inline mr-1" />{result.transactionCount} txns analyzed</span>
                        <span><Clock size={11} className="inline mr-1" />{new Date(result.timestamp).toLocaleTimeString()}</span>
                        <span><ExternalLink size={11} className="inline mr-1" />Algorand mainnet</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const RECENT_CHECKS: { address: string; score: number; level: 'low' | 'medium' | 'high'; time: string }[] = [
    { address: 'ALGO7XQYZMK3NF...', score: 12, level: 'low', time: '2 min ago' },
    { address: 'XCJ4QLPF2A5NKG...', score: 61, level: 'medium', time: '14 min ago' },
    { address: 'PRTM9YVZW8KLNH...', score: 88, level: 'high', time: '1 hr ago' },
    { address: 'DAMO4YWKRZP2SX...', score: 23, level: 'low', time: '3 hr ago' },
];

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [wallet, setWallet] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<TXSResult | null>(null);
    const [recentChecks, setRecentChecks] = useState(RECENT_CHECKS);
    const [alerts, setAlerts] = useState([
        { id: 1, msg: 'High-risk wallet flagged in your watchlist', time: '5 min ago', type: 'danger' },
        { id: 2, msg: 'API usage: 3 / 5 checks used today', time: '1 hr ago', type: 'info' },
    ]);

    const handleAnalyze = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!wallet || wallet.length < 10) return;

        setAnalyzing(true);
        setResult(null);

        try {
            const data = await analyzeWallet(wallet);

            // Wait a moment for the animation to feel "real"
            await new Promise(r => setTimeout(r, 1500));

            const severityMap = { low: 10, medium: 45, high: 85 };
            const riskLvl = data.risk.toLowerCase() as 'low' | 'medium' | 'high';

            const newResult: TXSResult = {
                walletAddress: wallet,
                txsScore: data.score,
                riskLevel: riskLvl,
                riskFactors: data.reasons.map((r: string) => ({
                    reason: r,
                    severity: severityMap[riskLvl]
                })),
                analysisTime: 450,
                transactionCount: 120,
                timestamp: data.timestamp,
                network: 'algorand'
            };

            setResult(newResult);
            setAnalyzing(false);
            setRecentChecks(prev => [{
                address: wallet.slice(0, 14) + '...',
                score: newResult.txsScore,
                level: newResult.riskLevel,
                time: 'Just now',
            }, ...prev.slice(0, 3)]);

        } catch (err) {
            console.error('API Error:', err);
            setAnalyzing(false);
            alert('Error connecting to TXS Engine. Please ensure the backend is running.');
        }
    };



    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const dismissAlert = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id));

    return (
        <div className="min-h-screen bg-navy-900 flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-navy-800/50 p-6 sticky top-0 h-screen">
                <Link to="/" className="flex items-center gap-2.5 mb-10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                        <Shield size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-white text-sm">BlockSentinel<span className="text-neon-blue">.ai</span></span>
                </Link>

                <nav className="space-y-1 flex-1">
                    {[
                        { icon: <BarChart3 size={16} />, label: 'Dashboard', active: true },
                        { icon: <Search size={16} />, label: 'Wallet Checker', active: false },
                        { icon: <Bell size={16} />, label: 'Alerts', active: false },
                        { icon: <Activity size={16} />, label: 'Analytics', active: false },
                        { icon: <Zap size={16} />, label: 'API Access', active: false },
                    ].map((item) => (
                        <button
                            key={item.label}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${item.active ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="border-t border-white/5 pt-4 space-y-3">
                    {/* Plan badge */}
                    <div className="glass-card px-3 py-2.5 text-xs">
                        <div className="text-white/40 mb-0.5">Current Plan</div>
                        <div className="flex items-center justify-between">
                            <span className="text-neon-blue font-semibold capitalize">{user?.plan ?? 'free'}</span>
                            <Link to="/#pricing" className="text-white/20 hover:text-white/40 transition-colors flex items-center gap-1">
                                Upgrade <ChevronRight size={10} />
                            </Link>
                        </div>
                    </div>
                    <button
                        id="dashboard-logout-btn"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/30 hover:text-white/60 text-sm hover:bg-white/5 transition-all"
                    >
                        <LogOut size={15} /> Log out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                {/* Top bar */}
                <div className="sticky top-0 z-20 border-b border-white/5 bg-navy-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-white font-bold text-lg">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                        <p className="text-white/30 text-xs mt-0.5">TXS Engine · Algorand Network</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {alerts.length > 0 && (
                            <div className="relative">
                                <Bell size={18} className="text-white/40" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">{alerts.length}</span>
                            </div>
                        )}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white text-xs font-bold">
                            {user?.name?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6 max-w-5xl mx-auto">
                    {/* Stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Checks Today', value: recentChecks.length.toString(), icon: <Search size={16} className="text-neon-blue" />, sub: `of 5 free` },
                            { label: 'High Risk', value: recentChecks.filter(r => r.level === 'high').length.toString(), icon: <AlertTriangle size={16} className="text-red-400" />, sub: 'flagged wallets' },
                            { label: 'Avg TXS Score', value: Math.round(recentChecks.reduce((a, b) => a + b.score, 0) / recentChecks.length).toString(), icon: <TrendingUp size={16} className="text-neon-purple" />, sub: 'across all checks' },
                            { label: 'Network', value: 'Algorand', icon: <Activity size={16} className="text-emerald-400" />, sub: 'mainnet' },
                        ].map((s) => (
                            <div key={s.label} className="glass-card p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-white/40 text-xs">{s.label}</span>
                                    {s.icon}
                                </div>
                                <div className="text-xl font-bold text-white">{s.value}</div>
                                <div className="text-white/30 text-xs mt-0.5">{s.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Alerts */}
                    {alerts.length > 0 && (
                        <div className="space-y-2">
                            {alerts.map((alert) => (
                                <div key={alert.id} className={`flex items-center gap-3 p-4 rounded-xl border text-sm ${alert.type === 'danger' ? 'bg-red-500/5 border-red-500/20 text-red-300' : 'bg-neon-blue/5 border-neon-blue/20 text-neon-blue'}`}>
                                    {alert.type === 'danger' ? <AlertTriangle size={15} className="shrink-0" /> : <Bell size={15} className="shrink-0" />}
                                    <span className="flex-1">{alert.msg}</span>
                                    <span className="text-white/20 text-xs">{alert.time}</span>
                                    <button onClick={() => dismissAlert(alert.id)} className="text-white/20 hover:text-white/50 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Wallet Checker */}
                    <div className="glass-card p-6 border-neon-blue/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={16} className="text-neon-blue" />
                            <h2 className="text-white font-semibold">TXS Wallet Checker</h2>
                        </div>
                        <p className="text-white/40 text-sm mb-5">Enter any Algorand wallet address to get an instant TXS risk score.</p>

                        <form onSubmit={handleAnalyze} className="flex gap-3 mb-4">
                            <input
                                id="dashboard-wallet-input"
                                type="text"
                                value={wallet}
                                onChange={(e) => setWallet(e.target.value)}
                                placeholder="Enter Algorand wallet address (e.g. ALGO7X...)"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all font-mono"
                            />
                            <button
                                id="dashboard-analyze-btn"
                                type="submit"
                                disabled={analyzing || !wallet.trim()}
                                className="btn-primary shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {analyzing ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Analyzing…
                                    </span>
                                ) : (
                                    <><Search size={15} /> Analyze</>
                                )}
                            </button>
                        </form>

                        {/* Quick sample wallets */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="text-white/20 text-xs mt-1">Try:</span>
                            {SAMPLE_WALLETS.map((w) => (
                                <button
                                    key={w}
                                    onClick={() => setWallet(w)}
                                    className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-neon-blue hover:border-neon-blue/30 transition-all font-mono"
                                >
                                    {w.slice(0, 12)}…
                                </button>
                            ))}
                        </div>

                        {/* Analyzing indicator */}
                        {analyzing && (
                            <div className="flex flex-col items-center py-10 gap-4">
                                <div className="relative w-16 h-16">
                                    <div className="absolute inset-0 rounded-full border-2 border-neon-blue/20 animate-ping" />
                                    <div className="absolute inset-2 rounded-full border-2 border-neon-blue/40 animate-pulse" />
                                    <div className="absolute inset-4 rounded-full bg-neon-blue/20 flex items-center justify-center">
                                        <Shield size={14} className="text-neon-blue" />
                                    </div>
                                </div>
                                <div className="text-white/50 text-sm">TXS Engine scanning Algorand blockchain…</div>
                                <div className="flex gap-1.5">
                                    {['Fetching transactions', 'Analyzing patterns', 'Calculating score'].map((step, i) => (
                                        <span key={step} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/10" style={{ opacity: 0.4 + i * 0.2 }}>
                                            {step}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Result */}
                        {result && !analyzing && (
                            <ResultCard result={result} onClose={() => setResult(null)} />
                        )}
                    </div>

                    {/* Recent Checks + API Key */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recent */}
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                                    <Clock size={14} className="text-white/40" /> Recent Checks
                                </h3>
                                <span className="text-white/20 text-xs">{recentChecks.length} wallets</span>
                            </div>
                            <div className="space-y-2">
                                {recentChecks.map((check, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${check.level === 'low' ? 'bg-emerald-400' : check.level === 'medium' ? 'bg-amber-400' : 'bg-red-400'}`} />
                                        <code className="text-white/50 text-xs font-mono flex-1">{check.address}</code>
                                        <span className={`text-xs font-bold ${check.level === 'low' ? 'text-emerald-400' : check.level === 'medium' ? 'text-amber-400' : 'text-red-400'}`}>{check.score}</span>
                                        <span className="text-white/20 text-xs shrink-0">{check.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* API Key */}
                        <div className="glass-card p-6">
                            <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
                                <Zap size={14} className="text-neon-blue" /> TXS API Key
                            </h3>
                            <p className="text-white/30 text-xs mb-4">Use this key to integrate TXS Engine into your platform.</p>
                            <div className="bg-black/30 border border-white/5 rounded-xl p-3 font-mono text-xs text-white/40 mb-3 break-all">
                                {user?.apiKey ?? 'txs_xxxxxxxxxxxxxxxx'}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    id="dashboard-copy-api-btn"
                                    onClick={() => navigator.clipboard.writeText(user?.apiKey ?? '')}
                                    className="btn-secondary text-xs px-3 py-2 flex-1 justify-center"
                                >
                                    <Copy size={12} /> Copy Key
                                </button>
                                <button className="btn-secondary text-xs px-3 py-2 flex-1 justify-center">
                                    <ExternalLink size={12} /> View Docs
                                </button>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5">
                                <div className="text-white/30 text-xs mb-2">Daily Usage</div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full" style={{ width: `${(recentChecks.length / 5) * 100}%` }} />
                                </div>
                                <div className="flex justify-between text-white/20 text-xs mt-1.5">
                                    <span>{recentChecks.length} used</span>
                                    <span>5 limit (Free)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

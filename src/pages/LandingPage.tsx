import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Shield, Zap, AlertTriangle, BarChart3, ArrowRight,
    CheckCircle, Globe, Lock, TrendingUp, ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

const FEATURES = [
    {
        icon: <Zap className="w-6 h-6 text-neon-blue" />,
        title: 'TXS Wallet Risk Score',
        desc: 'Instantly score any Algorand wallet address on a 0-100 risk scale with Low / Medium / High indicators powered by the TXS Engine.',
        gradient: 'from-neon-blue/20 to-transparent',
        border: 'border-neon-blue/20',
    },
    {
        icon: <AlertTriangle className="w-6 h-6 text-neon-purple" />,
        title: 'Fraud Detection Engine',
        desc: 'Detect suspicious transaction patterns, blacklisted wallet interactions, and unusual high-frequency activity before funds move.',
        gradient: 'from-neon-purple/20 to-transparent',
        border: 'border-neon-purple/20',
    },
    {
        icon: <BarChart3 className="w-6 h-6 text-neon-pink" />,
        title: 'Risk Explanation & Alerts',
        desc: 'Receive plain-English explanations for every flag — "Linked to suspicious wallets", "High transaction frequency" — and instant alerts.',
        gradient: 'from-neon-pink/20 to-transparent',
        border: 'border-neon-pink/20',
    },
];

const HOW_IT_WORKS = [
    { step: '01', title: 'Input Wallet', desc: 'Enter any Algorand wallet address into the TXS checker.' },
    { step: '02', title: 'TXS Analysis', desc: 'The TXS Engine fetches on-chain data and runs fraud-detection algorithms.' },
    { step: '03', title: 'Risk Score', desc: 'Receive a 0–100 TXS score with a Low / Medium / High classification.' },
    { step: '04', title: 'Smart Alert', desc: 'Get notified instantly if a wallet is flagged as high-risk.' },
];

const PRICING = [
    {
        tier: 'Free',
        color: 'emerald',
        price: '₹0',
        period: '/month',
        tag: '',
        features: ['5 wallet checks / day', 'Basic TXS score', 'Risk level indicator', 'Community support'],
        cta: 'Get Started Free',
        href: '/signup',
        highlight: false,
    },
    {
        tier: 'Pro',
        color: 'blue',
        price: '₹5,000',
        period: '/month',
        tag: 'Most Popular',
        features: ['500 wallet checks / day', 'Full TXS score breakdown', 'TXS API access', 'Basic analytics dashboard', 'Email support'],
        cta: 'Start Pro Trial',
        href: '/signup',
        highlight: true,
    },
    {
        tier: 'Premium',
        color: 'purple',
        price: '₹25,000+',
        period: '/month',
        tag: 'Enterprise',
        features: ['Unlimited wallet checks', 'Real-time monitoring', 'Instant Slack/email alerts', 'Full API integration', 'Advanced analytics', 'Dedicated support'],
        cta: 'Contact Sales',
        href: '/signup',
        highlight: false,
    },
];

export default function LandingPage() {
    const [heroWallet, setHeroWallet] = useState('');
    const navigate = useNavigate();

    const handleHeroCheck = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/signup');
    };

    return (
        <div className="min-h-screen bg-navy-900 overflow-x-hidden">
            <Navbar />

            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-20 text-center overflow-hidden">
                {/* bg grid */}
                <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
                {/* glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-neon-purple/8 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    {/* badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-neon-blue text-xs font-medium mb-8 animate-pulse-slow">
                        <Shield size={12} />
                        Powered by TXS Engine · Built on Algorand
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                        Secure Every{' '}
                        <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                            Crypto Transaction
                        </span>
                    </h1>

                    <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                        BlockSentinel.ai is an AI-powered transaction security layer built on Algorand that evaluates wallet interactions, detects suspicious patterns, and converts complex on-chain data into simple, human-readable insights.
                    </p>

                    {/* hero wallet checker */}
                    <form onSubmit={handleHeroCheck} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
                        <input
                            id="hero-wallet-input"
                            type="text"
                            value={heroWallet}
                            onChange={(e) => setHeroWallet(e.target.value)}
                            placeholder="Enter Algorand wallet address..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/30 transition-all"
                        />
                        <button id="hero-check-btn" type="submit" className="btn-primary whitespace-nowrap">
                            Check Wallet Now <ArrowRight size={16} />
                        </button>
                    </form>

                    <p className="text-white/30 text-xs">No credit card required · 5 free checks/day</p>

                    {/* social proof stats */}
                    <div className="flex flex-wrap justify-center gap-8 mt-14">
                        {[['10K+', 'Wallets Analyzed'], ['99.2%', 'Fraud Detection Accuracy'], ['< 2s', 'Analysis Time'], ['Algorand', 'Fast Finality']].map(([val, label]) => (
                            <div key={label} className="text-center">
                                <div className="text-2xl font-black text-white">{val}</div>
                                <div className="text-xs text-white/40 mt-0.5">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PROBLEM ──────────────────────────────────────── */}
            <section className="py-24 px-4 relative">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-medium mb-8">
                        <AlertTriangle size={12} />
                        The Problem
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        In DeFi, Transactions are <span className="text-red-400">Irreversible</span>
                    </h2>
                    <p className="text-white/50 text-lg max-w-3xl mx-auto mb-14 leading-relaxed">
                        Crypto startups and users cannot clearly interpret transaction behavior or abnormal activity patterns,
                        exposing them to fraud, scam wallets, and malicious transactions. This lack of a real-time transaction
                        intelligence layer creates significant financial risks and limits trust in decentralized ecosystems.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { stat: '$14B+', label: 'Lost to crypto scams in 2023', icon: '💸' },
                            { stat: '0%', label: 'Irreversible — no chargebacks', icon: '🔒' },
                            { stat: '3.8B+', label: 'People exposed without protection', icon: '⚠️' },
                        ].map(({ stat, label, icon }) => (
                            <div key={label} className="glass-card p-6 text-center">
                                <div className="text-3xl mb-3">{icon}</div>
                                <div className="text-3xl font-black text-red-400 mb-2">{stat}</div>
                                <div className="text-white/50 text-sm">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ─────────────────────────────────────── */}
            <section id="features" className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-neon-blue text-xs font-medium mb-8">
                            <Zap size={12} /> Core Features
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Everything You Need to{' '}
                            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">Stay Safe</span>
                        </h2>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto">
                            The TXS Engine combines on-chain analytics with intelligent fraud signals to give you a complete security picture.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {FEATURES.map((f) => (
                            <div key={f.title} className={`glass-card p-8 border ${f.border} group hover:scale-[1.02] transition-transform duration-200`}>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────── */}
            <section id="how-it-works" className="py-24 px-4 bg-navy-800/40">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-purple/30 bg-neon-purple/5 text-neon-purple text-xs font-medium mb-8">
                            <Globe size={12} /> How it Works
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                            From Input to Insight in{' '}
                            <span className="text-neon-blue">Seconds</span>
                        </h2>
                        <p className="text-white/50 text-lg">A simple 4-step process powered by the TXS Engine.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {HOW_IT_WORKS.map((step, i) => (
                            <div key={step.step} className="relative">
                                <div className="glass-card p-6 text-center h-full">
                                    <div className="text-4xl font-black bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent mb-4">{step.step}</div>
                                    <h4 className="text-white font-semibold mb-2">{step.title}</h4>
                                    <p className="text-white/40 text-sm">{step.desc}</p>
                                </div>
                                {i < HOW_IT_WORKS.length - 1 && (
                                    <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                                        <ChevronRight className="text-neon-blue/40" size={20} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRICING ──────────────────────────────────────── */}
            <section id="pricing" className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/5 text-neon-blue text-xs font-medium mb-8">
                            <TrendingUp size={12} /> Pricing
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-white/50 text-lg">Start free. Scale as you protect more.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PRICING.map((plan) => (
                            <div key={plan.tier} className={`glass-card p-8 relative flex flex-col ${plan.highlight ? 'border-neon-blue/40 glow-blue' : 'border-white/10'}`}>
                                {plan.tag && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold">
                                        {plan.tag}
                                    </div>
                                )}
                                <div className="mb-6">
                                    <div className="text-white/60 text-sm font-medium mb-2">{plan.tier}</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-white">{plan.price}</span>
                                        <span className="text-white/40 text-sm">{plan.period}</span>
                                    </div>
                                </div>
                                <ul className="space-y-3 flex-1 mb-8">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                                            <CheckCircle size={15} className="text-neon-blue mt-0.5 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to={plan.href}
                                    id={`pricing-${plan.tier.toLowerCase()}-btn`}
                                    className={plan.highlight ? 'btn-primary justify-center' : 'btn-secondary justify-center'}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ───────────────────────────────────── */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto glass-card p-12 text-center border-neon-blue/20 glow-blue relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-transparent to-neon-purple/5 rounded-2xl" />
                    <div className="relative z-10">
                        <Lock className="w-12 h-12 text-neon-blue mx-auto mb-6 animate-float" />
                        <h2 className="text-4xl font-black text-white mb-4">Ready to Secure Your Transactions?</h2>
                        <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
                            Join crypto companies and investors who trust BlockSentinel.ai to detect fraud before it happens.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/signup" id="cta-free-btn" className="btn-primary">Start Free Wallet Check <ArrowRight size={16} /></Link>
                            <Link to="/signup" id="cta-api-btn" className="btn-secondary">Get API Access</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────── */}
            <footer id="footer" className="border-t border-white/5 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                                    <Shield size={14} className="text-white" />
                                </div>
                                <span className="font-bold text-white text-sm">BlockSentinel.ai</span>
                            </div>
                            <p className="text-white/30 text-sm max-w-xs">Secure every transaction with real-time intelligence. Powered by TXS Engine.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
                            {[
                                { title: 'Product', links: ['Features', 'How It Works', 'Pricing', 'API Docs'] },
                                { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
                                { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security'] },
                            ].map((col) => (
                                <div key={col.title}>
                                    <div className="text-white/50 font-semibold mb-3">{col.title}</div>
                                    <ul className="space-y-2">
                                        {col.links.map((l) => (
                                            <li key={l}><a href="#" className="text-white/30 hover:text-white/60 transition-colors">{l}</a></li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-white/20 text-xs">© 2026 BlockSentinel.ai · Powered by TXS Engine · Built on Algorand</p>
                        <div className="flex items-center gap-2 text-white/20 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            All systems operational
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

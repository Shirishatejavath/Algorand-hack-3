import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const ok = await login(email, password);
        setLoading(false);
        if (ok) navigate('/dashboard');
        else setError('No account found with that email. Please sign up first.');
    };

    return (
        <div className="min-h-screen bg-navy-900 flex items-center justify-center px-4 relative">
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 justify-center mb-10 group">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-shadow">
                        <Shield className="text-white" size={18} />
                    </div>
                    <span className="font-bold text-white text-lg">BlockSentinel<span className="text-neon-blue">.ai</span></span>
                </Link>

                <div className="glass-card p-8 border-white/10">
                    <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
                    <p className="text-white/40 text-sm mb-8">Sign in to your BlockSentinel account.</p>

                    {error && (
                        <div className="flex items-start gap-2.5 p-3.5 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            <AlertCircle size={15} className="shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-white/50 mb-1.5 font-medium">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-white/50 mb-1.5 font-medium">Password</label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPw ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/20 transition-all pr-12"
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            id="login-submit-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary justify-center py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-white/30 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-neon-blue hover:text-neon-blue/80 font-medium transition-colors">Sign up free</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

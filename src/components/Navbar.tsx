import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-navy-900/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center group-hover:shadow-[0_0_16px_rgba(0,212,255,0.5)] transition-shadow">
                        <Shield className="w-4.5 h-4.5 text-white" size={18} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-white text-sm tracking-tight">BlockSentinel</span>
                        <span className="text-[10px] text-neon-blue/80 font-medium tracking-widest uppercase">.ai</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    <a href="#features" className="nav-link">Features</a>
                    <a href="#how-it-works" className="nav-link">How it Works</a>
                    <a href="#pricing" className="nav-link">Pricing</a>
                    <a href="#footer" className="nav-link">Docs</a>
                </nav>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="btn-secondary text-xs px-4 py-2">Dashboard</Link>
                            <button id="nav-logout-btn" onClick={handleLogout} className="nav-link text-xs">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" id="nav-login-btn" className="nav-link">Log in</Link>
                            <Link to="/signup" id="nav-signup-btn" className="btn-primary text-xs px-4 py-2">Get Started</Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button id="nav-mobile-toggle" className="md:hidden text-white/60 hover:text-white" onClick={() => setOpen(!open)}>
                    {open ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-navy-800/95 backdrop-blur-md border-t border-white/5 px-4 py-4 flex flex-col gap-4">
                    <a href="#features" className="nav-link" onClick={() => setOpen(false)}>Features</a>
                    <a href="#how-it-works" className="nav-link" onClick={() => setOpen(false)}>How it Works</a>
                    <a href="#pricing" className="nav-link" onClick={() => setOpen(false)}>Pricing</a>
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setOpen(false)} className="btn-secondary text-xs px-4 py-2 text-center">Dashboard</Link>
                            <button onClick={handleLogout} className="text-white/40 text-sm">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setOpen(false)} className="nav-link">Log in</Link>
                            <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary text-xs px-4 py-2 justify-center">Get Started</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}

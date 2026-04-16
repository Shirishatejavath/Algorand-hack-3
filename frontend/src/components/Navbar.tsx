import { Shield, GitBranch, FileText, ExternalLink } from 'lucide-react';

interface NavbarProps {
  connectedWallet: string | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export default function Navbar({ connectedWallet, onConnectWallet, onDisconnectWallet }: NavbarProps) {
  const shortAddress = connectedWallet
    ? `${connectedWallet.slice(0, 6)}...${connectedWallet.slice(-4)}`
    : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10" style={{ backgroundColor: '#0B0F19' }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600">
            <Shield size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm tracking-wide">
            Block<span className="text-indigo-400">Sentinel</span>.ai
          </span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/90 transition-colors"
          >
            <GitBranch size={14} />
            GitHub
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/90 transition-colors"
          >
            <FileText size={14} />
            Docs
          </a>
        </div>

        {/* Wallet Connect */}
        {connectedWallet ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 border border-emerald-500/30 bg-emerald-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {shortAddress}
            </div>
            <button
              onClick={onDisconnectWallet}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            id="btn-connect-wallet"
            onClick={onConnectWallet}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95"
          >
            <ExternalLink size={14} />
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
}

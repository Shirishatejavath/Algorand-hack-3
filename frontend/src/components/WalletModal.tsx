import React, { useState } from 'react';
import { X, Wallet, ChevronRight, ShieldCheck, Laptop, Send, Radio } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectPera: () => void;
  onConnectDefly: () => void;
  onConnectCustom: (address: string) => void;
}

/**
 * Official Pera Wallet Logomark — downloaded from:
 * https://perawallet.s3-eu-west-3.amazonaws.com/media-kit/pera-logomark-black.svg
 * 
 * 6 organic elliptical petals on a yellow (#FFEE55) rounded-square background.
 * Brand color source: https://perawallet.app/media-kit/
 */
function PeraLogo({ size = 32, bgRx = 20 }: { size?: number; bgRx?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Official Pera yellow background */}
      <rect width="120" height="120" rx={bgRx} fill="#FFEE55"/>
      {/* Official 6-petal logomark — exact paths from pera-logomark-black.svg, centered in 120x120 */}
      <g transform="translate(17, 12) scale(1)">
        <path d="M48.5471 14.107C50.5942 22.5886 49.9022 30.0494 47.0014 30.771C44.1007 31.4926 40.0896 25.202 38.0425 16.7203C35.9953 8.23873 36.6874 0.778021 39.5881 0.056374C42.4889 -0.665273 46.4999 5.62542 48.5471 14.107Z" fill="#1C1C1C"/>
        <path d="M82.3504 21.3992C77.8168 16.5942 68.7972 17.8966 62.2045 24.3081C55.6118 30.7196 53.9426 39.8123 58.4762 44.6173C63.0098 49.4222 72.0294 48.1199 78.6221 41.7084C85.2148 35.2969 86.884 26.2041 82.3504 21.3992Z" fill="#1C1C1C"/>
        <path d="M46.2926 94.9747C49.1934 94.253 49.7835 86.3702 47.6107 77.368C45.4379 68.3657 41.325 61.653 38.4242 62.3746C35.5235 63.0963 34.9333 70.9791 37.1061 79.9813C39.2789 88.9836 43.3918 95.6963 46.2926 94.9747Z" fill="#1C1C1C"/>
        <path d="M16.7223 25.7982C25.0912 28.2661 31.2064 32.5958 30.3809 35.4687C29.5555 38.3417 22.1021 38.67 13.7332 36.2021C5.36438 33.7341 -0.750778 29.4045 0.0746392 26.5315C0.900056 23.6586 8.35349 23.3302 16.7223 25.7982Z" fill="#1C1C1C"/>
        <path d="M71.0398 58.2396C79.9223 60.859 86.4539 65.3115 85.6285 68.1844C84.8031 71.0574 76.9332 71.2629 68.0507 68.6435C59.1681 66.024 52.6365 61.5716 53.4619 58.6986C54.2873 55.8257 62.1572 55.6201 71.0398 58.2396Z" fill="#1C1C1C"/>
        <path d="M26.1392 52.2116C24.0639 50.0603 17.2567 53.1913 10.935 59.205C4.61326 65.2187 1.17089 71.8377 3.24624 73.989C5.32159 76.1403 12.1288 73.0093 18.4505 66.9956C24.7722 60.9819 28.2146 54.3629 26.1392 52.2116Z" fill="#1C1C1C"/>
      </g>
    </svg>
  );
}

/**
 * Official Pera full wordmark logo (logomark + "pera" text) — downloaded from:
 * https://perawallet.s3-eu-west-3.amazonaws.com/media-kit/pera-logo-black.svg
 */
function PeraWordmark({ height = 36 }: { height?: number }) {
  const aspect = 699 / 300;
  const w = height * aspect;
  return (
    <svg width={w} height={height} viewBox="0 0 699 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M164.782 63.7108C170.069 85.6186 168.282 104.889 160.789 106.753C153.297 108.617 142.936 92.3688 137.649 70.461C132.361 48.5532 134.148 29.2823 141.641 27.4183C149.134 25.5543 159.494 41.803 164.782 63.7108Z" fill="black"/>
      <path d="M252.095 82.5463C240.385 70.1352 217.087 73.4991 200.058 90.0599C183.03 106.621 178.718 130.107 190.428 142.518C202.139 154.929 225.436 151.565 242.465 135.004C259.493 118.444 263.805 94.9574 252.095 82.5463Z" fill="black"/>
      <path d="M158.958 272.59C166.451 270.726 167.975 250.365 162.363 227.112C156.751 203.86 146.127 186.521 138.635 188.385C131.142 190.249 129.618 210.61 135.23 233.863C140.842 257.115 151.466 274.454 158.958 272.59Z" fill="black"/>
      <path d="M82.5791 93.9088C104.196 100.283 119.991 111.467 117.859 118.888C115.727 126.308 96.4749 127.156 74.8584 120.782C53.2418 114.407 37.4465 103.224 39.5785 95.803C41.7106 88.3823 60.9626 87.5342 82.5791 93.9088Z" fill="black"/>
      <path d="M222.88 177.704C245.823 184.47 262.694 195.971 260.562 203.391C258.43 210.812 238.102 211.343 215.159 204.577C192.216 197.811 175.345 186.311 177.477 178.89C179.609 171.469 199.936 170.938 222.88 177.704Z" fill="black"/>
      <path d="M106.903 162.134C101.542 156.577 83.9594 164.665 67.6306 180.198C51.3017 195.731 42.4101 212.828 47.7707 218.385C53.1313 223.941 70.714 215.854 87.0429 200.321C103.372 184.788 112.263 167.691 106.903 162.134Z" fill="black"/>
      <path d="M346.861 96.205V91.4527H327.272V218.182H346.861V184.035C346.861 180.339 346.861 177.347 346.504 173.299H346.861C353.984 184.916 366.093 191.076 380.338 191.076C404.378 191.076 425.391 172.947 425.391 139.328C425.391 106.414 404.378 88.6365 380.338 88.6365C366.627 88.6365 354.518 94.6209 346.861 106.414H346.504C346.861 102.541 346.861 99.7253 346.861 96.205ZM375.352 174.355C357.189 174.179 346.682 158.866 346.682 139.152C346.682 120.495 357.189 105.534 375.352 105.358C393.16 105.182 404.913 118.911 404.913 139.328C404.913 160.274 393.16 174.531 375.352 174.355Z" fill="#0D0D0D"/>
      <path d="M528.251 131.056C528.251 106.766 508.663 88.6365 481.952 88.6365C453.46 88.6365 433.694 107.822 433.694 139.856C433.694 170.658 453.104 191.076 481.952 191.076C505.635 191.076 523.265 177.347 527.36 158.514H505.992C502.608 168.018 493.348 174.355 481.952 174.355C467.35 174.355 456.665 163.97 454.35 146.721H528.251V131.056ZM481.952 105.358C496.376 105.358 506.348 115.214 508.485 129.471H454.528C457.021 115.742 467.172 105.358 481.952 105.358Z" fill="#0D0D0D"/>
      <path d="M542.651 188.26H562.239V133.696C562.239 115.038 572.567 105.358 588.594 105.358H599.1V88.6365H590.731C576.307 88.6365 567.403 98.1412 562.239 106.414H561.883V91.4527H542.651V188.26Z" fill="#0D0D0D"/>
      <path d="M690.672 171.363C688.001 171.363 686.754 169.778 686.754 166.61V124.015C686.754 103.598 676.782 88.6365 647.4 88.6365C618.908 88.6365 605.909 102.718 604.484 122.783H624.072C625.319 111.87 634.045 105.358 647.4 105.358C658.797 105.358 666.632 110.286 666.632 118.031C666.632 124.367 662.18 128.239 647.578 128.239H639.743C616.415 128.239 600.745 137.568 600.745 158.866C600.745 181.219 617.306 191.428 636.716 191.428C651.14 191.428 663.427 185.092 668.235 171.539C668.769 181.395 675.358 188.26 687.823 188.26H698.863V171.363H690.672ZM667.166 143.2C667.166 165.026 655.235 174.531 639.921 174.531C626.565 174.531 621.223 166.786 621.223 158.866C621.223 151.297 625.853 145.137 640.099 145.137H642.948C656.66 145.137 665.207 140.384 666.988 132.112H667.166V143.2Z" fill="#0D0D0D"/>
    </svg>
  );
}

export default function WalletModal({ isOpen, onClose, onConnectPera, onConnectDefly, onConnectCustom }: WalletModalProps) {
  const [step, setStep] = useState<'select' | 'pera-scan'>('select');
  const [manualAddress, setManualAddress] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('select');
    onClose();
  };

  const SelectionView = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
        <h2 className="text-xl font-black text-white">Connect Algorand Wallet</h2>
        <button
          onClick={handleClose}
          className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-8 space-y-5">
        {/* Why Connect Info Card */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex gap-4 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center shrink-0">
            <Wallet size={20} className="text-accent-purple" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Secure Anchoring</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              BlockSentinel uses your public key to track audits. We never request private keys.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pera Wallet Option — Official Logomark */}
          <button
            onClick={() => setStep('pera-scan')}
            className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-3 group transition-all hover:bg-white/5 hover:border-[#FFEE55]/40 active:scale-[0.98]"
          >
            <div className="group-hover:scale-110 transition-transform">
              <PeraLogo size={48} bgRx={12} />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-black text-white">Pera Wallet</h3>
              <p className="text-[10px] text-slate-500">Official Mobile</p>
            </div>
          </button>

          {/* Defly Wallet Option */}
          <button
            onClick={onConnectDefly}
            className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-3 group transition-all hover:bg-white/5 hover:border-emerald-500/30 active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <ShieldCheck size={24} className="text-emerald-400 group-hover:text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-black text-white">Defly Wallet</h3>
              <p className="text-[10px] text-slate-500">DeFi & Trading</p>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="relative py-2 text-center">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <span className="relative z-10 px-4 bg-navy-900 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            Flexible Connection
          </span>
        </div>

        {/* Manual Address Input */}
        <div className="space-y-3">
          <div className="relative group">
            <Laptop size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent-cyan transition-colors" />
            <input
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="Paste any Algorand address..."
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white placeholder-slate-600 pl-10 pr-4 py-3 focus:outline-none focus:border-accent-cyan/50 transition-all font-mono"
            />
          </div>
          <button
            disabled={!manualAddress}
            onClick={() => onConnectCustom(manualAddress)}
            className="w-full py-3 rounded-xl bg-accent-cyan/10 hover:bg-accent-cyan text-accent-cyan hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-accent-cyan/20"
          >
            <Send size={14} />
            Connect Manually
          </button>
        </div>
      </div>
    </>
  );

  const PeraScanView = () => (
    <div className="animate-slow-fade bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
      {/* Official Pera Branding Header */}
      <div className="bg-[#f9fafb] px-6 py-4 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <PeraLogo size={24} bgRx={6} />
          <div className="bg-[#1D4ED8] text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide">Pera Connect</div>
          <div className="bg-[#3B82F6] text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide">v1.5.2</div>
        </div>
        <button onClick={() => setStep('select')} className="text-slate-400 hover:text-slate-800 transition-colors p-1">
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] bg-white min-h-[480px]">
        {/* Left Side: Official Pera Branding & Features */}
        <div className="p-10 flex flex-col bg-[#f9fafb]">
          <div className="flex items-center gap-1 mb-10">
            {/* Official Pera full wordmark logo (symbol + "pera" text) */}
            <PeraWordmark height={40} />
          </div>

          <h2 className="text-[28px] font-bold text-[#1f2937] leading-[1.15] mb-12 max-w-[280px]">
            Simply the best<br />Algorand<br />wallet.
          </h2>

          <div className="space-y-6 mt-auto">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Features</span>
            <div className="space-y-5">
              {[
                { icon: ShieldCheck, text: "Connect to any Algorand dApp securely" },
                { icon: Wallet, text: "Your private keys are safely stored locally" },
                { icon: Radio, text: "View NFTs, buy and swap crypto and more" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                    <feature.icon size={18} className="text-slate-400 stroke-[1.5]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-600 leading-tight">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: QR Scanner */}
        <div className="p-8 flex flex-col items-center justify-start border-l border-slate-100 bg-white">
          <div className="w-full max-w-[280px] space-y-6 flex flex-col items-center">

            <button
              onClick={onConnectPera}
              className="w-full px-5 py-4 bg-[#f9fafb] hover:bg-slate-100 border border-slate-100 rounded-[20px] flex items-center justify-between text-[13px] font-bold text-[#374151] transition-all"
            >
              Connect with Pera Mobile
              <ChevronRight size={16} className="rotate-90 text-slate-400" />
            </button>

            {/* QR Code with official Pera logomark in the center */}
            <div
              className="aspect-square w-full bg-white rounded-3xl relative cursor-pointer mt-2"
              onClick={onConnectPera}
              style={{ border: '4px solid #FFEE55', padding: '6px' }}
            >
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=algorand://blocksentinel-auth-secure-node-v1.0"
                alt="Pera Wallet Secure Auth QR"
                className="w-full h-full mix-blend-multiply opacity-90"
              />
              {/* Official Pera logomark centered on QR code */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-[64px] h-[64px] bg-white rounded-2xl flex items-center justify-center p-1 shadow-md border border-slate-100">
                  <PeraLogo size={52} bgRx={10} />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-center text-slate-400 font-extrabold uppercase tracking-[0.15em] mt-3 mb-1">
              Scan to connect safely
            </p>

            <button
              onClick={onConnectPera}
              className="w-full px-5 py-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-[20px] flex items-center justify-between text-[13px] font-bold text-[#374151] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all"
            >
              Connect with Pera Web
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-slow-fade">
      <div
        className={`w-full ${
          step === 'select'
            ? 'max-w-lg glass-panel shadow-2xl shadow-blue-500/10 border-white/10'
            : 'max-w-[700px] border-none shadow-[0_0_80px_rgba(0,0,0,0.8)]'
        } relative overflow-hidden animate-scale-in rounded-3xl mx-auto`}
      >
        {step === 'select' ? <SelectionView /> : <PeraScanView />}

        {/* Shimmer effect — selection view only */}
        {step === 'select' && (
          <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-shimmer-gradient pointer-events-none opacity-5 animate-shimmer" />
        )}
      </div>
    </div>
  );
}

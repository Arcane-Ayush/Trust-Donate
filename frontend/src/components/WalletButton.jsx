import React from 'react';
import { Wallet } from 'lucide-react';

export default function WalletButton({ address, onConnect, isLoading }) {
  if (address) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/80 rounded-2xl border border-white/5 shadow-inner shadow-white/5 glass group">
        <div className="relative">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40" />
        </div>
        <span className="text-xs font-black text-slate-300 font-mono tracking-tight group-hover:text-white transition-colors">
          {address.slice(0, 6)}&hellip;{address.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isLoading}
      className="flex items-center gap-2.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-600/20 active:scale-95 border border-blue-400/20"
      aria-label={isLoading ? 'Connecting to wallet' : 'Connect Wallet'}
    >
      <Wallet className="w-4 h-4" />
      {isLoading ? 'Syncing&hellip;' : 'Connect Wallet'}
    </button>
  );
}

import React from 'react';
import { Wallet, Loader2 } from 'lucide-react';

export default function WalletButton({ address, onConnect, isLoading }) {
  if (address) {
    return (
      <div className="flex items-center gap-3 px-4 py-2 bg-black rounded-full border border-white/10 group">
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-[#5E0ED7]" />
          <div className="absolute inset-0 rounded-full bg-[#5E0ED7] animate-ping opacity-40" />
        </div>
        <span className="text-[10px] font-bold text-white tracking-widest uppercase">
          {address.slice(0, 4)}&hellip;{address.slice(-4)}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isLoading}
      className="px-6 py-2 bg-white border border-zinc-200 text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-black hover:text-white transition-all disabled:opacity-20 flex items-center gap-2"
      aria-label={isLoading ? 'Connecting to wallet' : 'Connect Wallet'}
    >
      {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wallet className="w-3.5 h-3.5" />}
      {isLoading ? 'Syncing' : 'IDENTITY'}
    </button>
  );
}

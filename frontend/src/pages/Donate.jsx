import React, { useState } from 'react';
import { Heart, Send, CheckCircle2, Loader2, Globe } from 'lucide-react';
import { donate } from '../../../shared/blockchain.js';

const CATEGORIES = ['Food', 'Education', 'Healthcare', 'Other'];

export default function Donate({ address }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState(null);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || !address) return;

    setIsPending(true);
    try {
      const hash = await donate(amount, category);
      setTxHash(hash);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  if (txHash) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-10 bg-slate-900/50 border border-white/5 rounded-[2rem] text-center glass animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-green-500/20">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-4xl font-black text-white mb-3 font-display tracking-tighter uppercase italic">Donation Recorded</h2>
        <p className="text-slate-400 mb-10 font-medium">Your contribution has been permanently committed to the Base Sepolia audit layer.</p>
        
        <div className="p-6 bg-slate-950 rounded-2xl border border-white/5 mb-10 group transition-colors hover:border-blue-500/20">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-3">Transaction Proof</p>
          <p className="text-sm font-mono text-blue-400 break-all bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 group-hover:bg-blue-500/10 transition-colors">{txHash}</p>
        </div>
        
        <button 
          onClick={() => { setTxHash(null); setAmount(''); }}
          className="w-full py-5 bg-white text-slate-950 font-black uppercase tracking-tighter rounded-2xl hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
        >
          Make Another Donation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 p-10 bg-slate-900/50 border border-white/5 rounded-[2.5rem] glass shadow-2xl relative animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600 rounded-[1.25rem] shadow-lg shadow-blue-600/20">
            <Heart className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white font-display tracking-tighter uppercase italic">Support</h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Powered by UGF</p>
          </div>
        </div>
        <div className="text-right bg-slate-950/50 p-3 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5">Live Balance</p>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              ETH: <span className="tabular-nums">0.00</span>
            </span>
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              USD: <span className="tabular-nums">100.00</span>
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleDonate} className="space-y-8">
        <div className="space-y-3">
          <label htmlFor="amount" className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Amount (Mock USD)</label>
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-600 group-focus-within:text-blue-500 transition-colors italic">$</span>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-950/80 border border-white/5 rounded-[1.5rem] py-6 pl-14 pr-6 text-4xl font-black text-white font-display focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all tabular-nums placeholder:text-slate-800"
              required
              aria-required="true"
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Allocation Category</p>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-4 px-6 rounded-2xl border-2 font-black uppercase tracking-tighter text-sm transition-all flex items-center justify-between group ${
                  category === cat 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/20' 
                    : 'bg-slate-950/50 border-white/5 text-slate-500 hover:border-white/10 hover:bg-slate-900 hover:text-slate-400'
                }`}
                aria-pressed={category === cat}
              >
                {cat}
                <div className={`w-2 h-2 rounded-full transition-all ${category === cat ? 'bg-white' : 'bg-slate-800 group-hover:bg-slate-700'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 bg-blue-500/[0.03] rounded-2xl border border-blue-500/10 flex items-start gap-4">
          <div className="mt-1">
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-400 font-bold">Base Sepolia Fee</span>
              <span className="text-green-400 font-black tracking-widest uppercase">Sponsored (UGF)</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wide">
              Transaction costs are fully covered by the Universal Gas Framework infrastructure.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending || !address}
          className="w-full py-5 bg-white text-slate-950 font-black uppercase tracking-tighter text-lg rounded-[1.25rem] hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-2xl shadow-white/5 active:scale-[0.98]"
        >
          {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          {isPending ? 'Processing&hellip;' : 'Commit Donation'}
        </button>
        {!address && (
          <p className="text-center text-[10px] text-red-500 font-black uppercase tracking-widest animate-pulse">
            Wallet connection required to interact with the audit layer.
          </p>
        )}
      </form>
    </div>
  );
}

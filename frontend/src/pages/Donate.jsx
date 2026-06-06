import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Send, CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react';
import { donate } from '@shared/blockchain.js';
import { AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const CATEGORIES = ['FOOD', 'EDUCATION', 'HEALTHCARE', 'OTHER'];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function Donate({ address, setPage }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [isPending, setIsPending] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [errorToast, setErrorToast] = useState(null);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || !address) return;

    setIsPending(true);
    try {
      const hash = await donate(amount, category);
      setTxHash(hash);
    } catch (err) {
      console.error(err);
      const msg = err.message || err;
      if (msg.includes('400') || msg.includes('UGF')) {
        setErrorToast("UGF Server is currently down. Please click the Bypass Polyfix icon (⚠️) in the top right to continue.");
      } else {
        setErrorToast("Donation failed: " + msg);
      }
      setTimeout(() => setErrorToast(null), 6000);
    } finally {
      setIsPending(false);
    }
  };

  if (txHash) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-12 bg-white text-black font-body">
        <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="mb-12">
          <div className="w-12 h-12 rounded-full border-2 border-[#5E0ED7] flex items-center justify-center mb-6">
            <CheckCircle2 className="w-6 h-6 text-[#5E0ED7]" />
          </div>
          <h2 className="text-5xl font-semibold tracking-widest uppercase leading-tight">Impact<br />Committed</h2>
        </motion.div>
        
        <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="space-y-8">
          <p className="text-sm opacity-60 leading-relaxed max-w-md">
            YOUR CONTRIBUTION HAS BEEN PERMANENTLY RECORDED ON THE IMMUTABLE AUDIT LAYER.
          </p>
          
          <div className="pt-8 border-t border-zinc-100">
            <p className="text-[10px] font-bold tracking-[0.2em] opacity-40 mb-4 uppercase">Proof Hash</p>
            <p className="text-xs font-mono break-all bg-zinc-50 p-4 border border-zinc-100">{txHash}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
            <button 
              onClick={() => setPage && setPage('dashboard')}
              className="flex items-center gap-3 bg-[#5E0ED7] text-white px-6 py-3 font-semibold tracking-widest uppercase transition-transform hover:scale-105"
            >
              View Impact
              <ArrowUpRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setTxHash(null); setAmount(''); }}
              className="flex items-center gap-3 text-sm font-semibold tracking-widest uppercase text-black/40 hover:text-[#5E0ED7] transition-colors"
            >
              New Donation
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6 pb-24 text-black font-body">
      <div className="flex flex-col md:flex-row gap-8 md:gap-24">
        {/* Left Col: Info */}
        <div className="flex-1 space-y-8 md:space-y-12">
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
            <div className="w-12 h-12 rounded-full border-2 border-[#5E0ED7] flex items-center justify-center mb-8">
              <Heart className="w-6 h-6 text-[#5E0ED7]" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-semibold tracking-widest uppercase leading-[0.9]">
              Support<br className="hidden sm:block" /> The<br className="hidden sm:block" /> Cause
            </h1>
          </motion.div>

          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
            <p className="text-xs font-semibold tracking-[0.2em] opacity-40 uppercase italic">Powered by UGF</p>
            <p className="text-sm opacity-60 leading-relaxed uppercase">
              Transparent funding cycles with zero gas overhead. Every cent verified.
            </p>
          </motion.div>

          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="pt-12 border-t border-zinc-100">
            <p className="text-[10px] font-bold tracking-[0.2em] opacity-40 mb-4 uppercase">Current Holdings</p>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-sm font-semibold tracking-widest uppercase opacity-40">ETH</span>
                <span className="text-3xl font-semibold tracking-tight tabular-nums">0.00</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-semibold tracking-widest uppercase text-[#5E0ED7]">USD</span>
                <span className="text-3xl font-semibold tracking-tight tabular-nums text-[#5E0ED7]">100.00</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Col: Form */}
        <div className="flex-1">
          <form onSubmit={handleDonate} className="space-y-10 md:space-y-16">
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="space-y-4">
              <label className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase">Select Amount</label>
              <div className="relative group">
                <span className="absolute left-0 bottom-4 text-4xl font-semibold text-[#5E0ED7] italic">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent border-b-2 border-zinc-100 focus:border-[#5E0ED7] py-4 pl-10 text-5xl font-semibold tracking-tighter outline-none transition-colors tabular-nums placeholder:text-zinc-100"
                  required
                />
              </div>
            </motion.div>

            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="space-y-6">
              <label className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase">Allocation</label>
              <div className="grid grid-cols-1 gap-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center justify-between py-4 px-6 border-2 transition-all group ${
                      category === cat 
                        ? 'border-[#5E0ED7] bg-[#5E0ED7] text-white' 
                        : 'border-zinc-100 hover:border-zinc-300 text-black/40 hover:text-black'
                    }`}
                  >
                    <span className="text-sm font-semibold tracking-widest uppercase">{cat}</span>
                    <ArrowUpRight className={`w-5 h-5 transition-transform ${category === cat ? 'rotate-45' : 'group-hover:rotate-45'}`} />
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="space-y-8">
              <button
                type="submit"
                disabled={isPending || !address}
                className="w-full flex items-center justify-between text-2xl font-semibold tracking-widest uppercase text-[#5E0ED7] py-6 border-b-2 border-[#5E0ED7] hover:bg-[#5E0ED7]/5 transition-colors disabled:opacity-20"
              >
                {isPending ? 'Processing' : 'Commit Donation'}
                {isPending ? <Loader2 className="w-8 h-8 animate-spin" /> : <ArrowUpRight className="w-8 h-8" />}
              </button>
              {!address && (
                <p className="text-[10px] font-bold tracking-widest text-red-500 uppercase text-center animate-pulse">
                  Connect Identity to Proceed
                </p>
              )}
            </motion.div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-24 right-6 z-[200] bg-black text-white px-6 py-4 border border-white/20 shadow-2xl flex items-center gap-3 max-w-sm"
          >
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
            <p className="text-xs font-bold tracking-widest uppercase leading-relaxed">{errorToast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, TrendingUp, History, ArrowUpRight, Shield, Globe } from 'lucide-react';
import { getDonations } from '@shared/blockchain.js';
import DonationCard from '../components/DonationCard';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function UserDashboard({ address }) {
  const [myDonations, setMyDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!address) return;
      setIsLoading(true);
      try {
        const all = await getDonations();
        setMyDonations(all);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [address]);

  if (!address) {
    return (
      <div className="max-w-4xl mx-auto mt-20 p-16 bg-white border border-zinc-100 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#5E0ED7] flex items-center justify-center mb-8">
            <User className="w-6 h-6 text-[#5E0ED7]" />
          </div>
          <h2 className="text-4xl font-semibold tracking-widest uppercase mb-4 italic">Identity Required</h2>
          <p className="text-[10px] font-bold tracking-[0.2em] opacity-40 uppercase max-w-xs mx-auto leading-relaxed">
            PLEASE CONNECT YOUR WALLET TO VIEW YOUR PERSONAL DONATION HISTORY AND VERIFIED IMPACT ON-CHAIN.
          </p>
        </motion.div>
      </div>
    );
  }

  const totalDonated = myDonations.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="max-w-6xl mx-auto mt-12 px-6 pb-24 text-black font-body">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-semibold tracking-widest uppercase leading-[0.9] italic">Your<br />Impact</h1>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-[0.2em] px-3 py-1 bg-[#5E0ED7] text-white uppercase">Verified</span>
            <code className="text-[10px] font-bold tracking-widest opacity-40 uppercase truncate max-w-[200px] md:max-w-none">{address}</code>
          </div>
        </div>
        
        <div className="p-10 border-2 border-zinc-100 flex items-end gap-10">
          <div className="space-y-4">
            <p className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase">Total Contribution</p>
            <div className="flex items-start">
              <span className="text-[#5E0ED7] text-2xl font-semibold mt-1 mr-1">$</span>
              <span className="text-7xl font-semibold tracking-tighter tabular-nums">{totalDonated}</span>
            </div>
          </div>
          <TrendingUp className="w-12 h-12 text-[#5E0ED7] mb-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
            <h2 className="text-xl font-semibold tracking-widest uppercase">Audit History</h2>
            <span className="text-[10px] font-bold tracking-widest opacity-30 uppercase">{myDonations.length} RECORDS FOUND</span>
          </div>
          
          <div className="space-y-8">
            {isLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-50 animate-pulse border border-zinc-100" />)
            ) : myDonations.length > 0 ? (
              myDonations.map((d, i) => (
                <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
                  <DonationCard donation={d} />
                </motion.div>
              ))
            ) : (
              <div className="py-20 border-2 border-dashed border-zinc-100 text-center">
                <p className="text-[10px] font-bold tracking-widest opacity-20 uppercase italic">NO ON-CHAIN RECORDS FOUND</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-16">
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="p-10 bg-[#5E0ED7] text-white space-y-8">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-semibold tracking-widest uppercase leading-none">Community<br />Fund</h3>
            <p className="text-xs font-semibold tracking-widest leading-relaxed uppercase opacity-80">
              Your contribution is part of the transparent community fund. Every cent is trackable against NGO expenditure reports on-chain.
            </p>
            <button className="w-full flex items-center justify-between text-lg font-bold tracking-[0.2em] uppercase py-4 border-b border-white/30 hover:border-white transition-colors">
              Full Audit
              <ArrowUpRight className="w-6 h-6" />
            </button>
          </motion.div>

          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold tracking-widest uppercase">Proof of Impact</h3>
              <span className="text-[8px] font-bold px-2 py-0.5 bg-zinc-100 tracking-widest uppercase">Beta</span>
            </div>
            <p className="text-[10px] font-bold tracking-widest opacity-40 uppercase leading-relaxed">
              Verifiable NFT Badges are currently in development for the Base network.
            </p>
            <div className="aspect-square border-2 border-zinc-100 flex flex-col items-center justify-center p-12 text-center group hover:bg-zinc-50 transition-colors">
              <Shield className="w-12 h-12 text-zinc-100 mb-6 transition-colors group-hover:text-[#5E0ED7]" />
              <p className="text-[10px] font-bold tracking-widest opacity-30 uppercase">3 DONATIONS TO MINT FIRST BADGE</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

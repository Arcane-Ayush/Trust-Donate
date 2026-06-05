import React, { useEffect, useState } from 'react';
import { User, TrendingUp, History, ExternalLink, Shield, Globe } from 'lucide-react';
import { getDonations } from '../../../shared/blockchain.js';
import DonationCard from '../components/DonationCard';

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
      <div className="max-w-4xl mx-auto mt-20 p-16 bg-slate-900/50 border border-white/5 rounded-[3rem] text-center glass">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner shadow-white/5">
          <User className="w-10 h-10 text-slate-600" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3 font-display tracking-tighter uppercase italic">Identity Required</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">Please connect your wallet to view your personal donation history and verified impact on-chain.</p>
        <div className="h-px w-12 bg-slate-800 mx-auto" />
      </div>
    );
  }

  const totalDonated = myDonations.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="max-w-6xl mx-auto mt-12 px-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-in fade-in slide-in-from-left-4 duration-700">
        <div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 font-display tracking-tighter uppercase italic">Your Impact</h1>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">Verified Donor</span>
            <code className="text-xs text-slate-500 font-mono bg-slate-950 px-2 py-1 rounded border border-white/5">{address}</code>
          </div>
        </div>
        <div className="p-6 bg-slate-900/80 border border-white/5 rounded-3xl flex items-center gap-6 glass shadow-xl">
          <div className="p-4 bg-green-500/10 rounded-2xl shadow-inner shadow-green-500/10">
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Total Contribution</p>
            <p className="text-4xl font-black text-white font-display tracking-tighter tabular-nums">${totalDonated}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-white font-display uppercase tracking-tight">Audit History</h2>
            </div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{myDonations.length} Records found</span>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-28 bg-slate-900/50 animate-pulse rounded-2xl border border-white/5" />)
            ) : myDonations.length > 0 ? (
              myDonations.map((d, i) => <DonationCard key={i} donation={d} />)
            ) : (
              <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl text-center">
                <p className="text-slate-500 italic font-medium">No on-chain records found for this identity.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
          <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-blue-600/20 group">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 font-display tracking-tighter uppercase italic">Community Pool</h3>
              <p className="text-sm text-blue-100 leading-relaxed mb-8 font-medium">
                Your contribution is part of the transparent community fund. 
                Every cent is trackable and can be verified against NGO expenditure reports on-chain.
              </p>
              <button className="w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest bg-white text-blue-600 hover:bg-blue-50 py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-95">
                Explore Full Audit <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-[64px] group-hover:scale-110 transition-transform duration-1000" />
          </div>

          <div className="p-8 bg-slate-900/50 border border-white/5 rounded-[2.5rem] glass group hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-white font-display uppercase tracking-tight">Proof of Impact</h3>
              <span className="px-2 py-0.5 bg-slate-800 text-[8px] font-black text-slate-500 uppercase tracking-widest rounded-md">Alpha</span>
            </div>
            <p className="text-[10px] text-slate-500 mb-8 uppercase font-black tracking-widest leading-relaxed">
              Verifiable NFT Badges are currently in development for the Base network.
            </p>
            <div className="aspect-square bg-slate-950/80 rounded-3xl border border-white/5 border-dashed flex flex-col items-center justify-center text-center p-8 group-hover:bg-slate-950 transition-colors">
              <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-white/5 opacity-50">
                <Shield className="w-8 h-8 text-slate-700" />
              </div>
              <p className="text-xs text-slate-600 font-bold max-w-[140px]">Complete 3 donations to mint your first badge.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

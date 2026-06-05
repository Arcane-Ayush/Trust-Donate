import React from 'react';
import { Heart, Calendar, Tag } from 'lucide-react';

export default function DonationCard({ donation }) {
  const date = new Date(donation.timestamp).toLocaleDateString();

  return (
    <div className="p-6 bg-slate-900/40 border border-white/5 rounded-2xl hover:border-blue-500/30 transition-all group relative overflow-hidden glass">
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors shadow-inner shadow-blue-500/10">
            <Heart className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white font-display tracking-tighter tabular-nums">${donation.amount}</h3>
            <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase font-bold">{donation.donor}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="px-2 py-1 bg-slate-950 rounded-md border border-white/5 flex items-center gap-1.5 text-[8px] text-slate-400 uppercase font-black tracking-[0.2em]">
            <Tag className="w-2.5 h-2.5 text-blue-500" />
            {donation.category}
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
            <Calendar className="w-3 h-3" />
            {date}
          </div>
        </div>
      </div>
      
      {/* Decorative accent */}
      <div className="absolute left-0 top-0 h-full w-1 bg-blue-600/0 group-hover:bg-blue-600 transition-all duration-300" />
    </div>
  );
}

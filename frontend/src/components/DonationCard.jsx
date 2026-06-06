import React from 'react';
import { Heart, Calendar, Tag } from 'lucide-react';

export default function DonationCard({ donation, isUser }) {
  const date = new Date(donation.timestamp).toLocaleDateString();

  return (
    <div className="p-6 bg-white border-2 border-zinc-100 hover:border-[#5E0ED7] transition-all group relative overflow-hidden">
      <div className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-zinc-50 rounded-full group-hover:bg-[#5E0ED7]/10 transition-colors">
            <Heart className="w-6 h-6 text-zinc-400 group-hover:text-[#5E0ED7] transition-colors" />
          </div>
          <div>
            <h3 className="text-3xl font-semibold tracking-tighter tabular-nums text-black">${donation.amount}</h3>
            {isUser ? (
              <p className="text-[10px] text-[#5E0ED7] font-bold tracking-widest uppercase truncate">YOUR CONTRIBUTION</p>
            ) : (
              <p className="text-[10px] text-black/40 font-bold tracking-widest uppercase truncate max-w-[120px] sm:max-w-xs">{donation.donor}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="px-2 py-1 bg-zinc-50 border border-zinc-200 flex items-center gap-1.5 text-[10px] text-black uppercase font-bold tracking-[0.2em]">
            <Tag className="w-3 h-3 text-[#5E0ED7]" />
            {donation.category}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-black/40 font-bold uppercase tracking-widest">
            <Calendar className="w-3 h-3" />
            {date}
          </div>
        </div>
      </div>
      
      {/* Decorative accent */}
      <div className="absolute left-0 top-0 h-full w-1 bg-transparent group-hover:bg-[#5E0ED7] transition-all duration-300" />
    </div>
  );
}

import React from 'react';

const StatsPanel = ({ totalDonated = 0, totalSpent = 0, remaining = 0 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/20">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Donated</h3>
        <p className="text-3xl font-bold text-emerald-400">${Number(totalDonated).toLocaleString()}</p>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/20">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Spent</h3>
        <p className="text-3xl font-bold text-rose-400">${Number(totalSpent).toLocaleString()}</p>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/20">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Remaining Pool</h3>
        <p className="text-3xl font-bold text-cyan-400">${Number(remaining).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default StatsPanel;

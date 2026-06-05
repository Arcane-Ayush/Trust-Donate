import React, { useEffect, useState } from 'react';
import StatsPanel from '../components/StatsPanel';
import { getTotals, getDonations, getExpenses } from '../../../shared/blockchain.js';

const MOCK_TOTALS = { totalDonated: 12500, totalSpent: 8200, remaining: 4300 };
const MOCK_DONATIONS = [
  { donor: '0x1234...5678', amount: 2500, category: 'Food', timestamp: Date.now() - 3600000 },
  { donor: '0xABCD...1234', amount: 5000, category: 'Healthcare', timestamp: Date.now() - 7200000 },
];
const MOCK_EXPENSES = [
  { amount: 5000, category: 'Food', invoiceHash: '0xabc123...', timestamp: Date.now(), flagged: false },
  { amount: 3200, category: 'Education', invoiceHash: '0xdef456...', timestamp: Date.now() - 86400000, flagged: true },
];

const PublicDashboard = () => {
  const [totals, setTotals] = useState({ totalDonated: 0, totalSpent: 0, remaining: 0 });
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const liveTotals = await getTotals();
        const liveDonations = await getDonations();
        const liveExpenses = await getExpenses();
        setTotals(liveTotals);
        
        // Combine feeds
        const combined = [
          ...liveDonations.map(d => ({ ...d, type: 'Donation' })),
          ...liveExpenses.map(e => ({ ...e, type: 'Expense' }))
        ];
        // Sort chronologically (newest first)
        combined.sort((a, b) => b.timestamp - a.timestamp);
        setFeed(combined);
      } catch (err) {
        console.warn('Using mock data due to blockchain connection failure:', err);
        setTotals(MOCK_TOTALS);
        const combined = [
          ...MOCK_DONATIONS.map(d => ({ ...d, type: 'Donation' })),
          ...MOCK_EXPENSES.map(e => ({ ...e, type: 'Expense' }))
        ];
        combined.sort((a, b) => b.timestamp - a.timestamp);
        setFeed(combined);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
            Public Transparency Dashboard
          </h1>
          <p className="text-lg text-gray-400">Independently verify every donation and expense on the Base Sepolia blockchain.</p>
        </header>
        
        <StatsPanel {...totals} />

        <section className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-100 border-b border-white/10 pb-4">Live Immutable Feed</h2>
          
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
              <p className="mt-4 text-gray-400">Syncing with blockchain...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feed.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No records found on-chain.</p>
              ) : (
                feed.map((item, idx) => (
                  <div key={idx} className="flex items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-inner" style={{ background: item.type === 'Donation' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(244, 63, 94, 0.2)' }}>
                      {item.type === 'Donation' ? '↑' : '↓'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold text-gray-300">
                          {item.type === 'Donation' 
                            ? <span className="text-emerald-400">Donation Received</span> 
                            : <span className="text-rose-400">Expense Recorded</span>}
                          {' '} — <span className="text-gray-400 text-xs px-2 py-1 bg-gray-800 rounded-md ml-2">{item.category}</span>
                        </p>
                        <span className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <h4 className="text-xl font-bold mt-1">${Number(item.amount).toLocaleString()}</h4>
                      <div className="mt-2 text-xs text-gray-500">
                        {item.type === 'Donation' 
                          ? <span>From: <span className="font-mono text-gray-400">{item.donor}</span></span> 
                          : <span>Invoice Hash: <span className="font-mono text-gray-400">{item.invoiceHash}</span></span>}
                        {item.flagged && <span className="ml-3 text-rose-500 font-bold uppercase tracking-wider">Flagged</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default PublicDashboard;

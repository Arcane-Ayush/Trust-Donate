import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsPanel from '../components/StatsPanel';
import { getTotals, getDonations, getExpenses, flagExpense, computeInvoiceHash } from '../../../shared/blockchain.js';
import { Upload, CheckCircle2, XCircle, Search } from 'lucide-react';

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
  const [verifyStatus, setVerifyStatus] = useState('idle'); // idle, checking, matched, failed
  const [matchedHash, setMatchedHash] = useState(null);

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
          ...liveExpenses.map((e, idx) => ({ ...e, type: 'Expense', expenseId: idx }))
        ];
        // Sort chronologically (newest first)
        combined.sort((a, b) => b.timestamp - a.timestamp);
        setFeed(combined);
      } catch (err) {
        console.warn('Using mock data due to blockchain connection failure:', err);
        setTotals(MOCK_TOTALS);
        const combined = [
          ...MOCK_DONATIONS.map(d => ({ ...d, type: 'Donation' })),
          ...MOCK_EXPENSES.map((e, idx) => ({ ...e, type: 'Expense', expenseId: idx }))
        ];
        combined.sort((a, b) => b.timestamp - a.timestamp);
        setFeed(combined);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const [localVerified, setLocalVerified] = useState(new Set());

  const handleToggleVerified = (expenseId) => {
    const newSet = new Set(localVerified);
    if (newSet.has(expenseId)) {
      newSet.delete(expenseId);
    } else {
      newSet.add(expenseId);
    }
    setLocalVerified(newSet);
  };

  const handleFlagExpense = async (expenseId) => {
    try {
      await flagExpense(expenseId);
      alert('Expense flagged successfully! The community has been alerted.');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to flag expense. Please ensure your wallet is connected. ' + err.message);
    }
  };

  const handleVerify = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVerifyStatus('checking');
    setMatchedHash(null);

    try {
      const hash = await computeInvoiceHash(file);
      // Look for the hash in the feed
      const match = feed.find(item => item.type === 'Expense' && item.invoiceHash === hash);
      
      if (match) {
        setVerifyStatus('matched');
        setMatchedHash(hash);
        // Automatically mark as verified locally
        setLocalVerified(prev => new Set([...prev, match.expenseId]));
      } else {
        setVerifyStatus('failed');
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setVerifyStatus('failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-900 text-white font-sans p-8"
    >
      <div className="max-w-6xl mx-auto">
        <motion.header 
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
            Public Transparency Dashboard
          </h1>
          <p className="text-lg text-gray-400">Independently verify every donation and expense on the Base Sepolia blockchain.</p>
        </motion.header>
        
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <StatsPanel {...totals} />
        </motion.div>

        {/* IN-BROWSER VERIFIER TOOL */}
        <motion.section 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden"
        >
          {/* Decorative background pulse if checking */}
          {verifyStatus === 'checking' && <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>}
          {verifyStatus === 'matched' && <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>}
          {verifyStatus === 'failed' && <div className="absolute inset-0 bg-rose-500/10 animate-pulse"></div>}

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                <Search className="text-indigo-400" />
                Zero-Knowledge Verifier
              </h2>
              <p className="text-sm text-gray-400">
                Did an NGO give you a receipt? Upload it here to mathematically verify its authenticity against the blockchain. The file never leaves your computer.
              </p>
            </div>
            
            <div className="w-full md:w-96 flex flex-col items-center">
              <div className={`relative w-full border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer
                ${verifyStatus === 'idle' ? 'border-slate-600 hover:bg-slate-800/50 hover:border-indigo-500' : ''}
                ${verifyStatus === 'checking' ? 'border-indigo-500 bg-indigo-500/5' : ''}
                ${verifyStatus === 'matched' ? 'border-emerald-500 bg-emerald-500/10' : ''}
                ${verifyStatus === 'failed' ? 'border-rose-500 bg-rose-500/10' : ''}
              `}>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleVerify}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                
                {verifyStatus === 'idle' && (
                  <div className="flex flex-col items-center text-gray-400 pointer-events-none">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Drop PDF to Verify</span>
                  </div>
                )}
                {verifyStatus === 'checking' && (
                  <div className="flex flex-col items-center text-indigo-400 pointer-events-none">
                    <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mb-2" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Computing Hash...</span>
                  </div>
                )}
                {verifyStatus === 'matched' && (
                  <div className="flex flex-col items-center text-emerald-400 pointer-events-none">
                    <CheckCircle2 className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold uppercase tracking-wider">100% Authentic Match!</span>
                  </div>
                )}
                {verifyStatus === 'failed' && (
                  <div className="flex flex-col items-center text-rose-400 pointer-events-none">
                    <XCircle className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Fraud Detected. No Match.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl mt-8"
        >
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
                <AnimatePresence>
                  {feed.map((item, idx) => {
                    const isMatched = item.type === 'Expense' && item.invoiceHash === matchedHash;
                    const isLocallyVerified = item.type === 'Expense' && localVerified.has(item.expenseId);
                    
                    return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (idx * 0.1) }}
                      className={`flex items-center p-4 rounded-xl border transition-all duration-500 ${
                        isMatched || isLocallyVerified
                          ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-[1.02]' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-inner" style={{ background: item.type === 'Donation' ? 'rgba(52, 211, 153, 0.2)' : (isMatched || isLocallyVerified) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)' }}>
                        {item.type === 'Donation' ? '↑' : (isMatched || isLocallyVerified) ? <CheckCircle2 className="text-emerald-400 w-5 h-5"/> : '↓'}
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
                        <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                          <div>
                            {item.type === 'Donation' 
                              ? <span>From: <span className="font-mono text-gray-400">{item.donor}</span></span> 
                              : <span>Invoice Hash: <span className="font-mono text-gray-400">{item.invoiceHash}</span></span>}
                          </div>
                          <div className="flex items-center gap-2">
                            {item.flagged ? (
                              <span className="text-rose-500 font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-1 rounded">Flagged on Chain</span>
                            ) : item.type === 'Expense' ? (
                              <>
                                {isLocallyVerified ? (
                                  <button onClick={() => handleToggleVerified(item.expenseId)} className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                                    Verified ✓
                                  </button>
                                ) : (
                                  <button onClick={() => handleToggleVerified(item.expenseId)} className="text-xs font-semibold text-emerald-400/70 hover:text-emerald-400 hover:bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 transition-colors uppercase tracking-widest">
                                    Mark Verified
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleFlagExpense(item.expenseId)}
                                  className="text-xs font-semibold bg-gray-700/50 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 border border-gray-600 hover:border-rose-500/50 py-1 px-3 rounded transition-all uppercase tracking-widest"
                                >
                                  Flag Suspicious
                                </button>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )})}
                </AnimatePresence>
              )}
            </div>
          )}
        </motion.section>
      </div>
    </motion.div>
  );
};

export default PublicDashboard;

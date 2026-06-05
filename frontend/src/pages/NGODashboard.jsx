import React, { useState, useEffect } from 'react';
import StatsPanel from '../components/StatsPanel';
import ExpenseCard from '../components/ExpenseCard';
import { getTotals, getExpenses, computeInvoiceHash, recordExpense, flagExpense } from '../../../shared/blockchain.js';

const MOCK_TOTALS = { totalDonated: 12500, totalSpent: 8200, remaining: 4300 };
const MOCK_EXPENSES = [
  { amount: 5000, category: 'Food', invoiceHash: '0xabc123...', timestamp: Date.now(), flagged: false },
  { amount: 3200, category: 'Education', invoiceHash: '0xdef456...', timestamp: Date.now() - 86400000, flagged: true },
];

const NGODashboard = () => {
  const [totals, setTotals] = useState({ totalDonated: 0, totalSpent: 0, remaining: 0 });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const liveTotals = await getTotals();
        const liveExpenses = await getExpenses();
        setTotals(liveTotals);
        // Sort chronologically (newest first)
        setExpenses(liveExpenses.sort((a, b) => b.timestamp - a.timestamp));
      } catch (err) {
        console.warn('Using mock data due to blockchain connection failure:', err);
        setTotals(MOCK_TOTALS);
        setExpenses(MOCK_EXPENSES);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRecordExpense = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload an invoice PDF.');
    
    setIsSubmitting(true);
    try {
      const invoiceHash = await computeInvoiceHash(file);
      await recordExpense(amount, category, invoiceHash);
      alert('Expense recorded on-chain successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to record expense. Ensure you are connected as Admin. ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFlagExpense = async (expenseId) => {
    try {
      await flagExpense(expenseId);
      alert('Expense flagged successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to flag expense: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              NGO Admin Dashboard
            </h1>
            <span className="text-sm bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full border border-rose-500/30">
              Admin Wallet Required
            </span>
          </div>
          <p className="text-gray-400">Manage community funds and securely commit invoice proofs on-chain.</p>
        </header>

        <StatsPanel {...totals} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Column */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-3">Record New Expense</h2>
              <form onSubmit={handleRecordExpense} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Amount ($)</label>
                  <input 
                    type="number" 
                    required 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. 500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Food</option>
                    <option>Education</option>
                    <option>Healthcare</option>
                    <option>Logistics</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Invoice PDF</label>
                  <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center hover:bg-slate-800/50 transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".pdf" 
                      required
                      onChange={e => setFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-gray-400">
                      {file ? <span className="text-indigo-400 font-semibold">{file.name}</span> : <span>Upload or drag PDF here</span>}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">File is never uploaded. Only its SHA-256 hash is sent to the blockchain for verifiable commitment.</p>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                >
                  {isSubmitting ? 'Committing to Chain...' : 'Record On-Chain'}
                </button>
              </form>
            </div>
          </div>

          {/* History Column */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl h-full">
              <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-3">Expense History</h2>
              
              {loading ? (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-400 mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {expenses.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No expenses recorded yet.</p>
                  ) : (
                    expenses.map((expense, idx) => (
                      <ExpenseCard 
                        key={idx} 
                        expense={expense} 
                        expenseId={expenses.length - 1 - idx} // Reverse calculating ID for simple display
                        onFlag={handleFlagExpense} 
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NGODashboard;

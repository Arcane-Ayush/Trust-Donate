import React from 'react';

const ExpenseCard = ({ expense, expenseId, onFlag }) => {
  const { amount, category, invoiceHash, timestamp, flagged } = expense;
  
  const shortHash = invoiceHash ? `${invoiceHash.slice(0, 6)}...${invoiceHash.slice(-4)}` : 'N/A';
  const dateStr = new Date(timestamp).toLocaleString();

  // Simple check for within lock period (e.g., 24 hours)
  const isWithinLockPeriod = (Date.now() - timestamp) <= (24 * 60 * 60 * 1000);

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-5 mb-4 shadow-lg hover:bg-white/10 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 mb-3">
            {category}
          </span>
          <h4 className="text-2xl font-bold text-white mb-1">${Number(amount).toLocaleString()}</h4>
          <p className="text-sm text-gray-400">Invoice: <span className="font-mono text-gray-300">{shortHash}</span></p>
          <p className="text-xs text-gray-500 mt-2">{dateStr}</p>
        </div>
        
        <div className="flex flex-col items-end">
          {flagged ? (
            <div className="flex items-center space-x-1 text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-bold tracking-wide uppercase">Flagged</span>
            </div>
          ) : (
            isWithinLockPeriod && onFlag && (
              <button 
                onClick={() => onFlag(expenseId)}
                className="text-xs font-semibold bg-gray-700/50 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 border border-gray-600 hover:border-rose-500/50 py-1.5 px-3 rounded transition-all"
              >
                Flag Suspicious
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;

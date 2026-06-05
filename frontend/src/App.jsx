import React, { useState } from 'react';
import Landing from './pages/Landing';
import Donate from './pages/Donate';
import UserDashboard from './pages/UserDashboard';
import { connectWallet } from '../../shared/blockchain.js';
import { Shield, Home, Heart, User } from 'lucide-react';
import WalletButton from './components/WalletButton';

function App() {
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const data = await connectWallet();
      setAddress(data.address);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing address={address} onConnect={handleConnect} isLoading={isLoading} setPage={setCurrentPage} />;
      case 'donate':
        return <Donate address={address} />;
      case 'dashboard':
        return <UserDashboard address={address} />;
      default:
        return <Landing address={address} onConnect={handleConnect} isLoading={isLoading} setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative selection:bg-blue-500/30 overflow-x-hidden">
      {/* Visual background elements */}
      <div className="fixed inset-0 grid-lines pointer-events-none z-0 opacity-50" aria-hidden="true" />
      <div className="fixed inset-0 bg-gradient-to-tr from-slate-950 via-slate-950 to-blue-900/10 pointer-events-none z-0" aria-hidden="true" />

      {/* Dynamic Header */}
      {currentPage !== 'landing' && (
        <header className="sticky top-0 z-50 glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div 
              className="flex items-center gap-2.5 cursor-pointer group" 
              onClick={() => setCurrentPage('landing')}
              role="button"
              aria-label="TrustDonate Home"
            >
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">TrustDonate</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/50 p-1 rounded-2xl border border-white/5">
              <button 
                onClick={() => setCurrentPage('landing')}
                className={`px-4 py-2 flex items-center gap-2 text-sm font-bold rounded-xl transition-all ${currentPage === 'landing' ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <Home className="w-4 h-4" /> Home
              </button>
              <button 
                onClick={() => setCurrentPage('donate')}
                className={`px-4 py-2 flex items-center gap-2 text-sm font-bold rounded-xl transition-all ${currentPage === 'donate' ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <Heart className="w-4 h-4" /> Donate
              </button>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`px-4 py-2 flex items-center gap-2 text-sm font-bold rounded-xl transition-all ${currentPage === 'dashboard' ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <User className="w-4 h-4" /> My Impact
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <WalletButton address={address} onConnect={handleConnect} isLoading={isLoading} />
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow relative z-10" id="main-content">
        {renderPage()}
      </main>

      {/* Floating Navigation for Landing Page */}
      {currentPage === 'landing' && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 glass px-3 py-3 rounded-2xl shadow-2xl flex gap-3 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => setCurrentPage('donate')}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            aria-label="Go to Donate page"
          >
            Start Donating
          </button>
          <button 
            onClick={() => setCurrentPage('dashboard')}
            className="px-6 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all active:scale-95"
            aria-label="Go to My Impact page"
          >
            View My Impact
          </button>
        </nav>
      )}

      <footer className="py-12 border-t border-white/5 text-center relative z-10">
        <p className="text-slate-500 text-sm font-medium">
          Built for the Base Hackathon 2026 &nbsp;·&nbsp; Powered by UGF &amp; Base Sepolia
        </p>
      </footer>
    </div>
  );
}

export default App;

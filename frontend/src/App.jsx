import React, { useState } from 'react';
import Landing from './pages/Landing';
import Donate from './pages/Donate';
import UserDashboard from './pages/UserDashboard';
import PublicDashboard from './pages/PublicDashboard';
import NGODashboard from './pages/NGODashboard';
import { connectWallet } from '@shared/blockchain.js';
import { Shield, Home, Heart, User, X, Menu, ArrowUpRight } from 'lucide-react';
import WalletButton from './components/WalletButton';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      case 'public':
        return <PublicDashboard />;
      case 'ngo':
        return <NGODashboard />;
      default:
        return <Landing address={address} onConnect={handleConnect} isLoading={isLoading} setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative selection:bg-[#5E0ED7]/30 overflow-x-hidden font-body text-black">
      {/* Dynamic Header */}
      {currentPage !== 'landing' && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 md:px-12 py-5 flex justify-between items-center">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => setCurrentPage('landing')}
            >
              <div className="w-8 h-8 rounded-full border-2 border-[#5E0ED7] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#5E0ED7]" />
              </div>
              <span className="text-xl font-bold tracking-tight uppercase italic hidden sm:block">TrustDonate</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-12">
              <button 
                onClick={() => setCurrentPage('landing')}
                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${currentPage === 'landing' ? 'text-[#5E0ED7]' : 'text-black/40 hover:text-black'}`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentPage('donate')}
                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${currentPage === 'donate' ? 'text-[#5E0ED7]' : 'text-black/40 hover:text-black'}`}
              >
                Donate
              </button>
              <button 
                onClick={() => setCurrentPage('dashboard')}
                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${currentPage === 'dashboard' ? 'text-[#5E0ED7]' : 'text-black/40 hover:text-black'}`}
              >
                Impact
              </button>
              <button 
                onClick={() => setCurrentPage('public')}
                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${currentPage === 'public' ? 'text-[#5E0ED7]' : 'text-black/40 hover:text-black'}`}
              >
                Transparency
              </button>
              <button 
                onClick={() => setCurrentPage('ngo')}
                className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors ${currentPage === 'ngo' ? 'text-[#5E0ED7]' : 'text-black/40 hover:text-black'}`}
              >
                NGO Portal
              </button>
            </nav>

            <div className="flex items-center gap-4">
              <WalletButton address={address} onConnect={handleConnect} isLoading={isLoading} />
              <button 
                className="md:hidden w-9 h-9 rounded-full bg-black flex items-center justify-center"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-white p-5 sm:px-8 flex flex-col"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-full border-2 border-[#5E0ED7] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#5E0ED7]" />
              </div>
              <button 
                className="w-9 h-9 rounded-full bg-black flex items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex flex-col gap-8 mt-16">
              <button 
                onClick={() => { setCurrentPage('landing'); setIsMenuOpen(false); }}
                className="text-4xl font-semibold tracking-widest uppercase text-left"
              >
                Home
              </button>
              <button 
                onClick={() => { setCurrentPage('donate'); setIsMenuOpen(false); }}
                className="text-4xl font-semibold tracking-widest uppercase text-left"
              >
                Donate
              </button>
              <button 
                onClick={() => { setCurrentPage('dashboard'); setIsMenuOpen(false); }}
                className="text-4xl font-semibold tracking-widest uppercase text-left"
              >
                Impact
              </button>
              <button 
                onClick={() => { setCurrentPage('public'); setIsMenuOpen(false); }}
                className="text-4xl font-semibold tracking-widest uppercase text-left"
              >
                Transparency
              </button>
              <button 
                onClick={() => { setCurrentPage('ngo'); setIsMenuOpen(false); }}
                className="text-4xl font-semibold tracking-widest uppercase text-left"
              >
                NGO Portal
              </button>
            </div>

            <button 
              onClick={() => { setCurrentPage('donate'); setIsMenuOpen(false); }}
              className="mt-auto flex items-center justify-between text-2xl font-semibold tracking-widest uppercase text-[#5E0ED7] pb-8 border-b border-zinc-100"
            >
              Start Donating
              <ArrowUpRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow relative z-10" id="main-content">
        {renderPage()}
      </main>

      <footer className="py-12 border-t border-zinc-100 text-center relative z-10">
        <p className="text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase">
          BUILT FOR THE BASE HACKATHON 2026 &nbsp;·&nbsp; POWERED BY UGF &amp; BASE SEPOLIA
        </p>
      </footer>
    </div>
  );
}

export default App;

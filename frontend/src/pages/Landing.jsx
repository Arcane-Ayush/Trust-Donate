import React from 'react';
import { Shield, ArrowRight, BarChart3, Globe } from 'lucide-react';
import WalletButton from '../components/WalletButton';

export default function Landing({ address, onConnect, isLoading, setPage }) {
  return (
    <div className="relative isolate">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto relative z-20">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setPage('landing')}>
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-6 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white font-display uppercase italic">TrustDonate</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setPage('dashboard')} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Public Audit</button>
          <button onClick={() => setPage('landing')} className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Transparency</button>
          <div className="h-4 w-px bg-slate-800" />
          <WalletButton address={address} onConnect={onConnect} isLoading={isLoading} />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-40 relative">
        <div className="max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-10 animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Deployed on Base Sepolia
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Immutable <br />
            <span className="text-gradient">Audit Layer</span> <br />
            for Good.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-12 max-w-2xl font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            A centralized database can be modified by the NGO or the platform owner. 
            A public blockchain provides an immutable audit trail that any donor can independently verify — 
            we&rsquo;re not replacing payments, we&rsquo;re adding accountability.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <button 
              onClick={() => setPage('donate')}
              className="px-8 py-4 bg-white text-slate-950 font-black uppercase tracking-tighter rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 shadow-xl shadow-white/5 active:scale-95"
            >
              Start Donating <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setPage('dashboard')}
              className="px-8 py-4 bg-slate-900 text-white font-black uppercase tracking-tighter rounded-xl border border-white/5 hover:bg-slate-800 transition-all active:scale-95"
            >
              View Public Audit
            </button>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-20 top-20 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      </section>

      {/* Grid Features */}
      <section className="border-t border-white/5 bg-slate-950/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 border-x border-white/5 relative z-10">
          <div className="p-10 border-b md:border-b-0 md:border-r border-white/5 hover:bg-white/[0.02] transition-colors group">
            <BarChart3 className="w-10 h-10 text-blue-500 mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-4 font-display">Real-time Audit</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every donation and expense is recorded on-chain instantly. Zero delay in transparency, verified by the network.
            </p>
          </div>
          <div className="p-10 border-b md:border-b-0 md:border-r border-white/5 hover:bg-white/[0.02] transition-colors group">
            <Shield className="w-10 h-10 text-indigo-500 mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-4 font-display">Fraud Resistant</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Invoice hash commitments and flagging windows ensure NGOs stay accountable. Provable fraud, permanently visible.
            </p>
          </div>
          <div className="p-10 hover:bg-white/[0.02] transition-colors group">
            <Globe className="w-10 h-10 text-cyan-500 mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-4 font-display">Gasless UX</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Powered by UGF. Pay with Mock USD, never worry about ETH for gas fees. Web2 convenience, Web3 security.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

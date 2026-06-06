import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, ShieldAlert, Lock, Eye, Zap, Database, Globe, AlertTriangle } from 'lucide-react';
import WalletButton from '../components/WalletButton';
import { useUGFFallback, setUGFFallback } from '../../../shared/blockchain.js';

const NAV_LINKS = [
  { name: 'Public Audit', id: 'dashboard' },
  { name: 'Transparency', id: 'public' },
  { name: 'Donate', id: 'donate' }
];

const fadeDown = {
  hidden: { opacity: 0, y: -20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  })
};

const headingSlideUp = {
  hidden: { y: '110%' },
  visible: (i) => ({
    y: 0,
    transition: { delay: 0.4 + i * 0.14, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  })
};

const STATS = [
  { value: '1.2M', label: 'TOTAL\nFUNDED' },
  { value: '150', label: 'NGOs\nON-CHAIN' },
  { value: '100%', label: 'AUDIT\nPURITY' }
];

const FRAUD_LAYERS = [
  {
    icon: <Lock className="w-6 h-6" />,
    title: "INVOICE COMMITMENT",
    desc: "NGOs SUBMIT SHA256 HASHES OF INVOICES ON-CHAIN. ANYONE CAN VERIFY THE ORIGINAL PDF AGAINST THE CRYPTOGRAPHIC PROOF."
  },
  {
    icon: <ShieldAlert className="w-6 h-6" />,
    title: "TIME-LOCK DISPUTE",
    desc: "A 24-HOUR WINDOW ALLOWS ANYONE TO FLAG SUSPICIOUS EXPENSES BEFORE THEY ARE FINALIZED IN THE SYSTEM."
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "PERMANENT RECORDS",
    desc: "DATA IS READ DIRECTLY FROM BASE SEPOLIA. EVEN IF THE FRONTEND GOES DOWN, THE AUDIT TRAIL REMAINS PUBLIC."
  }
];

export default function Landing({ address, onConnect, isLoading, setPage }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [ugfFallback, setUgfFallback] = useState(useUGFFallback);

  const togglePolyfix = () => {
    const newVal = !ugfFallback;
    setUgfFallback(newVal);
    setUGFFallback(newVal);
  };

  return (
    <div className="relative flex flex-col w-full bg-white text-black font-body overflow-x-hidden">
      {/* SECTION 1: HERO & NAV */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-40"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4" type="video/mp4" />
        </video>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 flex items-center justify-between px-5 sm:px-8 md:px-12 py-8 bg-transparent transition-all border-none">
          <motion.div 
            custom={0} initial="hidden" animate="visible" variants={fadeDown}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setPage('landing')}
          >
            <div className="w-8 h-8 rounded-full border-2 border-[#5E0ED7] flex items-center justify-center transition-transform group-hover:rotate-12 bg-white/10 shadow-[0_0_20px_rgba(94,14,215,0.4)]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#5E0ED7] shadow-[0_0_10px_#5E0ED7]" />
            </div>
            <span className="text-[15px] font-black tracking-[0.35em] uppercase italic hidden sm:block text-black drop-shadow-[0_2px_8px_rgba(255,255,255,1)] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">TrustDonate</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-14">
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.name}
                custom={i + 1} initial="hidden" animate="visible" variants={fadeDown}
                onClick={() => setPage(link.id)}
                className="text-[13px] font-black tracking-[0.4em] uppercase text-black hover:text-[#5E0ED7] transition-all drop-shadow-[0_2px_8px_rgba(255,255,255,1)] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]"
              >
                {link.name}
              </motion.button>
            ))}
          </div>

          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeDown} className="flex items-center gap-4 sm:gap-8">
            <button 
              onClick={togglePolyfix}
              title="Use it when UGF is down"
              className={`relative group p-2 rounded-full border-2 transition-all ${ugfFallback ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-zinc-200 text-zinc-400 hover:text-black hover:border-black shadow-sm bg-white/50 backdrop-blur'}`}
            >
              <AlertTriangle className="w-5 h-5" />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest uppercase bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {ugfFallback ? 'UGF Bypassed' : 'Bypass UGF'}
              </span>
            </button>
            <div className="scale-95 origin-right shadow-2xl hidden sm:block">
              <WalletButton address={address} onConnect={onConnect} isLoading={isLoading} />
            </div>
            <button 
              className="w-11 h-11 rounded-full bg-black flex flex-col items-center justify-center gap-1.5 group transition-transform active:scale-90 shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:bg-[#5E0ED7]"
              onClick={() => setIsMenuOpen(true)}
            >
              <span className="w-6 h-0.5 bg-white transition-all group-hover:w-4" />
              <span className="w-6 h-0.5 bg-white" />
              <span className="w-6 h-0.5 bg-white transition-all group-hover:w-4" />
            </button>
          </motion.div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col pt-12 md:pt-0">
          {/* Stats Row */}
          <div className="flex-1 flex items-center justify-end px-5 sm:px-8 md:px-12">
            <div className="flex items-center gap-4 sm:gap-12 md:gap-16 justify-between sm:justify-end w-full sm:w-auto">
              {STATS.map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  custom={i + 2} initial="hidden" animate="visible" variants={fadeUp}
                  className="text-right"
                >
                  <div className="flex items-start justify-end">
                    <span className="text-[#5E0ED7] font-semibold mt-1 mr-1 text-sm sm:text-xl md:text-2xl">+</span>
                    <span className="font-semibold tracking-tight leading-none text-2xl sm:text-4xl md:text-6xl lg:text-7xl">{stat.value}</span>
                  </div>
                  <p className="text-[9px] sm:text-xs md:text-sm font-semibold tracking-[0.2em] uppercase whitespace-pre-line leading-tight mt-2 opacity-60">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Hero */}
          <div className="px-5 sm:px-8 md:px-12 pb-8 md:pb-12 flex flex-col gap-8 md:gap-16">
            <div className="flex items-center justify-between gap-4">
              <motion.p 
                custom={5} initial="hidden" animate="visible" variants={fadeUp}
                className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest max-w-[140px] sm:max-w-[200px] md:max-w-xs leading-relaxed"
              >
                NOT REPLACING<br />
                PAYMENTS, ADDING<br />
                ACCOUNTABILITY
              </motion.p>
              <motion.button 
                custom={6} initial="hidden" animate="visible" variants={fadeUp}
                whileHover={{ x: 4 }}
                onClick={() => setPage('donate')}
                className="flex items-center gap-3 text-lg sm:text-2xl md:text-3xl font-semibold tracking-widest uppercase text-[#5E0ED7] whitespace-nowrap"
              >
                Start Donating
                <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </motion.button>
            </div>

            <div className="flex items-end justify-between gap-4">
              <motion.div 
                custom={7} initial="hidden" animate="visible" variants={fadeUp}
                className="w-[120px] sm:w-[200px] md:w-[320px] shrink-0"
              >
                <p className="text-[9px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase text-left leading-relaxed opacity-60">
                  IMMUTABLE AUDIT LAYERS BUILT ON BASE SEPOLIA TO ENSURE NGO TRANSPARENCY IN A GEN-AI WORLD
                </p>
              </motion.div>

              <div className="flex flex-col items-end">
                {['IMMUTABLE', 'IMPACT', 'VERIFIED'].map((word, i) => (
                  <div key={word} className="overflow-hidden">
                    <motion.span
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={headingSlideUp}
                      className="block font-semibold uppercase leading-[0.88] text-right text-[11vw] sm:text-6xl md:text-8xl lg:text-[10rem]"
                    >
                      {word}
                    </motion.span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM / INSIGHT */}
      <section className="relative bg-black text-white px-5 sm:px-8 md:px-12 py-32 md:py-48 flex flex-col gap-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          <p className="text-[10px] font-bold tracking-[0.3em] text-[#5E0ED7] mb-8 uppercase">The Core Insight</p>
          <h2 className="text-4xl md:text-7xl font-semibold tracking-tight uppercase leading-[0.95]">
            A CENTRALIZED DATABASE<br />
            CAN BE MODIFIED BY ANYONE.<br />
            <span className="text-[#5E0ED7]">BLOCKCHAIN CANNOT.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between gap-12 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-md"
          >
            <p className="text-sm md:text-lg tracking-widest leading-relaxed uppercase opacity-60">
              WE ARE NOT A PAYMENT GATEWAY. WE ARE AN IMMUTABLE PUBLIC AUDIT LAYER. TRUSTDONATE ENSURES THAT EVERY COMMITMENT IS PERMANENT, VISIBLE, AND PROTECTED BY THE CRYPTOGRAPHIC RIGOR OF BASE SEPOLIA.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 p-8 border border-white/10"
          >
            <Database className="w-12 h-12 text-[#5E0ED7]" />
            <div>
              <p className="text-[10px] font-bold tracking-widest opacity-40 uppercase">On-Chain Source</p>
              <p className="text-xl font-semibold tracking-widest uppercase">Base Sepolia</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: FRAUD RESISTANCE */}
      <section className="px-5 sm:px-8 md:px-12 py-32 md:py-48 bg-white flex flex-col gap-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-zinc-100 pb-12">
          <h2 className="text-5xl md:text-8xl font-semibold tracking-tighter uppercase leading-[0.85]">
            FRAUD<br />RESISTANCE
          </h2>
          <p className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase text-right max-w-[200px]">
            THREE LAYERS OF CRYPTOGRAPHIC PROTECTION FOR YOUR DONATIONS
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
          {FRAUD_LAYERS.map((layer, i) => (
            <motion.div 
              key={layer.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-8"
            >
              <div className="w-16 h-16 rounded-full border-2 border-[#5E0ED7] flex items-center justify-center text-[#5E0ED7]">
                {layer.icon}
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold tracking-widest uppercase">{layer.title}</h3>
                <p className="text-xs tracking-widest leading-relaxed uppercase opacity-60">
                  {layer.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: UGF SHOWCASE */}
      <section className="relative bg-[#5E0ED7] text-white px-5 sm:px-8 md:px-12 py-32 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="max-w-2xl space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-6"
            >
              <Zap className="w-12 h-12 fill-white" />
              <h2 className="text-4xl md:text-6xl font-semibold tracking-widest uppercase italic leading-none">GASLESS<br />EXPERIENCE</h2>
            </motion.div>
            <p className="text-sm md:text-xl tracking-[0.15em] leading-relaxed uppercase opacity-80">
              POWERED BY THE UNIVERSAL GAS FRAMEWORK (UGF). PAY WITH MOCK USD, NEVER WORRY ABOUT ETH FOR GAS FEES. WEB2 CONVENIENCE MEETS WEB3 SECURITY.
            </p>
            <button 
              onClick={() => setPage('donate')}
              className="px-10 py-5 bg-white text-[#5E0ED7] text-lg font-bold tracking-widest uppercase hover:bg-zinc-100 transition-colors"
            >
              DEMO THE FLOW
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-80 aspect-square border-4 border-white/20 flex flex-col items-center justify-center p-12 text-center"
          >
            <Globe className="w-20 h-20 mb-8 opacity-40" />
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2">LIVE ON</p>
            <p className="text-2xl font-bold tracking-widest uppercase">BASE SEPOLIA</p>
          </motion.div>
        </div>

        {/* Decorative large text behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-bold opacity-[0.03] select-none pointer-events-none whitespace-nowrap">
          UGF POWERED
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-5 sm:px-8 md:px-12 py-20 bg-white border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 rounded-full border-2 border-[#5E0ED7] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#5E0ED7]" />
          </div>
          <span className="text-sm font-bold tracking-[0.2em] uppercase italic">TrustDonate</span>
        </div>

        <p className="text-[10px] font-bold tracking-[0.2em] opacity-40 uppercase text-center md:text-left">
          BUILT FOR THE BASE HACKATHON 2026 &nbsp;·&nbsp; POWERED BY UGF &amp; BASE SEPOLIA
        </p>

        <div className="flex items-center gap-8">
          <button className="text-[10px] font-bold tracking-widest uppercase hover:text-[#5E0ED7] transition-colors">Twitter</button>
          <button className="text-[10px] font-bold tracking-widest uppercase hover:text-[#5E0ED7] transition-colors">GitHub</button>
        </div>
      </footer>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-white p-5 sm:px-8 flex flex-col"
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
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  onClick={() => { setPage(link.id); setIsMenuOpen(false); }}
                  className="text-4xl font-semibold tracking-widest uppercase text-left"
                >
                  {link.name}
                </motion.button>
              ))}
            </div>

            <button 
              onClick={() => { setPage('donate'); setIsMenuOpen(false); }}
              className="mt-auto flex items-center justify-between text-2xl font-semibold tracking-widest uppercase text-[#5E0ED7] pb-8 border-b border-zinc-100"
            >
              Start Donating
              <ArrowUpRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

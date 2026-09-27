import React from 'react';
import { Terminal, Database, FolderLock } from 'lucide-react';
import { TunqLogo } from './TunqLogo';

interface HeaderNavProps {
  activeView: 'decision' | 'explorer' | 'dataroom';
  onSelectView: (view: 'decision' | 'explorer' | 'dataroom') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ activeView, onSelectView }) => {
  return (
    <header className="border-b-2 border-b-black bg-[#161B22] text-zinc-100 font-mono text-xs sticky top-0 z-50 shadow-lg">
      {/* 90s Top Ticker Bar */}
      <div className="border-b border-[#21262D] px-4 py-1 flex items-center justify-between text-[10px] text-zinc-400 bg-[#090D12]">
        <div className="flex items-center gap-3">
          <span className="text-[#03FFB2] font-semibold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 bg-[#03FFB2] inline-block animate-pulse" />
            TUNQ // SYSTEM_ONE DECISION ENGINE
          </span>
          <span className="text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-400">
            BASE OFFICIELLE : ANSD (SÉNÉGAL) & BCEAO (UEMOA)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-400">
            ARBITRAGE : <span className="text-[#03FFB2]">JEV (TYPESAFE AI)</span>
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">
            MOTEUR : <span className="text-cyan-400">GEMINI</span>
          </span>
        </div>
      </div>

      {/* Main Nav Header with 90s look */}
      <div className="px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand with SVG Logo */}
        <div className="flex items-center gap-3">
          {/* Logo SVG rendered with neon emerald accent */}
          <div className="bg-[#090D12] border-2 border-t-zinc-600 border-l-zinc-600 border-b-black border-r-black p-1.5 flex items-center justify-center shadow-inner">
            <TunqLogo className="h-6 w-auto text-[#03FFB2]" fill="#03FFB2" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white font-mono">
                TUNQ
              </span>
              <span className="text-[9px] bg-black text-[#03FFB2] px-1.5 py-0.2 border border-zinc-700 font-mono">
                v0.1.0-GUI_98
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 tracking-wide font-sans">
              Intelligence Économique & Arbitrage Décisionnel
            </div>
          </div>
        </div>

        {/* 90s Style View Switchers */}
        <nav className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectView('decision')}
            className={`px-3 py-1.5 text-xs font-mono font-bold transition-all flex items-center gap-1.5 border-2 ${
              activeView === 'decision'
                ? 'bg-[#03FFB2] text-black border-t-white border-l-white border-b-black border-r-black shadow-[inset_1px_1px_0px_rgba(255,255,255,0.6)]'
                : 'bg-[#21262D] text-zinc-300 hover:text-white border-t-zinc-500 border-l-zinc-500 border-b-black border-r-black'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>[ 01 // STUDIO DÉCISION ]</span>
          </button>

          <button
            onClick={() => onSelectView('explorer')}
            className={`px-3 py-1.5 text-xs font-mono font-bold transition-all flex items-center gap-1.5 border-2 ${
              activeView === 'explorer'
                ? 'bg-[#03FFB2] text-black border-t-white border-l-white border-b-black border-r-black shadow-[inset_1px_1px_0px_rgba(255,255,255,0.6)]'
                : 'bg-[#21262D] text-zinc-300 hover:text-white border-t-zinc-500 border-l-zinc-500 border-b-black border-r-black'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>[ 02 // OBSERVATOIRE ANSD ]</span>
          </button>

          <button
            onClick={() => onSelectView('dataroom')}
            className={`px-3 py-1.5 text-xs font-mono font-bold transition-all flex items-center gap-1.5 border-2 ${
              activeView === 'dataroom'
                ? 'bg-[#03FFB2] text-black border-t-white border-l-white border-b-black border-r-black shadow-[inset_1px_1px_0px_rgba(255,255,255,0.6)]'
                : 'bg-[#21262D] text-zinc-300 hover:text-white border-t-zinc-500 border-l-zinc-500 border-b-black border-r-black'
            }`}
          >
            <FolderLock className="h-3.5 w-3.5" />
            <span>[ 03 // DATA ROOM ]</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

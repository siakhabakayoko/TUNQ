import React from 'react';
import { Terminal, Database, FolderLock, Sparkles } from 'lucide-react';

interface HeaderNavProps {
  activeView: 'decision' | 'explorer' | 'dataroom';
  onSelectView: (view: 'decision' | 'explorer' | 'dataroom') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ activeView, onSelectView }) => {
  return (
    <header className="border-b border-[#21262D] bg-[#090D12] text-zinc-100 font-mono text-xs sticky top-0 z-50 shadow-md">
      {/* Top Ticker Bar */}
      <div className="border-b border-[#1C2128] px-4 py-1.5 flex items-center justify-between text-[10px] text-zinc-400 bg-[#06080B]">
        <div className="flex items-center gap-3">
          <span className="text-[#03FFB2] font-semibold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#03FFB2] animate-pulse" />
            TUNQ // SYSTEM ONE STRATEGIC ENGINE
          </span>
          <span className="text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-400">
            BASE STATISTIQUE : ANSD (SÉNÉGAL) & BCEAO (UEMOA)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-zinc-400">
            ARBITRAGE : <span className="text-[#03FFB2]">JEV (TYPESAFE AI)</span>
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">
            SYNTHÈSE : <span className="text-cyan-400">GEMINI</span>
          </span>
        </div>
      </div>

      {/* Main Nav Header */}
      <div className="px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-zinc-900 border border-[#03FFB2] flex items-center justify-center text-[#03FFB2] font-black text-sm shadow-[0_0_10px_rgba(3,255,178,0.3)]">
            TQ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white">TUNQ</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1 py-0.2 border border-zinc-700">
                v0.1.0-alpha
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 tracking-wide font-sans">
              Intelligence Économique & Décision Produit
            </div>
          </div>
        </div>

        {/* View Switchers */}
        <nav className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => onSelectView('decision')}
            className={`px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
              activeView === 'decision'
                ? 'bg-[#03FFB2] text-black border-black font-bold shadow-[0_0_12px_rgba(3,255,178,0.25)]'
                : 'border-zinc-800 text-zinc-400 hover:text-white bg-[#11141A]'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>[ 01 // STUDIO DE DÉCISION ]</span>
          </button>

          <button
            onClick={() => onSelectView('explorer')}
            className={`px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
              activeView === 'explorer'
                ? 'bg-[#03FFB2] text-black border-black font-bold shadow-[0_0_12px_rgba(3,255,178,0.25)]'
                : 'border-zinc-800 text-zinc-400 hover:text-white bg-[#11141A]'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>[ 02 // OBSERVATOIRE ANSD ]</span>
          </button>

          <button
            onClick={() => onSelectView('dataroom')}
            className={`px-3 py-1.5 border transition-all flex items-center gap-1.5 ${
              activeView === 'dataroom'
                ? 'bg-[#03FFB2] text-black border-black font-bold shadow-[0_0_12px_rgba(3,255,178,0.25)]'
                : 'border-zinc-800 text-zinc-400 hover:text-white bg-[#11141A]'
            }`}
          >
            <FolderLock className="h-3.5 w-3.5" />
            <span>[ 03 // DATA ROOM & WORKSPACES ]</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

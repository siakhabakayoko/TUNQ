import React from 'react';
import { Terminal, Database, FolderLock } from 'lucide-react';
import { TunqLogo } from './TunqLogo';

interface HeaderNavProps {
  activeView: 'decision' | 'explorer' | 'dataroom';
  onSelectView: (view: 'decision' | 'explorer' | 'dataroom') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ activeView, onSelectView }) => {
  return (
    <header className="border-b border-border bg-card text-foreground font-mono text-xs sticky top-0 z-50 shadow-xs">
      {/* Top Ticker Bar */}
      <div className="border-b border-border px-4 py-1.5 flex items-center justify-between text-[11px] text-muted-foreground bg-secondary">
        <div className="flex items-center gap-3">
          <span className="text-foreground font-semibold flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 bg-primary inline-block animate-pulse" />
            TUNQ // SYSTEM_ONE DECISION ENGINE
          </span>
          <span className="text-border">|</span>
          <span className="hidden sm:inline text-muted-foreground">
            BASE OFFICIELLE : ANSD (SÉNÉGAL) & BCEAO (UEMOA)
          </span>
        </div>

        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-muted-foreground">
            ARBITRAGE : <span className="text-foreground font-bold">JEV (TYPESAFE AI)</span>
          </span>
          <span className="text-border">|</span>
          <span className="text-muted-foreground">
            SYNTHÈSE : <span className="text-foreground font-bold">GEMINI</span>
          </span>
        </div>
      </div>

      {/* Main Nav Header */}
      <div className="px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card">
        {/* Brand with SVG Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-secondary border border-border p-1.5 flex items-center justify-center">
            <TunqLogo className="h-7 w-auto text-primary" fill="currentColor" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-foreground font-heading">
                TUNQ
              </span>
              <span className="text-[10px] bg-secondary text-foreground px-1.5 py-0.5 border border-border font-mono font-semibold">
                v0.2.0-LIGHT
              </span>
            </div>
            <div className="text-[11px] text-muted-foreground tracking-wide font-sans">
              Intelligence Économique & Arbitrage Décisionnel
            </div>
          </div>
        </div>

        {/* View Switchers */}
        <nav className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSelectView('decision')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold transition-all flex items-center gap-2 border ${
              activeView === 'decision'
                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                : 'bg-secondary text-secondary-foreground hover:bg-muted border-border'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>[ 01 // STUDIO DÉCISION ]</span>
          </button>

          <button
            onClick={() => onSelectView('explorer')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold transition-all flex items-center gap-2 border ${
              activeView === 'explorer'
                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                : 'bg-secondary text-secondary-foreground hover:bg-muted border-border'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>[ 02 // OBSERVATOIRE ANSD ]</span>
          </button>

          <button
            onClick={() => onSelectView('dataroom')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold transition-all flex items-center gap-2 border ${
              activeView === 'dataroom'
                ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                : 'bg-secondary text-secondary-foreground hover:bg-muted border-border'
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

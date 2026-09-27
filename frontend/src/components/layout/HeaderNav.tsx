import React from 'react';
import { TunqLogo } from './TunqLogo';
import { BarChart3, Database, FolderLock } from 'lucide-react';

interface HeaderNavProps {
  activeView: 'decision' | 'explorer' | 'dataroom';
  onSelectView: (view: 'decision' | 'explorer' | 'dataroom') => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ activeView, onSelectView }) => {
  return (
    <header className="border-b border-border bg-card text-foreground sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5">
          <div className="p-2 bg-secondary border border-border flex items-center justify-center">
            <TunqLogo className="h-6 w-auto text-primary" fill="currentColor" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-bold tracking-tight text-foreground font-heading">
                TUNQ
              </span>
              <span className="text-[11px] bg-secondary text-muted-foreground px-2 py-0.5 border border-border font-mono">
                Sénégal & UEMOA
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-0.5">
              Arbitrage économique et validation de rentabilité financière
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => onSelectView('decision')}
            className={`px-4 py-2 text-xs font-medium transition-all flex items-center gap-2 border ${
              activeView === 'decision'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground hover:bg-secondary border-border'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Studio d'arbitrage</span>
          </button>

          <button
            onClick={() => onSelectView('explorer')}
            className={`px-4 py-2 text-xs font-medium transition-all flex items-center gap-2 border ${
              activeView === 'explorer'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground hover:bg-secondary border-border'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Données ANSD</span>
          </button>

          <button
            onClick={() => onSelectView('dataroom')}
            className={`px-4 py-2 text-xs font-medium transition-all flex items-center gap-2 border ${
              activeView === 'dataroom'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground hover:bg-secondary border-border'
            }`}
          >
            <FolderLock className="h-3.5 w-3.5" />
            <span>Data Room</span>
          </button>
        </nav>
      </div>
    </header>
  );
};


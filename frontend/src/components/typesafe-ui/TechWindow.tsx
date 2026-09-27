import React from 'react';

interface TechWindowProps {
  title: string;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'rose' | 'neutral' | 'blue';
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  hasDither?: boolean;
}

export const TechWindow: React.FC<TechWindowProps> = ({
  title,
  badge = 'SYS_READY',
  badgeColor = 'emerald',
  actions,
  children,
  className = '',
  hasDither = false
}) => {
  const badgeClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    amber: 'bg-amber-50 text-amber-800 border-amber-300',
    rose: 'bg-rose-50 text-rose-700 border-rose-300',
    blue: 'bg-sky-50 text-sky-800 border-sky-300',
    neutral: 'bg-muted text-muted-foreground border-border'
  };

  return (
    <div
      className={`relative border border-border bg-card text-card-foreground shadow-xs transition-all ${
        hasDither ? 'bg-[radial-gradient(oklch(0.925_0.005_214.3)_1px,transparent_1px)] [background-size:6px_6px]' : ''
      } ${className}`}
    >
      {/* Precision ASCII corner brackets */}
      <span className="absolute -top-[5px] -left-[3px] text-muted-foreground/50 font-mono text-[10px] select-none pointer-events-none">╔</span>
      <span className="absolute -top-[5px] -right-[3px] text-muted-foreground/50 font-mono text-[10px] select-none pointer-events-none">╗</span>
      <span className="absolute -bottom-[5px] -left-[3px] text-muted-foreground/50 font-mono text-[10px] select-none pointer-events-none">╚</span>
      <span className="absolute -bottom-[5px] -right-[3px] text-muted-foreground/50 font-mono text-[10px] select-none pointer-events-none">╝</span>

      {/* Desktop Titlebar */}
      <div className="flex items-center justify-between border-b border-border bg-secondary px-3.5 py-2 font-mono text-xs select-none">
        <div className="flex items-center gap-2">
          {/* Mini system symbol */}
          <div className="h-3.5 w-3.5 bg-primary text-primary-foreground flex items-center justify-center text-[9px] font-bold">
            ■
          </div>
          <span className="font-bold tracking-wider text-foreground uppercase">
            [ {title} ]
          </span>
        </div>

        <div className="flex items-center gap-2">
          {actions}
          {badge && (
            <span
              className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest font-mono font-medium ${badgeClasses[badgeColor]}`}
            >
              ● {badge}
            </span>
          )}

          {/* Window Control Buttons */}
          <div className="flex items-center gap-1 ml-2">
            <button
              type="button"
              tabIndex={-1}
              className="h-4 w-4 bg-card hover:bg-muted border border-border text-foreground font-mono text-[10px] leading-none flex items-center justify-center font-bold"
              title="Réduire"
            >
              _
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="h-4 w-4 bg-card hover:bg-muted border border-border text-foreground font-mono text-[10px] leading-none flex items-center justify-center font-bold"
              title="Agrandir"
            >
              □
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="h-4 w-4 bg-card hover:bg-destructive hover:text-white border border-border text-muted-foreground font-mono text-[10px] leading-none flex items-center justify-center font-bold"
              title="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Window Body */}
      <div className="p-4 md:p-6 bg-card">{children}</div>
    </div>
  );
};

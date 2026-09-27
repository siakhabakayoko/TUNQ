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
    emerald: 'bg-[#03FFB2]/10 text-[#03FFB2] border-[#03FFB2]/40',
    amber: 'bg-[#FFB224]/10 text-[#FFB224] border-[#FFB224]/40',
    rose: 'bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/40',
    blue: 'bg-cyan-950/40 text-cyan-400 border-cyan-800',
    neutral: 'bg-white/5 text-zinc-400 border-zinc-700'
  };

  return (
    <div
      className={`relative border-2 border-t-zinc-600 border-l-zinc-600 border-b-black border-r-black bg-[#0D1117] text-zinc-100 shadow-xl transition-all ${
        hasDither ? 'bg-[radial-gradient(#1A202C_1px,transparent_1px)] [background-size:6px_6px]' : ''
      } ${className}`}
    >
      {/* 90s ASCII corner decorations */}
      <span className="absolute -top-[5px] -left-[3px] text-zinc-500 font-mono text-[10px] select-none pointer-events-none">╔</span>
      <span className="absolute -top-[5px] -right-[3px] text-zinc-500 font-mono text-[10px] select-none pointer-events-none">╗</span>
      <span className="absolute -bottom-[5px] -left-[3px] text-zinc-500 font-mono text-[10px] select-none pointer-events-none">╚</span>
      <span className="absolute -bottom-[5px] -right-[3px] text-zinc-500 font-mono text-[10px] select-none pointer-events-none">╝</span>

      {/* 90s Desktop Titlebar */}
      <div className="flex items-center justify-between border-b-2 border-b-black bg-gradient-to-r from-[#161B22] via-[#1C2128] to-[#161B22] px-3 py-1.5 font-mono text-xs select-none">
        <div className="flex items-center gap-2">
          {/* Classic 90s mini icon */}
          <div className="h-3.5 w-3.5 bg-black border border-t-zinc-400 border-l-zinc-400 border-b-zinc-800 border-r-zinc-800 flex items-center justify-center text-[9px] text-[#03FFB2] font-bold">
            ■
          </div>
          <span className="font-bold tracking-wider text-zinc-100 uppercase">
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

          {/* 90s OS Window Control Buttons */}
          <div className="flex items-center gap-1 ml-2">
            <button
              type="button"
              tabIndex={-1}
              className="h-4 w-4 bg-[#21262D] hover:bg-[#30363D] border border-t-zinc-500 border-l-zinc-500 border-b-black border-r-black text-zinc-300 font-mono text-[10px] leading-none flex items-center justify-center font-bold"
              title="Réduire"
            >
              _
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="h-4 w-4 bg-[#21262D] hover:bg-[#30363D] border border-t-zinc-500 border-l-zinc-500 border-b-black border-r-black text-zinc-300 font-mono text-[10px] leading-none flex items-center justify-center font-bold"
              title="Agrandir"
            >
              □
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="h-4 w-4 bg-[#21262D] hover:bg-[#FF3B30] hover:text-white border border-t-zinc-500 border-l-zinc-500 border-b-black border-r-black text-zinc-400 font-mono text-[10px] leading-none flex items-center justify-center font-bold"
              title="Fermer"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Window Body */}
      <div className="p-4 md:p-6 bg-[#0B0E14]">{children}</div>
    </div>
  );
};

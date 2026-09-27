import React from 'react';

interface TechWindowProps {
  title: string;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'rose' | 'neutral';
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
    emerald: 'bg-[#03FFB2]/10 text-[#03FFB2] border-[#03FFB2]/30',
    amber: 'bg-[#FFB224]/10 text-[#FFB224] border-[#FFB224]/30',
    rose: 'bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/30',
    neutral: 'bg-white/5 text-zinc-400 border-zinc-700'
  };

  return (
    <div
      className={`relative border border-[#272B33] bg-[#0D1117] text-zinc-100 shadow-2xl transition-all ${
        hasDither ? 'bg-[radial-gradient(#1A202C_1px,transparent_1px)] [background-size:8px_8px]' : ''
      } ${className}`}
    >
      {/* Corner crosshairs for precision engineering look */}
      <span className="absolute -top-[3px] -left-[3px] text-zinc-600 font-mono text-[9px] select-none pointer-events-none">┌</span>
      <span className="absolute -top-[3px] -right-[3px] text-zinc-600 font-mono text-[9px] select-none pointer-events-none">┐</span>
      <span className="absolute -bottom-[3px] -left-[3px] text-zinc-600 font-mono text-[9px] select-none pointer-events-none">└</span>
      <span className="absolute -bottom-[3px] -right-[3px] text-zinc-600 font-mono text-[9px] select-none pointer-events-none">┘</span>

      {/* Mechanical Header Bar */}
      <div className="flex items-center justify-between border-b border-[#272B33] bg-[#161B22] px-3.5 py-2 font-mono text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-none bg-zinc-600 border border-zinc-500" />
            <span className="h-2 w-2 rounded-none bg-zinc-700" />
          </div>
          <span className="font-semibold tracking-wider text-zinc-200">
            [ {title} ]
          </span>
        </div>

        <div className="flex items-center gap-3">
          {actions}
          {badge && (
            <span
              className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest font-mono font-medium ${badgeClasses[badgeColor]}`}
            >
              ● {badge}
            </span>
          )}
        </div>
      </div>

      {/* Window Body */}
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
};

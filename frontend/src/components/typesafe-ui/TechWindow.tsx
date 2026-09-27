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
  badge,
  badgeColor = 'neutral',
  actions,
  children,
  className = ''
}) => {
  const badgeClasses = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-900 border-amber-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
    blue: 'bg-sky-50 text-sky-800 border-sky-200',
    neutral: 'bg-secondary text-muted-foreground border-border'
  };

  return (
    <section className={`border border-border bg-card shadow-xs transition-all ${className}`}>
      {/* Clean Formal Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-foreground font-heading tracking-tight">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {actions}
          {badge && (
            <span
              className={`border px-2.5 py-0.5 text-xs font-medium tracking-wide font-sans ${badgeClasses[badgeColor]}`}
            >
              {badge}
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 md:p-8 bg-card">{children}</div>
    </section>
  );
};

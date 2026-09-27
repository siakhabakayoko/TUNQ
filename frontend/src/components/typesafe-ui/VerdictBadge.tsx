import React from 'react';
import { JevVerdict } from '@/types';

interface VerdictBadgeProps {
  verdict: JevVerdict;
  confidence: number;
  latencyMs?: number;
  rationale: string;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({
  verdict,
  confidence,
  latencyMs = 142,
  rationale
}) => {
  const configs = {
    GO: {
      label: 'GO // VALIDER LE LANCEMENT',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-600',
      tagBg: 'bg-emerald-600 text-white'
    },
    PIVOT: {
      label: 'PIVOT // RÉAJUSTER LES PRIX & COÛTS',
      color: 'text-amber-800',
      bg: 'bg-amber-50/80',
      border: 'border-amber-600',
      tagBg: 'bg-amber-600 text-white'
    },
    NO_GO: {
      label: 'NO-GO // RISQUE D’ATTRITION CRITIQUE',
      color: 'text-rose-700',
      bg: 'bg-rose-50/80',
      border: 'border-rose-600',
      tagBg: 'bg-rose-600 text-white'
    }
  };

  const cfg = configs[verdict];

  return (
    <div className={`border-2 p-5 ${cfg.border} ${cfg.bg} font-mono relative overflow-hidden shadow-xs`}>
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/80 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] tracking-widest text-muted-foreground uppercase font-semibold">
              ARBITRAGE TYPE-SAFE JEV (SYSTEM ONE)
            </span>
            <span className="text-[10px] bg-secondary border border-border px-1.5 py-0.5 text-foreground font-semibold">
              {latencyMs}ms
            </span>
          </div>
          <div className={`text-3xl md:text-4xl font-black tracking-tight ${cfg.color} font-heading`}>
            [ {verdict} ]
          </div>
          <div className="text-xs font-semibold text-foreground/80 mt-1">
            {cfg.label}
          </div>
        </div>

        <div className="text-right flex flex-col md:items-end">
          <span className="text-[10px] text-muted-foreground tracking-wider font-semibold">INDICE DE CONFIANCE</span>
          <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
            {(confidence * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
            CALIBRÉ PAR ÉTAT PROJET
          </span>
        </div>
      </div>

      <div className="relative z-10 text-xs text-foreground leading-relaxed font-sans bg-card/90 p-3.5 border border-border">
        <span className="font-mono text-foreground font-bold mr-1.5">[DIAGNOSTIC JEV] :</span>
        {rationale}
      </div>
    </div>
  );
};

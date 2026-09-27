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
  rationale
}) => {
  const configs = {
    GO: {
      title: 'Projet viable — Lancement recommandé',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50/60',
      border: 'border-emerald-300',
      badge: 'bg-emerald-600 text-white'
    },
    PIVOT: {
      title: 'Réajustement requis avant lancement',
      color: 'text-amber-800',
      bg: 'bg-amber-50/60',
      border: 'border-amber-300',
      badge: 'bg-amber-600 text-white'
    },
    NO_GO: {
      title: 'Risque élevé d’échec économique',
      color: 'text-rose-700',
      bg: 'bg-rose-50/60',
      border: 'border-rose-300',
      badge: 'bg-rose-600 text-white'
    }
  };

  const cfg = configs[verdict];

  return (
    <div className={`border p-6 ${cfg.border} ${cfg.bg} space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className={`px-2.5 py-0.5 text-xs font-bold font-mono tracking-wider ${cfg.badge}`}>
              VERDICT : {verdict}
            </span>
            <span className="text-xs text-muted-foreground font-sans">
              Arbitrage objectif
            </span>
          </div>
          <h3 className={`text-xl font-bold font-heading ${cfg.color}`}>
            {cfg.title}
          </h3>
        </div>

        <div className="sm:text-right">
          <div className="text-xs text-muted-foreground font-sans">Indice de confiance</div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {(confidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="bg-card p-4 border border-border text-sm text-foreground/90 leading-relaxed font-sans">
        <p className="font-medium text-foreground mb-1 text-xs uppercase tracking-wide font-mono">
          Diagnostic de synthèse
        </p>
        <p>{rationale}</p>
      </div>
    </div>
  );
};


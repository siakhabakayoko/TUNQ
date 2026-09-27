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
      color: 'text-[#03FFB2]',
      bg: 'bg-[#03FFB2]/10',
      border: 'border-[#03FFB2]',
      tagBg: 'bg-[#03FFB2] text-black',
      glow: 'shadow-[0_0_20px_rgba(3,255,178,0.2)]'
    },
    PIVOT: {
      label: 'PIVOT // RÉAJUSTER LES PRIX & COÛTS',
      color: 'text-[#FFB224]',
      bg: 'bg-[#FFB224]/10',
      border: 'border-[#FFB224]',
      tagBg: 'bg-[#FFB224] text-black',
      glow: 'shadow-[0_0_20px_rgba(255,178,36,0.2)]'
    },
    NO_GO: {
      label: 'NO-GO // RISQUE D’ATTRITION CRITIQUE',
      color: 'text-[#FF3B30]',
      bg: 'bg-[#FF3B30]/10',
      border: 'border-[#FF3B30]',
      tagBg: 'bg-[#FF3B30] text-white',
      glow: 'shadow-[0_0_20px_rgba(255,59,48,0.2)]'
    }
  };

  const cfg = configs[verdict];

  return (
    <div className={`border-2 p-5 ${cfg.border} ${cfg.bg} ${cfg.glow} font-mono relative overflow-hidden`}>
      {/* Background Matrix/Dither pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-current/20 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] tracking-widest text-zinc-400 uppercase">
              ARBITRAGE TYPE-SAFE JEV (SYSTEM ONE)
            </span>
            <span className="text-[10px] bg-black/40 border border-zinc-700 px-1.5 py-0.2 text-zinc-300">
              {latencyMs}ms
            </span>
          </div>
          <div className={`text-2xl md:text-3xl font-black tracking-tight ${cfg.color}`}>
            [ {verdict} ]
          </div>
          <div className="text-xs font-semibold text-zinc-300 mt-0.5">
            {cfg.label}
          </div>
        </div>

        <div className="text-right flex flex-col md:items-end">
          <span className="text-[10px] text-zinc-400 tracking-wider">INDICE DE CONFIANCE</span>
          <span className="text-xl font-bold tracking-tight text-white">
            {(confidence * 100).toFixed(1)}%
          </span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
            CALIBRÉ PAR ÉTAT PROJET
          </span>
        </div>
      </div>

      <div className="relative z-10 text-xs text-zinc-200 leading-relaxed font-sans bg-black/40 p-3 border border-white/5">
        <span className="font-mono text-zinc-400 font-semibold mr-1.5">[DIAGNOSTIC JEV] :</span>
        {rationale}
      </div>
    </div>
  );
};

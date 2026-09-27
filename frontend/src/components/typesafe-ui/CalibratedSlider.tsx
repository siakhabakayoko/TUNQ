import React from 'react';

interface CalibratedSliderProps {
  label: string;
  score: number; // 1 to 10
  min?: number;
  max?: number;
  benchmarkLabel?: string;
  benchmarkScore?: number;
  unit?: string;
}

export const CalibratedSlider: React.FC<CalibratedSliderProps> = ({
  label,
  score,
  min = 1,
  max = 10,
  benchmarkLabel,
  benchmarkScore,
  unit = '/ 10'
}) => {
  const percentage = Math.max(0, Math.min(100, ((score - min) / (max - min)) * 100));
  const benchmarkPercentage = benchmarkScore
    ? Math.max(0, Math.min(100, ((benchmarkScore - min) / (max - min)) * 100))
    : null;

  // Color threshold
  let trackColor = 'bg-emerald-600';
  let badgeColor = 'text-emerald-700 border-emerald-300 bg-emerald-50';

  if (score < 4.5) {
    trackColor = 'bg-rose-600';
    badgeColor = 'text-rose-700 border-rose-300 bg-rose-50';
  } else if (score < 6.5) {
    trackColor = 'bg-amber-600';
    badgeColor = 'text-amber-800 border-amber-300 bg-amber-50';
  }

  return (
    <div className="font-mono text-xs my-3 bg-secondary/30 border border-border p-3.5">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-foreground font-semibold tracking-wide text-xs leading-snug">{label}</span>
        <span className={`px-2 py-0.5 border text-xs font-bold tracking-widest shrink-0 ${badgeColor}`}>
          {score.toFixed(1)} {unit}
        </span>
      </div>

      {/* Horizontal Calibrated Track */}
      <div className="relative h-7 flex items-center my-2">
        {/* Background Track Line */}
        <div className="absolute w-full h-[2px] bg-border" />

        {/* Graduation Ticks */}
        <div className="absolute w-full flex justify-between px-1 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="h-2 w-[1px] bg-muted-foreground/30" />
          ))}
        </div>

        {/* Benchmark Marker (if available) */}
        {benchmarkPercentage !== null && (
          <div
            className="absolute -top-2 -bottom-2 w-[2px] bg-foreground z-10"
            style={{ left: `${benchmarkPercentage}%` }}
            title={`Benchmark: ${benchmarkScore}`}
          >
            <span className="absolute top-5 -translate-x-1/2 text-[8px] bg-card px-1 border border-border text-foreground font-mono font-bold leading-none shadow-xs">
              REF
            </span>
          </div>
        )}

        {/* Calibrated Slider Box */}
        <div
          className="absolute -translate-x-1/2 z-20 flex flex-col items-center transition-all duration-500 ease-out"
          style={{ left: `${percentage}%` }}
        >
          <div className={`h-4 w-3.5 border border-foreground/40 shadow-xs ${trackColor}`} />
        </div>
      </div>

      {/* Bottom Sub-Labels */}
      <div className="flex justify-between text-[10px] text-muted-foreground pt-3 border-t border-border">
        <span>MIN {min}.0</span>
        {benchmarkLabel && (
          <span className="text-foreground font-semibold">
            {benchmarkLabel} : {benchmarkScore}
          </span>
        )}
        <span>MAX {max}.0</span>
      </div>
    </div>
  );
};

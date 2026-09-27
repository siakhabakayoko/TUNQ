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

  let trackColor = 'bg-emerald-600';
  let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (score < 4.5) {
    trackColor = 'bg-rose-600';
    badgeColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (score < 6.5) {
    trackColor = 'bg-amber-800';
    badgeColor = 'text-amber-800 bg-amber-50 border-amber-200';
  }

  return (
    <div className="py-3 border-b border-border/70 last:border-b-0 space-y-2">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="text-foreground font-medium font-sans">{label}</span>
        <span className={`px-2 py-0.5 border text-xs font-bold font-mono ${badgeColor}`}>
          {score.toFixed(1)} {unit}
        </span>
      </div>

      {/* Progress Track */}
      <div className="relative h-2 w-full bg-secondary overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${trackColor}`}
          style={{ width: `${percentage}%` }}
        />
        {benchmarkPercentage !== null && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-foreground z-10"
            style={{ left: `${benchmarkPercentage}%` }}
            title={`Benchmark: ${benchmarkScore}`}
          />
        )}
      </div>

      {/* Bottom Sub-Labels */}
      <div className="flex justify-between text-[11px] text-muted-foreground font-sans">
        <span>Min {min}.0</span>
        {benchmarkLabel && (
          <span>
            {benchmarkLabel} : <strong className="text-foreground font-mono">{benchmarkScore}</strong>
          </span>
        )}
        <span>Max {max}.0</span>
      </div>
    </div>
  );
};


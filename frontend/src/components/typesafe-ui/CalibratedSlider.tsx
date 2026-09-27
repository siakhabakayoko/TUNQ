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
  let trackColor = 'bg-[#03FFB2]';
  let badgeColor = 'text-[#03FFB2] border-[#03FFB2]/40 bg-[#03FFB2]/10';

  if (score < 4.5) {
    trackColor = 'bg-[#FF3B30]';
    badgeColor = 'text-[#FF3B30] border-[#FF3B30]/40 bg-[#FF3B30]/10';
  } else if (score < 6.5) {
    trackColor = 'bg-[#FFB224]';
    badgeColor = 'text-[#FFB224] border-[#FFB224]/40 bg-[#FFB224]/10';
  }

  return (
    <div className="font-mono text-xs my-3 bg-[#0A0D12] border border-[#21262D] p-3">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-300 font-medium tracking-wide">{label}</span>
        <span className={`px-2 py-0.5 border text-xs font-bold tracking-widest ${badgeColor}`}>
          {score.toFixed(1)} {unit}
        </span>
      </div>

      {/* Horizontal Calibrated Track */}
      <div className="relative h-6 flex items-center">
        {/* Background Track Line */}
        <div className="absolute w-full h-[2px] bg-[#272B33]" />

        {/* Graduation Ticks */}
        <div className="absolute w-full flex justify-between px-1 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="h-2 w-[1px] bg-[#30363D]" />
          ))}
        </div>

        {/* Benchmark Marker (if available) */}
        {benchmarkPercentage !== null && (
          <div
            className="absolute -top-1 -bottom-1 w-[2px] bg-cyan-400 z-10"
            style={{ left: `${benchmarkPercentage}%` }}
            title={`Benchmark: ${benchmarkScore}`}
          >
            <span className="absolute -top-4 -translate-x-1/2 text-[9px] text-cyan-400 font-mono">
              REF
            </span>
          </div>
        )}

        {/* Calibrated Slider Box */}
        <div
          className="absolute -translate-x-1/2 z-20 flex flex-col items-center transition-all duration-500 ease-out"
          style={{ left: `${percentage}%` }}
        >
          <div className={`h-4 w-3.5 border border-black shadow-md ${trackColor}`} />
        </div>
      </div>

      {/* Bottom Sub-Labels */}
      <div className="flex justify-between text-[10px] text-zinc-500 pt-1 border-t border-[#1C2128]">
        <span>MIN {min}.0</span>
        {benchmarkLabel && (
          <span className="text-cyan-400">
            {benchmarkLabel} : {benchmarkScore}
          </span>
        )}
        <span>MAX {max}.0</span>
      </div>
    </div>
  );
};

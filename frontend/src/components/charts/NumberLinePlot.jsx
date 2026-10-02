import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function NumberLinePlot({ numberLineData }) {
  const [hoveredMark, setHoveredMark] = useState(null);

  if (!numberLineData) return null;

  const { min, max, mean, median, modes = [], q1, q3, sd_low, sd_high } = numberLineData;
  const range = max - min > 0 ? max - min : 1.0;

  const toPct = (val) => {
    return Math.max(0, Math.min(100, ((val - min) / range) * 100));
  };

  const pMin = 0;
  const pMax = 100;
  const pMean = toPct(mean);
  const pMed = toPct(median);
  const pQ1 = toPct(q1);
  const pQ3 = toPct(q3);
  const pSdLow = toPct(sd_low);
  const pSdHigh = toPct(sd_high);

  return (
    <div className="w-full py-4 select-none">
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
        <span>1D Statistical Number Line</span>
        <span className="text-[11px] font-mono">Range: [{min}, {max}]</span>
      </div>

      <div className="relative h-28 w-full bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-center">
        {/* Hover Banner */}
        {hoveredMark && (
          <div
            className="absolute -top-3 z-30 transform -translate-x-1/2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-medium px-3 py-1.5 shadow-xl whitespace-nowrap pointer-events-none"
            style={{ left: `${hoveredMark.pct}%` }}
          >
            <strong>{hoveredMark.label}:</strong> {hoveredMark.value}
          </div>
        )}

        <div className="relative h-12 w-full flex items-center">
          {/* Base Axis Line */}
          <div className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />

          {/* 1 SD Shaded Span [mean - sd, mean + sd] */}
          <div
            onMouseEnter={() => setHoveredMark({ label: '±1 Standard Deviation Span', value: `[${sd_low}, ${sd_high}]`, pct: pMean })}
            onMouseLeave={() => setHoveredMark(null)}
            className="absolute h-5 bg-indigo-500/15 dark:bg-indigo-400/20 border border-indigo-400/30 rounded-md cursor-pointer"
            style={{ left: `${pSdLow}%`, width: `${Math.max(2, pSdHigh - pSdLow)}%` }}
          />

          {/* Min & Max Endpoints */}
          <div
            onMouseEnter={() => setHoveredMark({ label: 'Minimum', value: min, pct: pMin })}
            onMouseLeave={() => setHoveredMark(null)}
            className="absolute w-2 h-6 bg-slate-400 dark:bg-slate-500 rounded cursor-pointer"
            style={{ left: '0%' }}
          />
          <div
            onMouseEnter={() => setHoveredMark({ label: 'Maximum', value: max, pct: pMax })}
            onMouseLeave={() => setHoveredMark(null)}
            className="absolute w-2 h-6 bg-slate-400 dark:bg-slate-500 rounded cursor-pointer"
            style={{ right: '0%' }}
          />

          {/* Q1 and Q3 */}
          <div
            onMouseEnter={() => setHoveredMark({ label: 'Q1 (25th percentile)', value: q1, pct: pQ1 })}
            onMouseLeave={() => setHoveredMark(null)}
            className="absolute w-1 h-5 bg-indigo-400 dark:bg-indigo-500 rounded cursor-pointer"
            style={{ left: `${pQ1}%`, transform: 'translateX(-50%)' }}
          />
          <div
            onMouseEnter={() => setHoveredMark({ label: 'Q3 (75th percentile)', value: q3, pct: pQ3 })}
            onMouseLeave={() => setHoveredMark(null)}
            className="absolute w-1 h-5 bg-indigo-400 dark:bg-indigo-500 rounded cursor-pointer"
            style={{ left: `${pQ3}%`, transform: 'translateX(-50%)' }}
          />

          {/* Median Marker (Amber) */}
          <div
            onMouseEnter={() => setHoveredMark({ label: 'Median (50th percentile)', value: median, pct: pMed })}
            onMouseLeave={() => setHoveredMark(null)}
            className="absolute w-2.5 h-8 bg-amber-500 rounded-md shadow-md cursor-pointer z-10"
            style={{ left: `${pMed}%`, transform: 'translateX(-50%)' }}
          />

          {/* Mean Marker (Indigo Ring) */}
          <div
            onMouseEnter={() => setHoveredMark({ label: 'Arithmetic Mean (x̄)', value: mean, pct: pMean })}
            onMouseLeave={() => setHoveredMark(null)}
            className="absolute w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-indigo-500/30 shadow-md cursor-pointer z-20"
            style={{ left: `${pMean}%`, transform: 'translateX(-50%)' }}
          />

          {/* Mode Markers if any */}
          {modes.map((mVal, idx) => {
            const pMode = toPct(mVal);
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredMark({ label: `Mode ${idx + 1}`, value: mVal, pct: pMode })}
                onMouseLeave={() => setHoveredMark(null)}
                className="absolute w-3 h-3 rotate-45 bg-emerald-500 ring-2 ring-emerald-500/40 cursor-pointer z-15"
                style={{ left: `${pMode}%`, transform: 'translateX(-50%) translateY(-14px)' }}
              />
            );
          })}
        </div>

        {/* Legend under axis */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-[10px] text-slate-400 font-mono">
          <span>Min: {min}</span>
          <span className="text-indigo-600 dark:text-indigo-400">Mean: {mean}</span>
          <span className="text-amber-500 font-bold">Median: {median}</span>
          <span>Max: {max}</span>
        </div>
      </div>
    </div>
  );
}

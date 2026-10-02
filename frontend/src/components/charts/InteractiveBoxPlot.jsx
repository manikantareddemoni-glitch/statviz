import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export function InteractiveBoxPlot({ data, title }) {
  const { isDark } = useTheme();
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data) return null;

  const {
    min,
    whisker_low,
    q1,
    median,
    q3,
    whisker_high,
    max,
    lower_fence_mild,
    upper_fence_mild,
    outliers = [],
    extreme_outliers = []
  } = data;

  // Determine span coordinates for 0-100% mapping
  const effectiveMin = Math.min(min, lower_fence_mild);
  const effectiveMax = Math.max(max, upper_fence_mild);
  const range = effectiveMax - effectiveMin > 0 ? effectiveMax - effectiveMin : 1.0;

  const toPct = (val) => {
    return Math.max(0, Math.min(100, ((val - effectiveMin) / range) * 100));
  };

  const pMin = toPct(min);
  const pWhiskerLow = toPct(whisker_low);
  const pQ1 = toPct(q1);
  const pMedian = toPct(median);
  const pQ3 = toPct(q3);
  const pWhiskerHigh = toPct(whisker_high);
  const pMax = toPct(max);
  const pFenceLow = toPct(lower_fence_mild);
  const pFenceHigh = toPct(upper_fence_mild);

  return (
    <div className="w-full py-6 px-4 select-none">
      {/* Title & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-indigo-500/20 border border-indigo-500" />
            <span>IQR Box (Q1 to Q3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500" />
            <span>Median (Q2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-500/30" />
            <span>Outliers (&gt; 1.5×IQR)</span>
          </div>
        </div>
        <div>Tukey 1.5×IQR Rule</div>
      </div>

      {/* SVG Canvas */}
      <div className="relative h-44 sm:h-48 w-full bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-6 flex flex-col justify-center">
        {/* Dynamic Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute -top-3 z-30 transform -translate-x-1/2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-medium px-3 py-1.5 shadow-xl whitespace-nowrap pointer-events-none transition-all duration-150"
            style={{ left: `${hoveredPoint.pct}%` }}
          >
            <strong>{hoveredPoint.label}:</strong> {hoveredPoint.value}
          </div>
        )}

        <div className="relative h-20 w-full flex items-center">
          {/* Inner Fence Guideline Markers */}
          <div
            className="absolute top-0 bottom-0 border-l border-dashed border-slate-300 dark:border-slate-700"
            style={{ left: `${pFenceLow}%` }}
            title={`Lower Inner Fence: ${lower_fence_mild}`}
          />
          <div
            className="absolute top-0 bottom-0 border-l border-dashed border-slate-300 dark:border-slate-700"
            style={{ left: `${pFenceHigh}%` }}
            title={`Upper Inner Fence: ${upper_fence_mild}`}
          />

          {/* Whisker Line (whisker_low to whisker_high) */}
          <div
            className="absolute h-0.5 bg-slate-400 dark:bg-slate-500 rounded"
            style={{ left: `${pWhiskerLow}%`, width: `${pWhiskerHigh - pWhiskerLow}%` }}
          />

          {/* Whisker Low End-Cap */}
          <div
            onMouseEnter={() => setHoveredPoint({ label: 'Lower Whisker (Min Non-Outlier)', value: whisker_low, pct: pWhiskerLow })}
            onMouseLeave={() => setHoveredPoint(null)}
            className="absolute h-6 w-0.5 bg-slate-600 dark:bg-slate-300 cursor-pointer"
            style={{ left: `${pWhiskerLow}%`, transform: 'translateX(-50%)' }}
          />

          {/* Whisker High End-Cap */}
          <div
            onMouseEnter={() => setHoveredPoint({ label: 'Upper Whisker (Max Non-Outlier)', value: whisker_high, pct: pWhiskerHigh })}
            onMouseLeave={() => setHoveredPoint(null)}
            className="absolute h-6 w-0.5 bg-slate-600 dark:bg-slate-300 cursor-pointer"
            style={{ left: `${pWhiskerHigh}%`, transform: 'translateX(-50%)' }}
          />

          {/* IQR Box (Q1 to Q3) */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.4 }}
            onMouseEnter={() => setHoveredPoint({ label: `IQR Box (Q1=${q1}, Q3=${q3}, IQR=${(q3-q1).toFixed(2)})`, value: `Span: [${q1}, ${q3}]`, pct: (pQ1 + pQ3) / 2 })}
            onMouseLeave={() => setHoveredPoint(null)}
            className="absolute top-2 bottom-2 rounded-xl bg-gradient-to-r from-indigo-500/30 via-violet-500/30 to-indigo-500/30 dark:from-indigo-600/40 dark:to-violet-600/40 border-2 border-indigo-500 dark:border-indigo-400 shadow-sm cursor-pointer"
            style={{
              left: `${pQ1}%`,
              width: `${Math.max(2, pQ3 - pQ1)}%`,
            }}
          />

          {/* Median Line */}
          <div
            onMouseEnter={() => setHoveredPoint({ label: 'Median (Q2)', value: median, pct: pMedian })}
            onMouseLeave={() => setHoveredPoint(null)}
            className="absolute top-1 bottom-1 w-1 bg-amber-500 dark:bg-amber-400 rounded cursor-pointer z-10 shadow-xs"
            style={{ left: `${pMedian}%`, transform: 'translateX(-50%)' }}
          />

          {/* Outlier Dots */}
          {outliers.map((outVal, idx) => {
            const outPct = toPct(outVal);
            const isExtreme = extreme_outliers.includes(outVal);
            return (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                onMouseEnter={() => setHoveredPoint({ label: isExtreme ? 'Extreme Outlier' : 'Mild Outlier', value: outVal, pct: outPct })}
                onMouseLeave={() => setHoveredPoint(null)}
                className={`absolute w-3.5 h-3.5 rounded-full z-20 cursor-pointer shadow-md transform -translate-x-1/2 -translate-y-1/2 ${
                  isExtreme
                    ? 'bg-rose-600 ring-4 ring-rose-500/40'
                    : 'bg-rose-500 ring-2 ring-rose-500/30 hover:scale-125'
                }`}
                style={{ left: `${outPct}%`, top: '50%' }}
              />
            );
          })}
        </div>

        {/* X-Axis Value Labels */}
        <div className="relative w-full h-6 mt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-400 font-mono">
          <span className="absolute left-0 top-1 text-left">{effectiveMin.toFixed(1)}</span>
          <span
            className="absolute top-1 -translate-x-1/2 text-indigo-600 dark:text-indigo-400 font-semibold"
            style={{ left: `${pQ1}%` }}
          >
            Q₁ ({q1})
          </span>
          <span
            className="absolute top-1 -translate-x-1/2 text-amber-600 dark:text-amber-400 font-bold"
            style={{ left: `${pMedian}%` }}
          >
            Med ({median})
          </span>
          <span
            className="absolute top-1 -translate-x-1/2 text-indigo-600 dark:text-indigo-400 font-semibold"
            style={{ left: `${pQ3}%` }}
          >
            Q₃ ({q3})
          </span>
          <span className="absolute right-0 top-1 text-right">{effectiveMax.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

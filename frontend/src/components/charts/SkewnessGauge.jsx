import React from 'react';
import { motion } from 'framer-motion';

export function SkewnessGauge({
  momentSkewness = 0,
  category = "Approximately Symmetric",
  shapeType = "symmetric",
  relationshipText = "Mean ≈ Median",
  alignment,
  accentColor = "#10b981"
}) {
  const clampedSkew = Math.max(-2.5, Math.min(2.5, momentSkewness));
  const angle = (clampedSkew / 2.5) * 90;

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4">
      {/* SVG Speedometer Semi-circle */}
      <div className="relative w-64 h-36 flex items-center justify-center">
        <svg className="w-64 h-36" viewBox="0 0 200 110">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="35%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="65%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Inner Ticks */}
          <line x1="20" y1="100" x2="30" y2="100" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="100" y1="20" x2="100" y2="30" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="180" y1="100" x2="170" y2="100" stroke="#94a3b8" strokeWidth="2.5" />

          {/* Pivot Center Cap */}
          <circle cx="100" cy="100" r="9" fill="#1e293b" />
          <circle cx="100" cy="100" r="4" fill="#ffffff" />
        </svg>

        {/* Animated Needle */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: angle }}
          transition={{ type: 'spring', stiffness: 50, damping: 12 }}
          className="absolute bottom-2 origin-bottom flex flex-col items-center pointer-events-none"
          style={{ width: '4px', height: '68px' }}
        >
          <div className="w-2 h-16 bg-slate-900 dark:bg-white rounded-t-full shadow-xl" />
        </motion.div>
      </div>

      {/* Speedometer Labels */}
      <div className="flex justify-between w-64 text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
        <span className="text-pink-500">Left Tilt</span>
        <span className="text-emerald-500 font-extrabold">Symmetric</span>
        <span className="text-amber-500">Right Tilt</span>
      </div>

      {/* Alignment Bar if available */}
      {alignment && (
        <div className="w-full max-w-sm pt-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex justify-between">
            <span>Center Positions</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono">{relationshipText}</span>
          </div>
          <div className="relative h-10 w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-4 flex items-center border border-slate-200 dark:border-slate-700">
            <div className="w-full h-1 bg-slate-300 dark:bg-slate-600 rounded" />
            <div
              className="absolute top-1 transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${alignment.mean_pct}%` }}
              title={`Mean: ${alignment.mean_val}`}
            >
              <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-sm" />
              <span className="text-[9px] font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5 whitespace-nowrap">
                Mean ({alignment.mean_val})
              </span>
            </div>
            <div
              className="absolute bottom-1 transform -translate-x-1/2 flex flex-col items-center"
              style={{ left: `${alignment.median_pct}%` }}
              title={`Median: ${alignment.median_val}`}
            >
              <span className="text-[9px] font-bold font-mono text-amber-600 dark:text-amber-400 mb-0.5 whitespace-nowrap">
                Med ({alignment.median_val})
              </span>
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

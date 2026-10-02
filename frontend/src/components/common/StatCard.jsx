import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  formula,
  accent = 'indigo',
  delay = 0,
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 500;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - (1 - progress) * (1 - progress);
        const current = start + (end - start) * ease;
        
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setDisplayValue(end);
        }
      };

      requestAnimationFrame(updateCounter);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const colorMap = {
    indigo: {
      border: 'border-indigo-500/30 hover:border-indigo-500/60',
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400',
      numColor: 'text-indigo-600 dark:text-indigo-400',
    },
    cyan: {
      border: 'border-cyan-500/30 hover:border-cyan-500/60',
      iconBg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400',
      numColor: 'text-cyan-600 dark:text-cyan-400',
    },
    emerald: {
      border: 'border-emerald-500/30 hover:border-emerald-500/60',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400',
      numColor: 'text-emerald-600 dark:text-emerald-400',
    },
    amber: {
      border: 'border-amber-500/30 hover:border-amber-500/60',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400',
      numColor: 'text-amber-600 dark:text-amber-400',
    },
    pink: {
      border: 'border-pink-500/30 hover:border-pink-500/60',
      iconBg: 'bg-pink-50 text-pink-600 dark:bg-pink-950/80 dark:text-pink-400',
      numColor: 'text-pink-600 dark:text-pink-400',
    },
    violet: {
      border: 'border-violet-500/30 hover:border-violet-500/60',
      iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-950/80 dark:text-violet-400',
      numColor: 'text-violet-600 dark:text-violet-400',
    },
  };

  const scheme = colorMap[accent] || colorMap.indigo;

  const formattedVal = typeof displayValue === 'number'
    ? Number(displayValue).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: displayValue % 1 !== 0 ? 2 : 0,
      })
    : displayValue ?? '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 border clean-card transition-all duration-200 ${scheme.border} flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-start justify-between gap-2.5 mb-2.5 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex-1 min-w-0 break-words leading-tight">
            {title}
          </span>
          {Icon && (
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${scheme.iconBg} shrink-0 flex items-center justify-center shadow-xs`}>
              <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
          )}
        </div>

        <div className="flex items-baseline flex-wrap gap-2 mb-1.5 min-w-0">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono break-all leading-none">
            {formattedVal}
          </span>
          {badge && (
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>
      </div>

      {formula && (
        <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-md mb-1.5 w-fit">
          {formula}
        </div>
      )}

      {subtitle && (
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed break-words mt-1">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

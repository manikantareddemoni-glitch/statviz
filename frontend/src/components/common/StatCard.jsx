import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
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
      className={`relative overflow-hidden rounded-3xl p-6 border clean-card transition-all duration-200 ${scheme.border}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-2xl ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
          {formattedVal}
        </span>
        {badge && (
          <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

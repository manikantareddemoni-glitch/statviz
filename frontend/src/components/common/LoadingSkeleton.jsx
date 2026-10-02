import React from 'react';

export function LoadingSkeleton({ type = 'card' }) {
  if (type === 'stats-grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800/60" />
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800/60 p-6 flex flex-col justify-between animate-pulse">
        <div className="w-1/3 h-5 bg-slate-300 dark:bg-slate-700 rounded-lg" />
        <div className="flex items-end gap-3 h-48 justify-around px-4">
          {[40, 75, 90, 60, 85, 45, 70, 30].map((h, idx) => (
            <div
              key={idx}
              className="w-10 bg-slate-300 dark:bg-slate-700/80 rounded-t-lg"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="w-full h-3 bg-slate-300 dark:bg-slate-700 rounded" />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 animate-pulse space-y-3">
        <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-800 rounded" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-full bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
  );
}

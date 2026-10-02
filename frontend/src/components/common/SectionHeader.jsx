import React from 'react';
import { BookOpen, Sparkles, ChevronDown } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function SectionHeader({
  title,
  subtitle,
  learnKey,
  onOpenLearn,
  showColumnPicker = true,
  showSecondaryPicker = false,
  extraControls = null
}) {
  const { inspection, selectedCol, setSelectedCol, secondaryCol, setSecondaryCol } = useData();
  const numCols = inspection?.numeric_columns || [];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {learnKey && onOpenLearn && (
            <button
              onClick={() => onOpenLearn(learnKey)}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors shadow-xs"
              title="Open full textbook explanation"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Textbook Note</span>
            </button>
          )}
        </div>
        {subtitle && (
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {extraControls}

        {showColumnPicker && numCols.length > 0 && (
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {showSecondaryPicker ? "Variable X:" : "Select Column:"}
            </span>
            <select
              value={selectedCol || ''}
              onChange={(e) => setSelectedCol(e.target.value)}
              className="bg-transparent font-bold text-sm text-indigo-600 dark:text-indigo-400 focus:outline-none cursor-pointer pr-1"
            >
              {numCols.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {showSecondaryPicker && numCols.length > 0 && (
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Variable Y:
            </span>
            <select
              value={secondaryCol || ''}
              onChange={(e) => setSecondaryCol(e.target.value)}
              className="bg-transparent font-bold text-sm text-cyan-600 dark:text-cyan-400 focus:outline-none cursor-pointer pr-1"
            >
              {numCols.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, ArrowRight, BarChart2, Maximize2, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

export function StemLeafPlot({
  data,
  onLeafUnitChange,
  onSplitStemChange,
  splitStems = false,
  leafUnit = 1.0,
  onNavigate
}) {
  const [hoveredLeaf, setHoveredLeaf] = useState(null);

  if (!data || !data.rows || data.rows.length === 0) {
    return (
      <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-3">
        <div className="text-slate-400 text-sm">No numeric values available to build stem-and-leaf display.</div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('preview')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 transition-colors"
          >
            Go to Data Preview & Select Numeric Column
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Friendly Student Explainer Hero */}
      <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-cyan-500/5 dark:from-indigo-950/30 dark:to-cyan-950/20 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                How It Works
              </span>
              <span className="text-xs text-slate-400">EDA by John Tukey</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              A sideways histogram that keeps every real number intact
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Unlike a histogram that lumps counts into bars, a <strong>Stem-and-Leaf plot</strong> splits each observation into a <strong>Stem</strong> (leading digits) and a <strong>Leaf</strong> (final digit).
            </p>
          </div>

          {/* Quick Nav if user prefers traditional charts */}
          {onNavigate && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => onNavigate('histogram')}
                className="px-3 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>View Histogram</span>
              </button>
              <button
                onClick={() => onNavigate('variability')}
                className="px-3 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>View Box Plot</span>
              </button>
            </div>
          )}
        </div>

        {/* Visual Diagram: How to Read the Key */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Reading Key:
            </span>
            <div className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs shadow-xs">
              {data.key}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              (Leaf unit: <strong>{data.leaf_unit}</strong>)
            </span>
          </div>

          {/* Toggles and controls */}
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={splitStems}
                onChange={(e) => onSplitStemChange(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <span>Split Stems (0-4 / 5-9)</span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Leaf Unit:</span>
              <select
                value={leafUnit || 1}
                onChange={(e) => onLeafUnitChange(Number(e.target.value))}
                className="px-2 py-1 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value={0.1}>0.1</option>
                <option value={1}>1.0</option>
                <option value={10}>10.0</option>
                <option value={100}>100.0</option>
                <option value={1000}>1000.0</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Warning if data looks like an ID / sequential index */}
      {data.is_id_column && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Notice on Selected Column:</strong>
            <p className="mt-0.5 leading-relaxed text-amber-800 dark:text-amber-300">
              This column contains large ID numbers or uniform sequences. Stem-and-leaf plots are designed for measured variables (e.g. Runs, Scores, Ages, Heights). For ID columns, you can select another numeric column from the top-right column picker.
            </p>
          </div>
        </div>
      )}

      {/* Main Stem-and-Leaf Visual Display Box */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-4">
        {/* Interactive Hover Inspection Banner */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            {hoveredLeaf ? (
              <span className="font-medium text-slate-900 dark:text-white">
                Hovered Value: <strong className="font-mono text-indigo-600 dark:text-indigo-400 text-sm px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800">{hoveredLeaf.original_value}</strong> (Stem: {hoveredLeaf.stem}, Leaf: {hoveredLeaf.leaf})
              </span>
            ) : (
              <span className="text-slate-500 dark:text-slate-400">
                Hover over any leaf number to reveal its exact raw score!
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-slate-400">
            Total Points: {data.total_points} {data.displayed_points < data.total_points ? `(Showing ${data.displayed_points})` : ''}
          </span>
        </div>

        {/* Table Column Headers */}
        <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2 px-2 font-mono">
          <div className="w-16 text-right pr-4" title="Tukey Depth: cumulative count from nearest edge to median">
            Depth
          </div>
          <div className="w-20 text-center border-r border-slate-300 dark:border-slate-700 pr-2">
            Stem
          </div>
          <div className="pl-4 flex-1">
            Leaves (Individual Data Points)
          </div>
        </div>

        {/* Stem-and-Leaf Rows */}
        <div className="space-y-1.5 font-mono text-xs sm:text-sm max-h-[500px] overflow-y-auto pr-2">
          {data.rows.map((row, idx) => {
            const isMedianRow = row.depth?.includes('(');

            return (
              <div
                key={idx}
                className={`flex items-center rounded-xl px-2 py-1.5 transition-all ${
                  isMedianRow
                    ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 font-bold shadow-xs'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                }`}
              >
                {/* Depth Count */}
                <div
                  className={`w-16 text-right pr-4 font-semibold text-xs ${
                    isMedianRow ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-400'
                  }`}
                  title={isMedianRow ? "Median row (contains central value)" : "Cumulative count"}
                >
                  {row.depth}
                </div>

                {/* Stem Column */}
                <div className="w-20 text-center font-bold text-indigo-600 dark:text-indigo-400 border-r-2 border-slate-300 dark:border-slate-700 pr-2 font-mono">
                  {row.stem_label}
                </div>

                {/* Leaves Column */}
                <div className="pl-4 flex flex-wrap items-center gap-1.5 flex-1">
                  {row.leaves.length === 0 ? (
                    <span className="text-slate-300 dark:text-slate-700 text-xs italic font-normal">—</span>
                  ) : (
                    row.leaves.map((item) => (
                      <motion.span
                        key={item.id}
                        whileHover={{ scale: 1.3 }}
                        onMouseEnter={() => setHoveredLeaf(item)}
                        onMouseLeave={() => setHoveredLeaf(null)}
                        className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-md cursor-pointer font-bold text-xs transition-all ${
                          hoveredLeaf?.id === item.id
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/40 scale-125 z-10'
                            : isMedianRow
                            ? 'bg-amber-200/60 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 hover:bg-amber-500 hover:text-white'
                            : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white border border-slate-200/80 dark:border-slate-700'
                        }`}
                      >
                        {item.leaf}
                      </motion.span>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


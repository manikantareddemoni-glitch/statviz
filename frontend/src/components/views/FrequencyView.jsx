import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Sparkles, Table as TableIcon, Hash, BarChart3, Lightbulb } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { api } from '../../api/client';
import { SectionHeader } from '../common/SectionHeader';
import { StatCard } from '../common/StatCard';
import { StudentGuideCard } from '../common/StudentGuideCard';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export function FrequencyView({ onOpenLearn, onNavigate }) {
  const { activeDatasetId, selectedCol, studentMode } = useData();
  const [numClasses, setNumClasses] = useState(8);
  const [loading, setLoading] = useState(false);
  const [freqData, setFreqData] = useState(null);

  useEffect(() => {
    if (!activeDatasetId || !selectedCol) return;
    let isCancelled = false;

    async function fetchFrequency() {
      setLoading(true);
      try {
        const res = await api.getFrequency(activeDatasetId, selectedCol, numClasses);
        if (res.success && !isCancelled) {
          setFreqData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchFrequency();
    return () => {
      isCancelled = true;
    };
  }, [activeDatasetId, selectedCol, numClasses]);

  if (!activeDatasetId || !selectedCol) {
    return (
      <EmptyState
        title="No CSV Dataset Loaded"
        description="Upload your CSV dataset to generate frequency distribution tables and class intervals."
        actionText="Upload CSV Dataset"
        onAction={() => onNavigate('preview')}
      />
    );
  }

  const totals = freqData?.totals;
  const table = freqData?.table || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Frequency Distribution Table"
        subtitle="Group messy continuous numbers into neat class intervals to see count density and percentages."
        learnKey="frequency"
        onOpenLearn={onOpenLearn}
        showColumnPicker={true}
      />

      {/* Student Guide Helper Card */}
      {studentMode && (
        <StudentGuideCard
          topicKey="frequency"
          onNavigate={onNavigate}
          onOpenLearn={onOpenLearn}
        />
      )}

      {/* Bin Control Toolbar & Rule Recommendations */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 w-full max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              Adjust Number of Groups (k):
            </span>
            <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
              k = {numClasses} intervals
            </span>
          </div>

          <input
            type="range"
            min="3"
            max="25"
            value={numClasses}
            onChange={(e) => setNumClasses(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />

          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>3 Classes (Very broad)</span>
            <span>25 Classes (Very detailed)</span>
          </div>
        </div>

        {/* Bin Rule Suggestions */}
        {totals && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setNumClasses(totals.fd_recommended_bins)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/50 hover:text-cyan-600 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Freedman-Diaconis: <strong>k = {totals.fd_recommended_bins}</strong>
            </button>
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      {totals && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <StatCard
            title="Total Sample (N)"
            value={totals.total_frequency}
            subtitle="Observations count"
            icon={Hash}
            accent="indigo"
          />
          <StatCard
            title="Class Width (w)"
            value={totals.class_width}
            subtitle="Step size for each group"
            icon={Sliders}
            accent="cyan"
          />
          <StatCard
            title="Data Range (R)"
            value={totals.data_range}
            subtitle={`Span from ${totals.data_min} to ${totals.data_max}`}
            icon={BarChart3}
            accent="emerald"
          />
          <StatCard
            title="Class Count (k)"
            value={totals.num_classes}
            subtitle="Total bins computed"
            icon={TableIcon}
            accent="violet"
          />
        </div>
      )}

      {/* Live Frequency Table */}
      {loading ? (
        <LoadingSkeleton type="table" />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5 text-center w-12 font-mono">#</th>
                <th className="px-4 py-3.5">Class Interval [L, U)</th>
                <th className="px-4 py-3.5 text-right font-mono">Class Mark (Xᵢ)</th>
                <th className="px-4 py-3.5 text-right font-mono">Frequency (Count)</th>
                <th className="px-4 py-3.5 text-right font-mono">Relative Freq (fᵣ)</th>
                <th className="px-4 py-3.5 text-right font-mono">Percentage (%)</th>
                <th className="px-4 py-3.5 text-right font-mono text-indigo-600 dark:text-indigo-400">Cum. Freq (&lt;)</th>
                <th className="px-4 py-3.5 text-right font-mono text-pink-600 dark:text-pink-400">Cum. Freq (&gt;)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs sm:text-sm">
              {table.map((row) => (
                <tr
                  key={row.class_index}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-4 py-3 text-center text-slate-400">{row.class_index}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{row.interval_label}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{row.class_mark}</td>
                  <td className="px-4 py-3 text-right font-bold text-indigo-600 dark:text-indigo-400">{row.frequency}</td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{row.relative_frequency}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800 dark:text-slate-200">{row.percentage}%</td>
                  <td className="px-4 py-3 text-right font-bold text-indigo-600 dark:text-indigo-400">{row.cumulative_frequency_less}</td>
                  <td className="px-4 py-3 text-right font-bold text-pink-600 dark:text-pink-400">{row.cumulative_frequency_more}</td>
                </tr>
              ))}
            </tbody>
            {totals && (
              <tfoot className="bg-indigo-50/50 dark:bg-indigo-950/40 font-mono font-bold text-slate-900 dark:text-white border-t-2 border-indigo-500/20">
                <tr>
                  <td className="px-4 py-3 text-center">Σ</td>
                  <td className="px-4 py-3 font-sans">Total Distribution</td>
                  <td className="px-4 py-3 text-right">—</td>
                  <td className="px-4 py-3 text-right text-indigo-600 dark:text-indigo-400">{totals.total_frequency}</td>
                  <td className="px-4 py-3 text-right">1.0000</td>
                  <td className="px-4 py-3 text-right">100.0%</td>
                  <td className="px-4 py-3 text-right">—</td>
                  <td className="px-4 py-3 text-right">—</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}

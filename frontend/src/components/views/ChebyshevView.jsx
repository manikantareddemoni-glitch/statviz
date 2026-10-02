import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sliders, CheckCircle2, Info, ArrowUpRight, Lightbulb } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine
} from 'recharts';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../api/client';
import { SectionHeader } from '../common/SectionHeader';
import { StatCard } from '../common/StatCard';
import { StudentGuideCard } from '../common/StudentGuideCard';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export function ChebyshevView({ onOpenLearn, onNavigate }) {
  const { isDark } = useTheme();
  const { activeDatasetId, selectedCol, studentMode } = useData();
  const [k, setK] = useState(2.0);
  const [loading, setLoading] = useState(false);
  const [chebData, setChebData] = useState(null);

  useEffect(() => {
    if (!activeDatasetId || !selectedCol) return;
    let isCancelled = false;

    async function fetchChebyshev() {
      setLoading(true);
      try {
        const res = await api.getChebyshev(activeDatasetId, selectedCol, k);
        if (res.success && !isCancelled) {
          setChebData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchChebyshev();
    return () => {
      isCancelled = true;
    };
  }, [activeDatasetId, selectedCol, k]);

  if (!activeDatasetId || !selectedCol) {
    return (
      <EmptyState
        title="No CSV Dataset Loaded"
        description="Upload your CSV dataset to verify Chebyshev's 1 - 1/k² bound guarantees for non-normal data."
        actionText="Upload CSV Dataset"
        onAction={() => onNavigate('preview')}
      />
    );
  }

  const histData = chebData?.histogram_data || [];
  const benchmarks = chebData?.benchmarks || [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Chebyshev's Universal Inequality"
        subtitle="The universal mathematical guarantee: calculates the guaranteed minimum percentage of data within k standard deviations for ANY distribution."
        learnKey="chebyshev"
        onOpenLearn={onOpenLearn}
        showColumnPicker={true}
      />

      {/* Student Guide Helper Card */}
      {studentMode && (
        <StudentGuideCard
          topicKey="chebyshev"
          onNavigate={onNavigate}
          onOpenLearn={onOpenLearn}
        />
      )}

      {/* Plain English Dynamic Takeaway Card */}
      {chebData && (
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            <strong className="text-indigo-700 dark:text-indigo-300 font-bold block mb-0.5">
              💡 The Chebyshev Guarantee for k = {k.toFixed(2)}:
            </strong>
            Chebyshev proves that <strong>at least {chebData.theoretical_min_pct}%</strong> of all observations must sit in the range [{chebData.lower_bound}, {chebData.upper_bound}]. In this dataset, exactly <strong>{chebData.actual_pct}%</strong> ({chebData.inside_count} of {chebData.total_count} points) fall inside—strictly fulfilling the theorem!
          </div>
        </div>
      )}

      {/* k-Slider Controller */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 w-full max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              Standard Deviations Multiplier (k &gt; 1):
            </span>
            <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
              k = {k.toFixed(2)}
            </span>
          </div>

          <input
            type="range"
            min="1.1"
            max="4.0"
            step="0.05"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />

          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>k = 1.10 (7.4% min)</span>
            <span>k = 2.0 (75.0% min)</span>
            <span>k = 3.0 (88.9% min)</span>
            <span>k = 4.0 (93.8% min)</span>
          </div>
        </div>

        {/* Interval coordinates badge */}
        {chebData && (
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 text-xs font-mono space-y-1">
            <div className="text-slate-400 uppercase font-sans font-bold text-[10px]">
              Guaranteed Range [x̄ - ks, x̄ + ks]:
            </div>
            <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
              [{chebData.lower_bound} to {chebData.upper_bound}]
            </div>
            <div className="text-[11px] text-slate-500">
              Mean x̄ = {chebData.mean} • SD s = {chebData.std}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Stat Cards */}
      {chebData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Guaranteed Minimum Floor"
            value={`${chebData.theoretical_min_pct}%`}
            subtitle="Theoretical minimum bound (1 - 1/k²)"
            formula={`1 - 1/(${k.toFixed(2)})²`}
            icon={ShieldCheck}
            accent="indigo"
          />
          <StatCard
            title="Actual Dataset %"
            value={`${chebData.actual_pct}%`}
            subtitle={`${chebData.inside_count} of ${chebData.total_count} observations`}
            badge={chebData.actual_pct >= chebData.theoretical_min_pct ? "Satisfies Theorem ✓" : "Anomaly"}
            icon={CheckCircle2}
            accent="emerald"
          />
          <StatCard
            title="Inside Bounds (Count)"
            value={chebData.inside_count}
            subtitle={`Observations in [${chebData.lower_bound}, ${chebData.upper_bound}]`}
            icon={Sliders}
            accent="cyan"
          />
          <StatCard
            title="Outside in Tails (Count)"
            value={chebData.outside_count}
            subtitle="Extreme values beyond k-SD"
            icon={ArrowUpRight}
            accent="pink"
          />
        </div>
      )}

      {/* Highlighted Histogram for Chebyshev Interval */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Histogram with Chebyshev Range Highlighting
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Blue bars are guaranteed inside the [{chebData?.lower_bound}, {chebData?.upper_bound}] interval.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-indigo-600" />
              <span>Inside Bound ({chebData?.actual_pct}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-500" />
              <span>Outside Bound</span>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton type="chart" />
        ) : (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histData} margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1f2937' : '#e2e8f0'} vertical={false} />
                <XAxis
                  dataKey="bin_mid"
                  stroke={isDark ? '#64748b' : '#94a3b8'}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                  label={{ value: selectedCol, position: 'insideBottom', offset: -10, fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                />
                <YAxis
                  stroke={isDark ? '#64748b' : '#94a3b8'}
                  tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val, name, item) => [
                    `${val} observations (${item.payload.percentage}%)`,
                    item.payload.is_within_chebyshev ? "Inside Bound" : "Outside Bound"
                  ]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {histData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.is_within_chebyshev ? '#6366f1' : '#f43f5e'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Benchmark Reference Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Chebyshev Standard Benchmark Values (Exam Reference)
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-3 py-2.5">k Multiplier</th>
                <th className="px-3 py-2.5">Guaranteed Formula</th>
                <th className="px-3 py-2.5">Guaranteed Minimum %</th>
                <th className="px-3 py-2.5">Actual Dataset %</th>
                <th className="px-3 py-2.5">Interval [x̄ - ks, x̄ + ks]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {benchmarks.map((b) => (
                <tr
                  key={b.k}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                    Math.abs(b.k - k) < 0.05 ? 'bg-indigo-50/60 dark:bg-indigo-950/60 font-bold' : ''
                  }`}
                >
                  <td className="px-3 py-2 text-indigo-600 dark:text-indigo-400 font-bold">k = {b.k.toFixed(2)}</td>
                  <td className="px-3 py-2 text-slate-500 font-sans">{b.formula}</td>
                  <td className="px-3 py-2 font-bold">{b.guaranteed_min_pct}%</td>
                  <td className="px-3 py-2 text-emerald-600 dark:text-emerald-400 font-bold">{b.actual_pct}%</td>
                  <td className="px-3 py-2 text-slate-500">[{b.lower_bound}, {b.upper_bound}]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Compass, BarChart2, Layers, Sparkles, Lightbulb } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { api } from '../../api/client';
import { SectionHeader } from '../common/SectionHeader';
import { StatCard } from '../common/StatCard';
import { StudentGuideCard } from '../common/StudentGuideCard';
import { NumberLinePlot } from '../charts/NumberLinePlot';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export function CentralTendencyView({ onOpenLearn, onNavigate }) {
  const { activeDatasetId, selectedCol, studentMode } = useData();
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    if (!activeDatasetId || !selectedCol) return;
    let isCancelled = false;

    async function fetchStats() {
      setLoading(true);
      try {
        const res = await api.getDescriptive(activeDatasetId, selectedCol);
        if (res.success && !isCancelled) {
          setStatsData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => {
      isCancelled = true;
    };
  }, [activeDatasetId, selectedCol]);

  if (!activeDatasetId || !selectedCol) {
    return (
      <EmptyState
        title="No CSV Dataset Loaded"
        description="Upload your CSV dataset to compare Mean, Median, Mode, and discover when extreme values distort averages."
        actionText="Upload CSV Dataset"
        onAction={() => onNavigate('preview')}
      />
    );
  }

  const ct = statsData?.central_tendency;
  const numberLine = statsData?.number_line;

  let headlineText = "Symmetrical & Balanced";
  let explanationText = `The Mean (${ct?.mean}) and Median (${ct?.median}) are virtually equal. Both give an accurate picture of the typical student.`;

  if (ct && ct.mean > ct.median + 0.5) {
    headlineText = `Right-Skewed: Mean (${ct.mean}) > Median (${ct.median})`;
    explanationText = `A few high extreme scores in '${selectedCol}' pull the arithmetic mean upward. The Median is the preferred center here.`;
  } else if (ct && ct.mean < ct.median - 0.5) {
    headlineText = `Left-Skewed: Mean (${ct.mean}) < Median (${ct.median})`;
    explanationText = `A few low extreme scores in '${selectedCol}' pull the arithmetic mean downward. The Median represents the typical student more reliably.`;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Measures of Central Tendency"
        subtitle="Find the middle or typical score using Mean, Median, and Mode."
        learnKey="central_tendency"
        onOpenLearn={onOpenLearn}
        showColumnPicker={true}
      />

      {/* Guide Banner */}
      {studentMode && (
        <StudentGuideCard
          topicKey="central_tendency"
          onNavigate={onNavigate}
        />
      )}

      {loading ? (
        <LoadingSkeleton type="stats-grid" />
      ) : (
        <>
          {/* Top Hero Section: Headline Verdict & 1D Number Line Visual */}
          <div className="clean-card rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Central Summary Verdict
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {headlineText}
                </h2>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 max-w-md font-medium">
                {explanationText}
              </div>
            </div>

            <NumberLinePlot numberLineData={numberLine} />
          </div>

          {/* 3 Large, Spacious Primary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title="Arithmetic Mean (x̄)"
              value={ct?.mean}
              subtitle="Sum of all scores divided by total count"
              icon={Target}
              accent="indigo"
            />
            <StatCard
              title="Median (50th %)"
              value={ct?.median}
              subtitle="Middle score in ordered list (unaffected by extreme outliers)"
              icon={Compass}
              accent="amber"
            />
            <StatCard
              title="Most Common Score (Mode)"
              value={ct?.primary_mode !== null && ct?.primary_mode !== undefined ? ct.primary_mode : "None"}
              subtitle={ct?.mode_info?.description || "Most frequent observation"}
              badge={ct?.mode_info?.type}
              icon={BarChart2}
              accent="emerald"
            />
          </div>

          {/* Clean Student Table */}
          <div className="clean-card rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              🎓 When to use Mean vs Median on Exams
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-3.5">Measure</th>
                    <th className="px-5 py-3.5 font-mono">Value</th>
                    <th className="px-5 py-3.5">Calculation</th>
                    <th className="px-5 py-3.5">When to use</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-bold text-indigo-600 dark:text-indigo-400">Mean</td>
                    <td className="px-5 py-3.5 font-mono font-bold">{ct?.mean}</td>
                    <td className="px-5 py-3.5 text-slate-500">Adds everything and divides by N</td>
                    <td className="px-5 py-3.5 font-semibold text-emerald-700 dark:text-emerald-300">Best for symmetric data without outliers.</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5 font-bold text-amber-600 dark:text-amber-400">Median</td>
                    <td className="px-5 py-3.5 font-mono font-bold">{ct?.median}</td>
                    <td className="px-5 py-3.5 text-slate-500">The exact middle student in line</td>
                    <td className="px-5 py-3.5 font-semibold text-indigo-700 dark:text-indigo-300">Best when extreme outliers or skewness exist.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

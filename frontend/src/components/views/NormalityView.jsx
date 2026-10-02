import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle2, AlertTriangle, Activity, Award, Lightbulb } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { api } from '../../api/client';
import { SectionHeader } from '../common/SectionHeader';
import { StatCard } from '../common/StatCard';
import { StudentGuideCard } from '../common/StudentGuideCard';
import { QQPlot } from '../charts/QQPlot';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export function NormalityView({ onOpenLearn, onNavigate }) {
  const { activeDatasetId, selectedCol, studentMode } = useData();
  const [loading, setLoading] = useState(false);
  const [normData, setNormData] = useState(null);

  useEffect(() => {
    if (!activeDatasetId || !selectedCol) return;
    let isCancelled = false;

    async function fetchNormality() {
      setLoading(true);
      try {
        const res = await api.getNormality(activeDatasetId, selectedCol);
        if (res.success && !isCancelled) {
          setNormData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchNormality();
    return () => {
      isCancelled = true;
    };
  }, [activeDatasetId, selectedCol]);

  if (!activeDatasetId || !selectedCol) {
    return (
      <EmptyState
        title="No CSV Dataset Loaded"
        description="Upload your CSV dataset to test for Gaussian bell curves, Q-Q plots, and Empirical Rule percentages."
        actionText="Upload CSV Dataset"
        onAction={() => onNavigate('preview')}
      />
    );
  }

  const shapiro = normData?.shapiro_wilk;
  const empirical = normData?.empirical_rule || [];
  const qq = normData?.qq_plot;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Normal Distribution & Q-Q Testing"
        subtitle="Check if your data qualifies as a true Gaussian bell curve using the 68-95-99.7 rule and Shapiro-Wilk test."
        learnKey="normality"
        onOpenLearn={onOpenLearn}
        showColumnPicker={true}
      />

      {/* Student Guide Helper Card */}
      {studentMode && (
        <StudentGuideCard
          topicKey="normality"
          onNavigate={onNavigate}
          onOpenLearn={onOpenLearn}
        />
      )}

      {loading ? (
        <LoadingSkeleton type="stats-grid" />
      ) : (
        <>
          {/* Shapiro-Wilk Hypothesis Verdict Banner */}
          {shapiro && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                shapiro.is_normal
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl flex-shrink-0 ${
                    shapiro.is_normal
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {shapiro.is_normal ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <AlertTriangle className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Shapiro-Wilk Normality Test (Benchmark α = 0.05)
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        shapiro.is_normal
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200'
                      }`}
                    >
                      {shapiro.badge_status}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1">
                    {shapiro.verdict}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {shapiro.is_normal
                      ? "p ≥ 0.05: The data is consistent with a Gaussian bell curve. Standard parametric tests (like t-tests) are valid!"
                      : "p < 0.05: The data significantly deviates from a bell curve. Non-parametric methods (like Median/IQR) are safer."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex-shrink-0">
                <span>W = <strong>{shapiro.statistic}</strong></span>
                <span>p = <strong>{shapiro.p_value_formatted}</strong></span>
              </div>
            </motion.div>
          )}

          {/* Empirical Rule (68-95-99.7) Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  The Empirical Rule (68 - 95 - 99.7) vs Actual Dataset Coverage
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  If data is normal, approximately 68% of data should lie within 1 SD, 95% within 2 SDs, and 99.7% within 3 SDs.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Band</th>
                    <th className="px-4 py-3">Theoretical Bell %</th>
                    <th className="px-4 py-3">Actual Dataset %</th>
                    <th className="px-4 py-3">Observations Count</th>
                    <th className="px-4 py-3">Interval [μ - kσ, μ + kσ]</th>
                    <th className="px-4 py-3">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs sm:text-sm">
                  {empirical.map((row) => (
                    <tr key={row.k} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-sans font-bold text-indigo-600 dark:text-indigo-400">
                        {row.label}
                      </td>
                      <td className="px-4 py-3 font-bold">{row.theoretical_pct}%</td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {row.actual_pct}%
                      </td>
                      <td className="px-4 py-3 text-slate-500">{row.count} / {normData?.sample_size}</td>
                      <td className="px-4 py-3 text-slate-500">[{row.lower_bound}, {row.upper_bound}]</td>
                      <td className="px-4 py-3 font-semibold">
                        <span className={Math.abs(row.difference_pct) <= 5 ? 'text-emerald-500' : 'text-amber-500'}>
                          {row.difference_pct > 0 ? `+${row.difference_pct}%` : `${row.difference_pct}%`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quantile-Quantile (Q-Q) Plot */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Normal Quantile-Quantile (Q-Q) Visual Check
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  How to read this: If the blue dots hug the pink dashed 45° line, the data is normally distributed!
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span>Sample Points</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-pink-500" />
                  <span>Normal Line</span>
                </div>
              </div>
            </div>

            <QQPlot qqData={qq} />
          </div>
        </>
      )}
    </div>
  );
}

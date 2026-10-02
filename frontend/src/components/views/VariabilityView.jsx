import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Activity, Divide, Sparkles, AlertCircle, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { api } from '../../api/client';
import { SectionHeader } from '../common/SectionHeader';
import { StatCard } from '../common/StatCard';
import { StudentGuideCard } from '../common/StudentGuideCard';
import { InteractiveBoxPlot } from '../charts/InteractiveBoxPlot';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export function VariabilityView({ onOpenLearn, onNavigate }) {
  const { activeDatasetId, selectedCol, studentMode } = useData();
  const [isSampleVariance, setIsSampleVariance] = useState(true);
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
        description="Upload your CSV dataset to calculate Standard Deviation, IQR, and detect outliers with Box Plots."
        actionText="Upload CSV Dataset"
        onAction={() => onNavigate('preview')}
      />
    );
  }

  const disp = statsData?.dispersion;
  const boxplot = statsData?.boxplot;

  const currentVariance = isSampleVariance ? disp?.sample_variance : disp?.population_variance;
  const currentStd = isSampleVariance ? disp?.sample_std : disp?.population_std;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Measures of Spread & Box Plot"
        subtitle="Understand how spread out the observations are and detect extreme Tukey outliers."
        learnKey="variability"
        onOpenLearn={onOpenLearn}
        showColumnPicker={true}
        extraControls={
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold shadow-xs">
            <button
              onClick={() => setIsSampleVariance(true)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                isSampleVariance
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Sample (n - 1)
            </button>
            <button
              onClick={() => setIsSampleVariance(false)}
              className={`px-3 py-1.5 rounded-xl transition-colors ${
                !isSampleVariance
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              Population (N)
            </button>
          </div>
        }
      />

      {/* Guide Banner */}
      {studentMode && (
        <StudentGuideCard
          topicKey="variability"
          onNavigate={onNavigate}
        />
      )}

      {loading ? (
        <LoadingSkeleton type="stats-grid" />
      ) : (
        <>
          {/* Top Hero Section: Box Plot Visual & Outlier Verdict */}
          <div className="clean-card rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Five-Number Summary Box Plot
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Visualizing Score Range & Quartiles
                </h2>
              </div>

              <div>
                {boxplot?.outlier_count > 0 ? (
                  <span className="px-4 py-2 rounded-2xl text-xs font-extrabold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{boxplot.outlier_count} Outlier Point(s) Detected</span>
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-2xl text-xs font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>No Extreme Outliers in Data</span>
                  </span>
                )}
              </div>
            </div>

            <InteractiveBoxPlot data={boxplot} title={selectedCol} />
          </div>

          {/* 3 Large Spacious Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title={isSampleVariance ? "Standard Deviation (s)" : "Population SD (σ)"}
              value={currentStd}
              subtitle="Average distance each point sits from the mean"
              icon={Activity}
              accent="indigo"
            />
            <StatCard
              title="Middle 50% Spread (IQR)"
              value={disp?.iqr}
              subtitle={`Span between Q₁ (${disp?.q1}) and Q₃ (${disp?.q3})`}
              icon={Maximize2}
              accent="emerald"
            />
            <StatCard
              title="Total Data Range"
              value={disp?.range}
              subtitle={`Difference between Min (${disp?.min}) and Max (${disp?.max})`}
              icon={Sparkles}
              accent="amber"
            />
          </div>

          {/* Bessel's Correction Card */}
          <div className="p-6 rounded-3xl clean-card text-sm space-y-2">
            <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>🎓 Why do we divide by (n - 1) for Sample Variance?</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              When working with a sample instead of the whole population, sample data points sit slightly closer to the sample mean (x̄) than to the true hidden population mean (μ). Dividing by <strong>(n - 1)</strong> (Bessel's Correction) mathematically corrects this underestimate and provides an <strong>unbiased estimate</strong> for variance.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

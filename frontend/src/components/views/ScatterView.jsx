import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScatterChart as ScatterIcon, TrendingUp, Sparkles, Eye, Award, Activity } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { api } from '../../api/client';
import { SectionHeader } from '../common/SectionHeader';
import { StatCard } from '../common/StatCard';
import { StudentGuideCard } from '../common/StudentGuideCard';
import { ScatterPlotChart } from '../charts/ScatterPlotChart';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export function ScatterView({ onOpenLearn, onNavigate }) {
  const { activeDatasetId, selectedCol, secondaryCol, studentMode } = useData();
  const [showRegressionLine, setShowRegressionLine] = useState(true);
  const [loading, setLoading] = useState(false);
  const [scatterData, setScatterData] = useState(null);

  useEffect(() => {
    if (!activeDatasetId || !selectedCol || !secondaryCol) return;
    let isCancelled = false;

    async function fetchScatter() {
      setLoading(true);
      try {
        const res = await api.getScatter(activeDatasetId, selectedCol, secondaryCol);
        if (res.success && !isCancelled) {
          setScatterData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchScatter();
    return () => {
      isCancelled = true;
    };
  }, [activeDatasetId, selectedCol, secondaryCol]);

  if (!activeDatasetId || !selectedCol || !secondaryCol) {
    return (
      <EmptyState
        title="No Dataset with 2 Numeric Columns"
        description="Upload a CSV dataset with at least two numeric variables to calculate Pearson's correlation and regression equations."
        actionText="Upload CSV Dataset"
        onAction={() => onNavigate('preview')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Bivariate Scatter & Linear Regression"
        subtitle={`Examine whether '${selectedCol}' (X) predicts or correlates with '${secondaryCol}' (Y).`}
        learnKey="scatter"
        onOpenLearn={onOpenLearn}
        showColumnPicker={true}
        showSecondaryPicker={true}
        extraControls={
          <label className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs">
            <input
              type="checkbox"
              checked={showRegressionLine}
              onChange={(e) => setShowRegressionLine(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
            />
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            <span>Show Prediction Line (ŷ)</span>
          </label>
        }
      />

      {/* Guide Banner */}
      {studentMode && (
        <StudentGuideCard
          topicKey="scatter"
          onNavigate={onNavigate}
        />
      )}

      {loading ? (
        <LoadingSkeleton type="stats-grid" />
      ) : (
        <>
          {/* Hero Scatter Canvas Card */}
          <div className="clean-card rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Scatter & Prediction Model
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {secondaryCol} vs {selectedCol}
                </h2>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 font-mono text-sm font-bold text-indigo-700 dark:text-indigo-300">
                {scatterData?.equation}
              </div>
            </div>

            <ScatterPlotChart
              scatterData={scatterData}
              showRegressionLine={showRegressionLine}
            />
          </div>

          {/* 3 Large Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title="Pearson Correlation (r)"
              value={scatterData?.pearson_r}
              subtitle={scatterData?.strength || "Linear correlation (-1 to +1)"}
              badge={scatterData?.strength}
              icon={ScatterIcon}
              accent="indigo"
            />
            <StatCard
              title="Explained Variance (r²)"
              value={`${scatterData?.r_squared_pct}%`}
              subtitle={`Percentage of ${secondaryCol} differences explained by ${selectedCol}`}
              icon={TrendingUp}
              accent="cyan"
            />
            <StatCard
              title="Rate of Change (Slope m)"
              value={scatterData?.slope}
              subtitle={`Increase in ${secondaryCol} for every 1 unit increase in ${selectedCol}`}
              icon={Activity}
              accent="emerald"
            />
          </div>

          {/* Homework Application Helper */}
          <div className="p-6 rounded-3xl clean-card text-sm space-y-2">
            <h4 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>🎓 How to use this equation in assignments</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              To make a prediction: plug in any value for <strong>{selectedCol}</strong> into the formula <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-indigo-600 dark:text-indigo-400">{scatterData?.equation}</code> to calculate the predicted <strong>{secondaryCol}</strong>.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

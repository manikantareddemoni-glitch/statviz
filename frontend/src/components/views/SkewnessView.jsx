import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Sparkles, Compass, Target, Layers, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { api } from '../../api/client';
import { SectionHeader } from '../common/SectionHeader';
import { StatCard } from '../common/StatCard';
import { StudentGuideCard } from '../common/StudentGuideCard';
import { SkewnessGauge } from '../charts/SkewnessGauge';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export function SkewnessView({ onOpenLearn, onNavigate }) {
  const { activeDatasetId, selectedCol, studentMode } = useData();
  const [loading, setLoading] = useState(false);
  const [skewData, setSkewData] = useState(null);

  useEffect(() => {
    if (!activeDatasetId || !selectedCol) return;
    let isCancelled = false;

    async function fetchSkewness() {
      setLoading(true);
      try {
        const res = await api.getSkewness(activeDatasetId, selectedCol);
        if (res.success && !isCancelled) {
          setSkewData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchSkewness();
    return () => {
      isCancelled = true;
    };
  }, [activeDatasetId, selectedCol]);

  if (!activeDatasetId || !selectedCol) {
    return (
      <EmptyState
        title="No CSV Dataset Loaded"
        description="Upload your CSV dataset to measure Pearson's Skewness coefficient and see animated speedometer gauges."
        actionText="Upload CSV Dataset"
        onAction={() => onNavigate('preview')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Skewness & Distribution Tilt"
        subtitle="Discover whether your distribution is symmetrical or stretched toward higher or lower scores."
        learnKey="skewness"
        onOpenLearn={onOpenLearn}
        showColumnPicker={true}
      />

      {/* Guide Banner */}
      {studentMode && (
        <StudentGuideCard
          topicKey="skewness"
          onNavigate={onNavigate}
        />
      )}

      {loading ? (
        <LoadingSkeleton type="stats-grid" />
      ) : (
        <>
          {/* HERO SECTION: Big Speedometer Gauge + Clear Bold Verdict */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center clean-card rounded-3xl p-6 sm:p-8">
            {/* Speedometer Gauge Visual */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 pb-6 lg:pb-0 lg:pr-6">
              <SkewnessGauge
                momentSkewness={skewData?.moment_skewness}
                category={skewData?.category}
                shapeType={skewData?.shape_type}
                relationshipText={skewData?.relationship_text}
                alignment={skewData?.alignment}
                accentColor={skewData?.accent_color}
              />
            </div>

            {/* Verdict & Plain English Takeaway */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Distribution Verdict
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: skewData?.accent_color || '#10b981' }}
                >
                  {skewData?.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {skewData?.shape_type === 'right_skewed'
                  ? `'${selectedCol}' has a Long Tail on the RIGHT`
                  : skewData?.shape_type === 'left_skewed'
                  ? `'${selectedCol}' has a Long Tail on the LEFT`
                  : `'${selectedCol}' is Symmetrical & Balanced`}
              </h2>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {skewData?.explanation}
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span>
                  <strong>Alignment Rule: </strong>
                  {skewData?.relationship_text}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Large, Spacious Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard
              title="Moment Skewness (g₁)"
              value={skewData?.moment_skewness}
              subtitle="0 = Symmetric, >0.5 = Right-skewed, <-0.5 = Left-skewed"
              badge={skewData?.shape_type}
              icon={Gauge}
              accent="indigo"
            />
            <StatCard
              title="Pearson Skewness"
              value={skewData?.pearson_median_skewness}
              subtitle="Measures relative distance between Mean and Median"
              icon={Compass}
              accent="amber"
            />
            <StatCard
              title="Kurtosis (Peakedness)"
              value={skewData?.excess_kurtosis}
              subtitle={skewData?.kurtosis_type || "Normal bell curve = 0"}
              icon={Layers}
              accent="emerald"
            />
          </div>
        </>
      )}
    </div>
  );
}

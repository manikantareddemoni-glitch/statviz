import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Eye, Activity, Bell, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { api } from '../../api/client';
import { SectionHeader } from '../common/SectionHeader';
import { StudentGuideCard } from '../common/StudentGuideCard';
import { InteractiveHistogram } from '../charts/InteractiveHistogram';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export function HistogramView({ onOpenLearn, onNavigate }) {
  const { activeDatasetId, selectedCol, studentMode } = useData();
  const [numBins, setNumBins] = useState(10);
  const [showNormalCurve, setShowNormalCurve] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [normData, setNormData] = useState(null);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    if (!activeDatasetId || !selectedCol) return;
    let isCancelled = false;

    async function fetchHistogramData() {
      setLoading(true);
      try {
        const [nRes, sRes] = await Promise.all([
          api.getNormality(activeDatasetId, selectedCol, numBins),
          api.getDescriptive(activeDatasetId, selectedCol)
        ]);

        if (nRes.success && !isCancelled) {
          setNormData(nRes.data);
        }
        if (sRes.success && !isCancelled) {
          setStatsData(sRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchHistogramData();
    return () => {
      isCancelled = true;
    };
  }, [activeDatasetId, selectedCol, numBins]);

  if (!activeDatasetId || !selectedCol) {
    return (
      <EmptyState
        title="No CSV Dataset Loaded"
        description="Upload your CSV dataset to plot interactive histograms and normal curve overlays."
        actionText="Upload CSV Dataset"
        onAction={() => onNavigate('preview')}
      />
    );
  }

  const mean = statsData?.central_tendency?.mean;
  const median = statsData?.central_tendency?.median;
  const mode = statsData?.central_tendency?.primary_mode;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Interactive Histogram & Bell Curve"
        subtitle="Explore the distribution shape, adjust bin widths live, and overlay a fitted normal curve."
        learnKey="histogram"
        onOpenLearn={onOpenLearn}
        showColumnPicker={true}
      />

      {/* Guide Banner */}
      {studentMode && (
        <StudentGuideCard
          topicKey="histogram"
          onNavigate={onNavigate}
        />
      )}

      {/* Main Histogram Canvas Card */}
      <div className="clean-card rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Histogram for '{selectedCol}'
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Taller bars indicate score ranges where more observations cluster.
            </p>
          </div>

          {/* Quick interactive toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={showNormalCurve}
                onChange={(e) => setShowNormalCurve(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <Bell className="w-3.5 h-3.5 text-cyan-500" />
              <span>Normal Curve</span>
            </label>

            <label className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={showMarkers}
                onChange={(e) => setShowMarkers(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <Eye className="w-3.5 h-3.5 text-amber-500" />
              <span>Mean & Median Lines</span>
            </label>
          </div>
        </div>

        {/* Bin Slider Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 min-w-[170px]">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span>Resolution ({numBins} Bars):</span>
          </div>
          <input
            type="range"
            min="4"
            max="25"
            value={numBins}
            onChange={(e) => setNumBins(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        {loading ? (
          <LoadingSkeleton type="chart" />
        ) : (
          <InteractiveHistogram
            data={normData?.histogram_bars}
            mean={mean}
            median={median}
            mode={mode}
            showNormalCurve={showNormalCurve}
            showMarkers={showMarkers}
          />
        )}
      </div>
    </div>
  );
}

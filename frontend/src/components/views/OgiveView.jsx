import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitCommit, Sliders, Info, Target, Layers, Lightbulb } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { api } from '../../api/client';
import { SectionHeader } from '../common/SectionHeader';
import { StudentGuideCard } from '../common/StudentGuideCard';
import { OgiveChart } from '../charts/OgiveChart';
import { StatCard } from '../common/StatCard';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export function OgiveView({ onOpenLearn, onNavigate }) {
  const { activeDatasetId, selectedCol, studentMode } = useData();
  const [numClasses, setNumClasses] = useState(8);
  const [showMoreThan, setShowMoreThan] = useState(true);
  const [loading, setLoading] = useState(false);
  const [ogiveData, setOgiveData] = useState(null);

  useEffect(() => {
    if (!activeDatasetId || !selectedCol) return;
    let isCancelled = false;

    async function fetchOgive() {
      setLoading(true);
      try {
        const res = await api.getOgive(activeDatasetId, selectedCol, numClasses);
        if (res.success && !isCancelled) {
          setOgiveData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchOgive();
    return () => {
      isCancelled = true;
    };
  }, [activeDatasetId, selectedCol, numClasses]);

  if (!activeDatasetId || !selectedCol) {
    return (
      <EmptyState
        title="No CSV Dataset Loaded"
        description="Upload your CSV dataset to read percentiles and quartiles graphically with Ogive curves."
        actionText="Upload CSV Dataset"
        onAction={() => onNavigate('preview')}
      />
    );
  }

  const landmarks = ogiveData?.graphical_landmarks;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Cumulative Frequency Curves (Ogives)"
        subtitle="Read off percentiles and quartiles directly from the graph without complex formulas."
        learnKey="ogive"
        onOpenLearn={onOpenLearn}
        showColumnPicker={true}
      />

      {/* Student Guide Helper Card */}
      {studentMode && (
        <StudentGuideCard
          topicKey="ogive"
          onNavigate={onNavigate}
          onOpenLearn={onOpenLearn}
        />
      )}

      {/* Graphical Landmarks Stats Grid */}
      {landmarks && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Graphical First Quartile (Q₁)"
            value={landmarks.q1?.x_value}
            subtitle={`Score where 25% of students scored below (${landmarks.q1?.frequency} count)`}
            icon={Target}
            accent="indigo"
          />
          <StatCard
            title="Graphical Median (50th %)"
            value={landmarks.median?.x_value}
            subtitle={`Score where Less-Than & More-Than curves cross (${landmarks.median?.frequency} count)`}
            icon={GitCommit}
            accent="emerald"
          />
          <StatCard
            title="Graphical Third Quartile (Q₃)"
            value={landmarks.q3?.x_value}
            subtitle={`Score where 75% of students scored below (${landmarks.q3?.frequency} count)`}
            icon={Target}
            accent="pink"
          />
        </div>
      )}

      {/* Ogive Main Chart Container */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Interactive Cumulative Ogive Graph for '{selectedCol}'
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Drag the green slider below to find any target percentile score!
            </p>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-200">
              <input
                type="checkbox"
                checked={showMoreThan}
                onChange={(e) => setShowMoreThan(e.target.checked)}
                className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4 cursor-pointer"
              />
              <span>Show More-Than Ogive (Pink)</span>
            </label>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton type="chart" />
        ) : (
          <OgiveChart ogiveData={ogiveData} showMoreThan={showMoreThan} />
        )}
      </div>
    </div>
  );
}

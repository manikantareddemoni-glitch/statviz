import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListOrdered, Layers, Hash, Lightbulb } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { api } from '../../api/client';
import { SectionHeader } from '../common/SectionHeader';
import { StudentGuideCard } from '../common/StudentGuideCard';
import { StemLeafPlot } from '../charts/StemLeafPlot';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export function StemLeafView({ onOpenLearn, onNavigate }) {
  const { activeDatasetId, selectedCol, studentMode } = useData();
  const [leafUnit, setLeafUnit] = useState(1.0);
  const [splitStems, setSplitStems] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stemData, setStemData] = useState(null);

  useEffect(() => {
    if (!activeDatasetId || !selectedCol) return;
    let isCancelled = false;

    async function fetchStemLeaf() {
      setLoading(true);
      try {
        const res = await api.getStemAndLeaf(activeDatasetId, selectedCol, leafUnit, splitStems);
        if (res.success && !isCancelled) {
          setStemData(res.data);
          if (res.data.leaf_unit) {
            setLeafUnit(res.data.leaf_unit);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchStemLeaf();
    return () => {
      isCancelled = true;
    };
  }, [activeDatasetId, selectedCol, splitStems]);

  const handleUnitChange = async (unit) => {
    setLeafUnit(unit);
    setLoading(true);
    try {
      const res = await api.getStemAndLeaf(activeDatasetId, selectedCol, unit, splitStems);
      if (res.success) {
        setStemData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!activeDatasetId || !selectedCol) {
    return (
      <EmptyState
        title="No CSV Dataset Loaded"
        description="Upload your CSV dataset to inspect every individual value using a Stem-and-Leaf display."
        actionText="Upload CSV Dataset"
        onAction={() => onNavigate('preview')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Stem-and-Leaf Exploratory Display"
        subtitle="See every student's raw score while simultaneously visualizing the distribution shape."
        learnKey="stem_leaf"
        onOpenLearn={onOpenLearn}
        showColumnPicker={true}
      />

      {/* Student Guide Helper Card */}
      {studentMode && (
        <StudentGuideCard
          topicKey="stem_leaf"
          onNavigate={onNavigate}
          onOpenLearn={onOpenLearn}
        />
      )}

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : (
        <StemLeafPlot
          data={stemData}
          onLeafUnitChange={handleUnitChange}
          onSplitStemChange={setSplitStems}
          splitStems={splitStems}
          leafUnit={leafUnit}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

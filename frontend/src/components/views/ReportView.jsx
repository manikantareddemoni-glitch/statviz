import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  Table as TableIcon,
  TrendingUp,
  Activity,
  Award,
  Layers,
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';

import { useData } from '../../context/DataContext';
import { api } from '../../api/client';
import { SectionHeader } from '../common/SectionHeader';
import { StudentGuideCard } from '../common/StudentGuideCard';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { EmptyState } from '../common/EmptyState';

export function ReportView({ onOpenLearn, onNavigate }) {
  const { activeDatasetId, datasetName, selectedCol, secondaryCol, studentMode } = useData();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    if (!activeDatasetId || !selectedCol) return;
    let isCancelled = false;

    async function fetchReport() {
      setLoading(true);
      try {
        const res = await api.getReport(activeDatasetId, selectedCol, secondaryCol);
        if (res.success && !isCancelled) {
          setReportData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchReport();
    return () => {
      isCancelled = true;
    };
  }, [activeDatasetId, selectedCol, secondaryCol]);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExportingPDF(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width mm
      const pageHeight = 295; // A4 height mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`StatViz_${datasetName.replace(/\s+/g, '_')}_${selectedCol}_Report.pdf`);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('PDF Generation failed:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadJSON = () => {
    if (!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StatViz_${selectedCol}_Stats.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    if (!reportData?.metrics_table) return;
    const headers = ['Category', 'Metric', 'Symbol', 'Value'];
    const rows = reportData.metrics_table.map(m => [
      `"${m.category}"`,
      `"${m.metric}"`,
      `"${m.symbol}"`,
      `"${m.value}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StatViz_${selectedCol}_Summary_Table.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!activeDatasetId || !selectedCol) {
    return (
      <EmptyState
        title="No CSV Dataset Loaded"
        description="Upload your CSV dataset to generate an all-in-one coursework summary report with PDF export."
        actionText="Upload CSV Dataset"
        onAction={() => onNavigate('preview')}
      />
    );
  }

  const narratives = reportData?.narratives;
  const metrics = reportData?.metrics_table || [];
  const bivariate = reportData?.bivariate;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Executive Summary & Academic Report"
        subtitle="Export your findings into a coursework submission-ready statistical report with plain-English insights."
        learnKey="report"
        onOpenLearn={onOpenLearn}
        showColumnPicker={true}
        showSecondaryPicker={true}
        extraControls={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExportingPDF || loading}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-500/25 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isExportingPDF ? 'Rendering PDF...' : 'Export as PDF'}</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              disabled={loading}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
              <span>CSV Table</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              disabled={loading}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-cyan-500" />
              <span>JSON</span>
            </button>
          </div>
        }
      />

      {/* Student Guide Helper Card */}
      {studentMode && (
        <StudentGuideCard
          topicKey="report"
          onNavigate={onNavigate}
          onOpenLearn={onOpenLearn}
        />
      )}

      {loading ? (
        <LoadingSkeleton type="table" />
      ) : (
        /* Printable Report Document Container */
        <div
          ref={reportRef}
          className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-8 print:p-0 print:border-none print:shadow-none"
        >
          {/* Academic Report Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Statistical Analysis Report • LG 1 Module I
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                StatViz Statistical Synthesis
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Dataset: <strong className="text-slate-800 dark:text-slate-200">{datasetName}</strong> • Target Variable: <strong className="text-indigo-600 dark:text-indigo-400">{selectedCol}</strong> • N = {reportData?.sample_size}
              </p>
            </div>

            <div className="text-right text-xs text-slate-400 font-mono">
              <div>Date: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
              <div>Platform: StatViz v1.0 Academic</div>
            </div>
          </div>

          {/* Key Plain-English Academic Insights */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Executive Academic Insights & Interpretations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Insight 1: Central Tendency */}
              <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/60 space-y-2">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                  <Activity className="w-4 h-4" />
                  <span>Central Tendency & Shape</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {narratives?.central_tendency}
                </p>
              </div>

              {/* Insight 2: Variability & Outliers */}
              <div className="p-5 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-200/70 dark:border-cyan-800/60 space-y-2">
                <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300 font-bold text-xs">
                  <Layers className="w-4 h-4" />
                  <span>Dispersion & Outliers</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {narratives?.variability_and_outliers}
                </p>
              </div>

              {/* Insight 3: Normality & Chebyshev */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  <Award className="w-4 h-4" />
                  <span>Distribution Bounds</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {narratives?.normality_and_distribution}
                </p>
              </div>
            </div>
          </div>

          {/* Bivariate Relationship Card if available */}
          {bivariate && (
            <div className="p-5 rounded-2xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-200/70 dark:border-violet-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 font-bold text-xs">
                  <TrendingUp className="w-4 h-4" />
                  <span>Bivariate Association: {selectedCol} vs {bivariate.secondary_column}</span>
                </div>
                <span className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400">
                  {bivariate.equation}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {bivariate.narrative}
              </p>
            </div>
          )}

          {/* Combined Comprehensive Statistical Metrics Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TableIcon className="w-4 h-4 text-indigo-500" />
              Complete Descriptive & Inferential Parameters Table
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Statistical Parameter</th>
                    <th className="px-4 py-3 font-mono text-center w-24">Notation</th>
                    <th className="px-4 py-3 font-mono text-right">Computed Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  {metrics.map((m, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-sans font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                        {m.category}
                      </td>
                      <td className="px-4 py-2.5 font-sans font-medium text-slate-800 dark:text-slate-200">
                        {m.metric}
                      </td>
                      <td className="px-4 py-2.5 text-center text-indigo-600 dark:text-indigo-400 font-bold">
                        {m.symbol}
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-slate-900 dark:text-white">
                        {String(m.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

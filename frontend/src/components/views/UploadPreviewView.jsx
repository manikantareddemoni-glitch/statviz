import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  FileSpreadsheet,
  Trash2,
  Sparkles,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Database,
  CheckCircle2,
  HelpCircle,
  Hash,
  Layers,
  ArrowRight,
  Lightbulb,
  ClipboardPaste
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { SectionHeader } from '../common/SectionHeader';
import { StatCard } from '../common/StatCard';
import { StudentGuideCard } from '../common/StudentGuideCard';
import { LoadingSkeleton } from '../common/LoadingSkeleton';

export function UploadPreviewView({ onOpenLearn, onNavigate }) {
  const {
    activeDatasetId,
    datasetName,
    datasetDescription,
    inspection,
    previewData,
    currentPage,
    loading,
    cleaningLoading,
    studentMode,
    uploadCSV,
    uploadCSVText,
    changePage,
    applyCleaning,
    setSelectedCol
  } = useData();

  const [pasteMode, setPasteMode] = useState(false);
  const [pasteName, setPasteName] = useState('');
  const [pasteData, setPasteData] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        uploadCSV(acceptedFiles[0]);
      }
    }
  });

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    if (!pasteData.trim()) return;
    const ok = await uploadCSVText(pasteData, pasteName.trim() || 'Pasted Dataset');
    if (ok) {
      setPasteData('');
      setPasteName('');
      setPasteMode(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="stats-grid" />
        <LoadingSkeleton type="table" />
      </div>
    );
  }

  // If no dataset is currently active, show upload first view
  if (!activeDatasetId || !inspection) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Dataset Ingestion & Data Dictionary"
          subtitle="Upload your CSV dataset to inspect variable types, treat missing values, and begin analysis."
          learnKey="upload"
          onOpenLearn={onOpenLearn}
          showColumnPicker={false}
        />

        {studentMode && (
          <StudentGuideCard
            topicKey="upload"
            onNavigate={onNavigate}
            onOpenLearn={onOpenLearn}
          />
        )}

        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-8 sm:p-12 text-center space-y-6">
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-3xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center transition-all ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-indigo-400 dark:hover:border-indigo-500'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {isDragActive ? "Drop your CSV file here..." : "Drag & drop your CSV file here, or click to browse"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Upload any spreadsheet exported as CSV (.csv).
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setPasteMode(!pasteMode)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
            >
              <ClipboardPaste className="w-4 h-4" />
              <span>{pasteMode ? "Hide Paste Area" : "Or Paste CSV Rows Directly"}</span>
            </button>
          </div>

          {pasteMode && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handlePasteSubmit}
              className="max-w-xl mx-auto p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left space-y-3"
            >
              <input
                type="text"
                placeholder="Dataset Name (e.g. Class Exam Marks)"
                value={pasteName}
                onChange={(e) => setPasteName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <textarea
                rows={5}
                placeholder={`Student_ID,Score,Study_Hours\n1,85,4.5\n2,92,6.0\n3,78,3.2`}
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
                className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={!pasteData.trim()}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                Parse and Load CSV Data
              </button>
            </motion.form>
          )}
        </div>
      </div>
    );
  }

  const cols = inspection?.columns || [];

  const handleSelectColumnForAnalysis = (colName) => {
    setSelectedCol(colName);
    onNavigate('central_tendency');
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Dataset Ingestion & Data Dictionary"
        subtitle="Inspect variable data types (Continuous, Discrete, Categorical) and treat missing numbers."
        learnKey="upload"
        onOpenLearn={onOpenLearn}
        showColumnPicker={false}
      />

      {/* Student Guide Helper Card */}
      {studentMode && (
        <StudentGuideCard
          topicKey="upload"
          onNavigate={onNavigate}
          onOpenLearn={onOpenLearn}
        />
      )}

      {/* Upload Zone & Info Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dropzone Card */}
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-3xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center transition-all ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 scale-102'
              : 'border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:border-indigo-400 dark:hover:border-indigo-500'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {isDragActive ? "Drop your CSV file here..." : "Upload New CSV Dataset"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            Drag & drop your CSV file here, or click to browse from your computer.
          </p>
        </div>

        {/* Dataset Summary Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          <StatCard
            title="Total Records (N)"
            value={inspection?.total_rows || 0}
            subtitle="Rows / observations count"
            icon={FileSpreadsheet}
            accent="indigo"
          />
          <StatCard
            title="Variables"
            value={inspection?.total_columns || 0}
            subtitle="Columns in dataset"
            icon={Layers}
            accent="cyan"
          />
          <StatCard
            title="Quantitative"
            value={inspection?.numeric_column_count || 0}
            subtitle="Measurable numbers"
            icon={Hash}
            accent="emerald"
          />
          <StatCard
            title="Categorical"
            value={inspection?.categorical_column_count || 0}
            subtitle="Qualitative labels / text"
            icon={Database}
            accent="violet"
          />
        </div>
      </div>

      {/* Missing Values Treatment Panel */}
      {inspection?.has_missing_values && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Missing Values Detected in Dataset!
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Choose how to treat missing blanks before calculating statistics:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyCleaning('mean')}
              disabled={cleaningLoading}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Blanks with Column Average (Mean)</span>
            </button>
            <button
              onClick={() => applyCleaning('drop')}
              disabled={cleaningLoading}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-amber-300 dark:border-amber-800 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Drop Incomplete Rows</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Data Dictionary Columns Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Data Dictionary & Quick Column Picker
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any numeric column card below to analyze it instantly:
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {cols.length} Variables Found
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cols.map((col) => (
            <div
              key={col.name}
              onClick={() => col.is_numeric && handleSelectColumnForAnalysis(col.name)}
              className={`p-4 rounded-2xl border shadow-xs space-y-2 transition-all ${
                col.is_numeric
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 cursor-pointer group'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {col.name}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    col.is_numeric
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {col.type}
                </span>
              </div>

              {col.is_numeric && col.min !== undefined && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono grid grid-cols-2 gap-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Min: {col.min}</span>
                  <span>Max: {col.max}</span>
                  <span>Mean: {col.mean}</span>
                  <span>SD: {col.std}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Unique: {col.unique_count}</span>
                {col.is_numeric && (
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Analyze Col <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paginated Preview Table */}
      {previewData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Raw Records Spreadsheet View
              </h3>
              <p className="text-xs text-slate-400">
                Showing rows {(currentPage - 1) * 15 + 1} to {Math.min(currentPage * 15, previewData.total_records)} of {previewData.total_records}
              </p>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold px-2 font-mono">
                Page {previewData.page} / {previewData.total_pages}
              </span>
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage >= previewData.total_pages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-slate-400 w-12 font-mono">#</th>
                  {cols.map((col) => (
                    <th key={col.name} className="px-4 py-3 truncate max-w-xs">
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {previewData.data.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-slate-400 text-[11px]">
                      {(currentPage - 1) * 15 + idx + 1}
                    </td>
                    {cols.map((col) => {
                      const val = row[col.name];
                      return (
                        <td key={col.name} className="px-4 py-2.5 text-slate-800 dark:text-slate-200">
                          {val === null || val === undefined ? (
                            <span className="text-amber-500 font-sans italic text-[11px]">NaN</span>
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

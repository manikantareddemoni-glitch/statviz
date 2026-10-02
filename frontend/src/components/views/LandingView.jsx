import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Sparkles,
  BarChart2,
  Upload,
  ArrowRight,
  Database,
  GraduationCap,
  TrendingUp,
  Activity,
  Layers,
  Award,
  HelpCircle,
  Compass,
  CheckCircle2,
  FileSpreadsheet,
  UploadCloud,
  ClipboardPaste,
  Table,
  Target,
  FileText
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export function LandingView({ onNavigate, onUploadClick, onOpenLearn }) {
  const {
    activeDatasetId,
    datasetName,
    inspection,
    uploadCSV,
    uploadCSVText
  } = useData();

  const [showPasteBox, setShowPasteBox] = useState(false);
  const [pastedName, setPastedName] = useState('');
  const [pastedText, setPastedText] = useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const ok = await uploadCSV(acceptedFiles[0]);
        if (ok) onNavigate('preview');
      }
    }
  });

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    const ok = await uploadCSVText(pastedText, pastedName.trim() || 'Pasted Dataset');
    if (ok) {
      setPastedText('');
      setPastedName('');
      setShowPasteBox(false);
      onNavigate('preview');
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Friendly Student Hero Section */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-cyan-950/20 backdrop-blur-xl shadow-lg">
        {/* Glow Spheres */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-5">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span>LG 1 Module I: Statistics Made Simple & Visual</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Learn Statistics Visually.{' '}
            <span className="gradient-text">Zero Confusion.</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Welcome to StatViz! Upload your own CSV dataset to instantly generate <strong>Frequency Tables</strong>, <strong>Histograms</strong>, <strong>Ogives</strong>, <strong>Box Plots</strong>, <strong>Skewness Gauges</strong>, and <strong>Normality Curves</strong> with step-by-step student guides.
          </p>

          {/* Active Dataset Alert if one is loaded */}
          {activeDatasetId ? (
            <div className="mt-6 p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-emerald-300 dark:border-emerald-800/80 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Dataset Active & Ready
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {datasetName} ({inspection?.total_rows || 0} rows, {inspection?.numeric_column_count || 0} numeric columns)
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('preview')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>Go to Data Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Drag-and-Drop & CSV Upload Hub */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Upload Your CSV File
            </h2>
          </div>
          <button
            onClick={() => setShowPasteBox(!showPasteBox)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>{showPasteBox ? 'Hide Paste Area' : 'Or Paste Raw CSV Data'}</span>
          </button>
        </div>

        {/* Drag & Drop Card */}
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-3xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center transition-all ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/50 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/20'
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1">
            {isDragActive ? "Drop your CSV file here now" : "Drag & Drop your CSV file here, or click to browse"}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
            Works with any CSV exported from Microsoft Excel, Google Sheets, Kaggle, or lab assignments.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all">
            <Upload className="w-4 h-4" />
            <span>Browse CSV File from Computer</span>
          </div>
        </div>

        {/* Expandable Paste CSV Drawer */}
        {showPasteBox && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handlePasteSubmit}
            className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardPaste className="w-4 h-4 text-indigo-500" />
                <span>Paste CSV Records Directly</span>
              </h4>
              <span className="text-[11px] text-slate-400">First line should be column headers</span>
            </div>

            <input
              type="text"
              placeholder="Dataset Name (e.g. My Coursework Data)"
              value={pastedName}
              onChange={(e) => setPastedName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />

            <textarea
              rows={6}
              placeholder={`Age,Score,Hours\n20,85,4.5\n22,92,6.0\n19,78,3.2\n21,88,5.1`}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full font-mono text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPasteBox(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!pastedText.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-sm"
              >
                Parse & Load Pasted Data
              </button>
            </div>
          </motion.form>
        )}
      </div>

      {/* 4-Stage Student Learning Pathway */}
      <div className="p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Module I Syllabus Roadmap
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            4-Stage Statistics Learning Pathway
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Follow these 4 progressive steps to analyze and present any dataset:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('preview')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 shadow-xs cursor-pointer hover:border-emerald-400 transition-all space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Get & Clean Data
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Understand variable types (continuous, discrete, categorical) and treat missing numbers with imputation or deletion.
            </p>
          </div>

          <div
            onClick={() => onNavigate('histogram')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 shadow-xs cursor-pointer hover:border-indigo-400 transition-all space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              See The Shape
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Use Frequency Tables, Histograms, Ogives, and Stem-and-Leaf plots to see distribution patterns.
            </p>
          </div>

          <div
            onClick={() => onNavigate('central_tendency')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 shadow-xs cursor-pointer hover:border-amber-400 transition-all space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Centers & Outliers
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Calculate Mean, Median, Mode, Variance, Standard Deviation, IQR, and detect Tukey outliers.
            </p>
          </div>

          <div
            onClick={() => onNavigate('report')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800/60 shadow-xs cursor-pointer hover:border-violet-400 transition-all space-y-2"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 font-bold flex items-center justify-center text-xs">
              4
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Bell Curves & Reports
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Test Normality, Chebyshev bounds, Bivariate correlation, and export your coursework PDF summary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


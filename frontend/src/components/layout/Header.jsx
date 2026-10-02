import React from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Database,
  Upload,
  ChevronDown,
  Menu,
  Sparkles,
  BarChart2,
  GraduationCap,
  Trash2,
  Plus
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

export function Header({ onToggleSidebar, onUploadClick }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const {
    datasets,
    activeDatasetId,
    datasetName,
    selectDataset,
    deleteDataset,
    selectedCol,
    studentMode,
    toggleStudentMode
  } = useData();

  return (
    <header className="sticky top-0 z-30 w-full h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left side: Hamburger on mobile + Dataset Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Dataset Quick Switcher */}
        <div className="relative group">
          <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
            activeDatasetId
              ? 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500'
              : 'border-indigo-300 dark:border-indigo-700/60 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:border-indigo-500'
          }`}>
            <Database className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400">
                {activeDatasetId ? 'Current Dataset' : 'No Dataset Loaded'}
              </span>
              <span className="text-xs sm:text-sm font-semibold max-w-[130px] sm:max-w-[200px] truncate">
                {datasetName || 'Click to Upload CSV'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
          </div>

          {/* Dropdown Menu */}
          <div className="absolute left-0 mt-1.5 w-80 rounded-2xl glass-dropdown shadow-2xl p-2 hidden group-hover:block group-focus-within:block z-50 animate-in fade-in slide-in-from-top-2 duration-150 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            <div className="px-2 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>My Uploaded Datasets</span>
              <span className="text-[10px] font-medium text-slate-400">{datasets.length} loaded</span>
            </div>

            {datasets.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">No CSV datasets uploaded yet.</p>
                <button
                  onClick={onUploadClick}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Your First CSV</span>
                </button>
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-1">
                {datasets.map((d) => (
                  <div
                    key={d.id}
                    className={`w-full px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors group/item ${
                      activeDatasetId === d.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => selectDataset(d.id)}
                      className="flex-1 text-left truncate pr-2"
                    >
                      <div className="font-medium truncate">{d.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {d.total_rows} rows • {d.numeric_column_count} numeric cols
                      </div>
                    </button>
                    <div className="flex items-center gap-1.5">
                      {activeDatasetId === d.id && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDataset(d.id);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 opacity-0 group-hover/item:opacity-100 transition-opacity"
                        title="Delete dataset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

            <button
              onClick={onUploadClick}
              className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Upload New CSV File...</span>
            </button>
          </div>
        </div>

        {/* Active Column pill */}
        {selectedCol && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Analyzing: <strong className="font-bold">{selectedCol}</strong></span>
          </div>
        )}
      </div>

      {/* Right side: Student Mode Toggle, Upload button & Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Student Helper Toggle */}
        <button
          onClick={toggleStudentMode}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            studentMode
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
          title="Toggle student explanation cards and exam hints"
        >
          <GraduationCap className="w-4 h-4" />
          <span className="hidden sm:inline">{studentMode ? "Student Mode: ON" : "Student Mode: OFF"}</span>
        </button>

        <button
          onClick={onUploadClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-xs"
        >
          <Upload className="w-3.5 h-3.5 text-indigo-500" />
          <span>Upload CSV</span>
        </button>

        {/* Dark/Light Theme Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
          aria-label="Toggle Dark/Light theme"
          title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </motion.button>
      </div>
    </header>
  );
}

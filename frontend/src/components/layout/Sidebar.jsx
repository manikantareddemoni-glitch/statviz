import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Table,
  BarChart,
  Activity,
  GitCommit,
  ListOrdered,
  Target,
  Maximize2,
  ShieldAlert,
  Bell,
  Gauge,
  ScatterChart,
  FileText,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const STAGES = [
  {
    id: 'stage_1',
    number: '1',
    title: 'Get & Understand Data',
    color: 'emerald',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300',
    items: [
      { id: 'preview', label: '1. Data Preview & Cleaning', icon: Table, hint: 'Variable types & missing data' }
    ]
  },
  {
    id: 'stage_2',
    number: '2',
    title: 'Visual Distribution Shape',
    color: 'indigo',
    badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300',
    items: [
      { id: 'frequency', label: '2. Frequency Table', icon: BarChart, hint: 'Group raw data into classes' },
      { id: 'histogram', label: '3. Histogram & Normal Curve', icon: Activity, hint: 'Bar shapes & bell curve overlay' },
      { id: 'ogive', label: '4. Ogive Curves', icon: GitCommit, hint: 'Read percentiles graphically' }
    ]
  },
  {
    id: 'stage_3',
    number: '3',
    title: 'Core Summary Numbers',
    color: 'amber',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
    items: [
      { id: 'central_tendency', label: '5. Central Tendency', icon: Target, hint: 'Mean, Median, Mode & Centers' },
      { id: 'variability', label: '6. Spread & Box Plot', icon: Maximize2, hint: 'Variance, SD, IQR & Outliers' },
      { id: 'skewness', label: '7. Skewness Meter', icon: Gauge, hint: 'Which direction does it tilt?' }
    ]
  },
  {
    id: 'stage_4',
    number: '4',
    title: 'Advanced & Reports',
    color: 'violet',
    badgeClass: 'bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300',
    items: [
      { id: 'normality', label: '8. Normal Bell Curve & Q-Q', icon: Bell, hint: '68-95-99.7 & Shapiro test' },
      { id: 'chebyshev', label: "9. Chebyshev's Theorem", icon: ShieldAlert, hint: 'Guaranteed 1 - 1/k² bound' },
      { id: 'scatter', label: '10. Two-Variable Scatter', icon: ScatterChart, hint: 'Correlation & Prediction line' },
      { id: 'report', label: '11. Executive Summary Report', icon: FileText, hint: 'Full table & PDF export' }
    ]
  }
];

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, collapsed, setCollapsed }) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-72'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo & Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                    Stat<span className="text-indigo-600 dark:text-indigo-400">Viz</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300">
                    LG 1
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Student Statistics Hub</span>
              </motion.div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items Grouped into Stages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Overview Tab Button */}
          <button
            onClick={() => {
              setActiveTab('landing');
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'landing'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Home & Student Questions</span>}
          </button>

          {/* Stages List */}
          {STAGES.map((stage) => (
            <div key={stage.id} className="space-y-1">
              {!collapsed && (
                <div className="px-2 pt-1 pb-1 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-400">
                    Stage {stage.number}: {stage.title}
                  </span>
                </div>
              )}

              {stage.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`relative w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    {/* Active bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-600 dark:bg-indigo-400"
                      />
                    )}

                    <Icon
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400 group-hover:text-indigo-500'
                      }`}
                    />

                    {!collapsed && (
                      <div className="flex flex-col text-left overflow-hidden">
                        <span className="truncate leading-tight font-semibold text-slate-900 dark:text-white">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-400 truncate mt-0.5">
                          {item.hint}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Academic Support Note */}
        {!collapsed && (
          <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 border border-indigo-500/15 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Student Cheat Sheet</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Click "Learn Concept" on any screen for formulas & textbook notes.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Database, UploadCloud } from 'lucide-react';

export function EmptyState({
  title = "No CSV Dataset Loaded",
  description = "Upload a CSV file to inspect variables and visualize interactive statistics.",
  actionText = "Upload CSV File",
  onAction,
  icon: Icon = UploadCloud
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md my-8"
    >
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-200"
        >
          <UploadCloud className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </motion.div>
  );
}

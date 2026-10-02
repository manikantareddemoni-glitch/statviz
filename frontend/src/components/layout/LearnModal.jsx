import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, CheckCircle2, Sigma, GraduationCap } from 'lucide-react';
import { LEARN_TOPICS } from '../../utils/learnTopics';

export function LearnModal({ isOpen, onClose, topicKey }) {
  if (!isOpen || !topicKey) return null;

  const topic = LEARN_TOPICS[topicKey] || {
    title: "Statistical Concept Overview",
    module: "LG 1: Module I",
    summary: "Essential statistical theory and mathematical rules for this analysis module.",
    keyPoints: ["Statistical estimation and validation principles."],
    formula: "\\text{Standard Statistical Rule}"
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-10"
        >
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {topic.module}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {topic.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Core Concept
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                {topic.summary}
              </p>
            </div>

            {topic.formula && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Sigma className="w-3.5 h-3.5 text-indigo-500" />
                  Key Mathematical Formula
                </h4>
                <div className="px-4 py-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/60 font-mono text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 font-semibold tracking-wide overflow-x-auto">
                  {topic.formula}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Key Exam & Analytical Takeaways
              </h4>
              <ul className="space-y-2.5">
                {topic.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
            >
              Got it, continue analysis
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

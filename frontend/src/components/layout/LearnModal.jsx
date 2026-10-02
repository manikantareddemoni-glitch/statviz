import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, CheckCircle2, Sigma, GraduationCap, Sparkles, Award } from 'lucide-react';
import { LEARN_TOPICS } from '../../utils/learnTopics';

export function LearnModal({ isOpen, onClose, topicKey }) {
  if (!isOpen || !topicKey) return null;

  const topic = LEARN_TOPICS[topicKey] || {
    title: "Statistical Concept Overview",
    module: "LG 1: Module I",
    plainEnglish: "Essential statistical theory and mathematical rules for this analysis module.",
    keyPoints: ["Statistical estimation and validation principles."],
    formula: "Standard Statistical Principle"
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
          className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-10"
        >
          {/* Header Banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {topic.stage || topic.module || "Statistical Guide"}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {topic.title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
            {/* Core Explanation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                🎓 What is this and why does it matter?
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                {topic.plainEnglish || topic.summary}
              </p>
            </div>

            {/* Student-Friendly Formula Box */}
            {topic.formula && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/70 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                  <Sigma className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Student Formula</span>
                </div>

                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/60 font-sans text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 font-bold leading-relaxed">
                  {topic.formula}
                </div>

                {/* Symbol / Variable Breakdown */}
                {topic.formulaBreakdown && topic.formulaBreakdown.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      What Each Piece Means:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {topic.formulaBreakdown.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0 bg-indigo-100/80 dark:bg-indigo-900/60 px-1.5 py-0.5 rounded text-[11px]">
                            {item.symbol}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400 leading-snug">
                            {item.meaning}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Numerical Example */}
                {topic.studentExample && (
                  <div className="p-3 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-800 dark:text-amber-300 font-bold mb-0.5">Quick Example in Action:</strong>
                      <span className="leading-relaxed">{topic.studentExample}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Exam Tip Alert */}
            {topic.examTip && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-semibold">{topic.examTip}</span>
              </div>
            )}

            {/* Key Takeaways Checklist */}
            {topic.keyPoints && topic.keyPoints.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Key Coursework Takeaways
                </h4>
                <ul className="space-y-2">
                  {topic.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-500/20"
            >
              Got it, continue analysis
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

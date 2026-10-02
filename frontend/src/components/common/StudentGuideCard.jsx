import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Award, ArrowRight } from 'lucide-react';
import { LEARN_TOPICS } from '../../utils/learnTopics';

export function StudentGuideCard({ topicKey, onNavigate }) {
  if (!topicKey || !LEARN_TOPICS[topicKey]) return null;
  const topic = LEARN_TOPICS[topicKey];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/60 dark:bg-indigo-950/40 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
    >
      <div className="flex items-start gap-4 max-w-3xl">
        <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 flex-shrink-0 mt-0.5">
          <Lightbulb className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/80 px-2.5 py-0.5 rounded-full">
              {topic.stage}
            </span>
          </div>
          <p className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
            {topic.plainEnglish}
          </p>
          {topic.examTip && (
            <div className="text-xs text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1.5 pt-1">
              <Award className="w-4 h-4 flex-shrink-0 text-amber-500" />
              <span>{topic.examTip}</span>
            </div>
          )}
        </div>
      </div>

      {topic.nextTab && onNavigate && (
        <button
          onClick={() => onNavigate(topic.nextTab)}
          className="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <span>{topic.nextLabel || "Next Topic"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

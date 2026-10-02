import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let borderClass = 'border-indigo-500/30 text-indigo-900 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-950/80';
          let iconColor = 'text-indigo-500';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            borderClass = 'border-emerald-500/30 text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/80';
            iconColor = 'text-emerald-500';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            borderClass = 'border-rose-500/30 text-rose-900 dark:text-rose-200 bg-rose-50 dark:bg-rose-950/80';
            iconColor = 'text-rose-500';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            borderClass = 'border-amber-500/30 text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/80';
            iconColor = 'text-amber-500';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-lg backdrop-blur-md ${borderClass}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
                <p className="text-xs sm:text-sm font-medium leading-snug">{toast.message}</p>
              </div>
              <button
                onClick={() => onRemove(toast.id)}
                className="ml-3 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5 opacity-70" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

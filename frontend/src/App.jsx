import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { X, UploadCloud } from 'lucide-react';

import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';

import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LearnModal } from './components/layout/LearnModal';
import { ToastContainer } from './components/common/Toast';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';

// Code-split all views for maximum performance
const LandingView = lazy(() => import('./components/views/LandingView').then(m => ({ default: m.LandingView })));
const UploadPreviewView = lazy(() => import('./components/views/UploadPreviewView').then(m => ({ default: m.UploadPreviewView })));
const FrequencyView = lazy(() => import('./components/views/FrequencyView').then(m => ({ default: m.FrequencyView })));
const HistogramView = lazy(() => import('./components/views/HistogramView').then(m => ({ default: m.HistogramView })));
const OgiveView = lazy(() => import('./components/views/OgiveView').then(m => ({ default: m.OgiveView })));
const CentralTendencyView = lazy(() => import('./components/views/CentralTendencyView').then(m => ({ default: m.CentralTendencyView })));
const VariabilityView = lazy(() => import('./components/views/VariabilityView').then(m => ({ default: m.VariabilityView })));
const ChebyshevView = lazy(() => import('./components/views/ChebyshevView').then(m => ({ default: m.ChebyshevView })));
const NormalityView = lazy(() => import('./components/views/NormalityView').then(m => ({ default: m.NormalityView })));
const SkewnessView = lazy(() => import('./components/views/SkewnessView').then(m => ({ default: m.SkewnessView })));
const ScatterView = lazy(() => import('./components/views/ScatterView').then(m => ({ default: m.ScatterView })));
const ReportView = lazy(() => import('./components/views/ReportView').then(m => ({ default: m.ReportView })));

function AppContent() {
  const [activeTab, setActiveTab] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Learn concept modal state
  const [learnTopic, setLearnTopic] = useState(null);

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const { toasts, removeToast, uploadCSV } = useData();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        uploadCSV(acceptedFiles[0]);
        setUploadModalOpen(false);
        setActiveTab('preview');
      }
    }
  });

  const openLearn = (key) => {
    setLearnTopic(key);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingView
            onNavigate={setActiveTab}
            onUploadClick={() => setUploadModalOpen(true)}
            onOpenLearn={openLearn}
          />
        );
      case 'preview':
        return <UploadPreviewView onOpenLearn={openLearn} onNavigate={setActiveTab} />;
      case 'frequency':
        return <FrequencyView onOpenLearn={openLearn} onNavigate={setActiveTab} />;
      case 'histogram':
        return <HistogramView onOpenLearn={openLearn} onNavigate={setActiveTab} />;
      case 'ogive':
        return <OgiveView onOpenLearn={openLearn} onNavigate={setActiveTab} />;
      case 'central_tendency':
        return <CentralTendencyView onOpenLearn={openLearn} onNavigate={setActiveTab} />;
      case 'variability':
        return <VariabilityView onOpenLearn={openLearn} onNavigate={setActiveTab} />;
      case 'chebyshev':
        return <ChebyshevView onOpenLearn={openLearn} onNavigate={setActiveTab} />;
      case 'normality':
        return <NormalityView onOpenLearn={openLearn} onNavigate={setActiveTab} />;
      case 'skewness':
        return <SkewnessView onOpenLearn={openLearn} onNavigate={setActiveTab} />;
      case 'scatter':
        return <ScatterView onOpenLearn={openLearn} onNavigate={setActiveTab} />;
      case 'report':
        return <ReportView onOpenLearn={openLearn} onNavigate={setActiveTab} />;
      default:
        return <LandingView onNavigate={setActiveTab} onUploadClick={() => setUploadModalOpen(true)} onOpenLearn={openLearn} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0b0f19] dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Learn Concept Educational Modal */}
      <LearnModal
        isOpen={Boolean(learnTopic)}
        onClose={() => setLearnTopic(null)}
        topicKey={learnTopic}
      />

      {/* Global Quick CSV Upload Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUploadModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 z-10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Upload CSV Dataset
                </h3>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center transition-all ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 scale-102'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-400'
                }`}
              >
                <input {...getInputProps()} />
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isDragActive ? "Drop CSV file here" : "Click to select or drag & drop CSV"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports comma-separated files with headers
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onUploadClick={() => setUploadModalOpen(true)}
        />

        {/* Page Content View with Transitions */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <Suspense fallback={<LoadingSkeleton type="chart" />}>
                {renderActiveView()}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ThemeProvider>
  );
}

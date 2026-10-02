import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [datasets, setDatasets] = useState([]);
  const [activeDatasetId, setActiveDatasetId] = useState(null);
  const [datasetName, setDatasetName] = useState('');
  const [datasetDescription, setDatasetDescription] = useState('');
  const [inspection, setInspection] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cleaningLoading, setCleaningLoading] = useState(false);
  const [selectedCol, setSelectedCol] = useState(null);
  const [secondaryCol, setSecondaryCol] = useState(null);
  const [studentMode, setStudentMode] = useState(true);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleStudentMode = () => {
    setStudentMode(prev => !prev);
    addToast(studentMode ? "Student Tips Hidden" : "🎓 Student Helper Mode Activated", "info");
  };

  // Fetch list of uploaded datasets on mount
  const refreshDatasets = useCallback(async () => {
    try {
      const res = await api.getDatasets();
      if (res.success) {
        setDatasets(res.datasets || []);
      }
    } catch (err) {
      console.warn("Could not fetch datasets list:", err);
    }
  }, []);

  useEffect(() => {
    refreshDatasets();
  }, [refreshDatasets]);

  const selectDataset = async (datasetId) => {
    if (!datasetId) return;
    setLoading(true);
    try {
      const res = await api.getDataset(datasetId);
      if (res.success) {
        setActiveDatasetId(res.dataset_id);
        setDatasetName(res.name);
        setDatasetDescription(`Loaded dataset with ${res.inspection.total_rows} rows and ${res.inspection.total_columns} columns.`);
        setInspection(res.inspection);
        setPreviewData(res.preview);
        setCurrentPage(1);

        const numCols = res.inspection.numeric_columns;
        if (numCols.length > 0) {
          setSelectedCol(res.recommended_x || numCols[0]);
          setSecondaryCol(res.recommended_y || (numCols.length > 1 ? numCols[1] : numCols[0]));
        } else {
          setSelectedCol(null);
          setSecondaryCol(null);
        }

        addToast(`Switched active dataset to "${res.name}"`, "success");
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to switch dataset.", "error");
    } finally {
      setLoading(false);
    }
  };

  const uploadCSV = async (file) => {
    setLoading(true);
    try {
      const res = await api.uploadCSV(file);
      if (res.success) {
        setActiveDatasetId(res.dataset_id);
        setDatasetName(res.name);
        setDatasetDescription(`Uploaded CSV with ${res.inspection.total_rows} rows and ${res.inspection.total_columns} columns.`);
        setInspection(res.inspection);
        setPreviewData(res.preview);
        setCurrentPage(1);

        const numCols = res.inspection.numeric_columns;
        if (numCols.length > 0) {
          setSelectedCol(res.recommended_x || numCols[0]);
          setSecondaryCol(res.recommended_y || (numCols.length > 1 ? numCols[1] : numCols[0]));
        } else {
          setSelectedCol(null);
          setSecondaryCol(null);
        }

        await refreshDatasets();
        addToast(`Uploaded "${file.name}" successfully!`, "success");
        return true;
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to upload CSV file.", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadCSVText = async (csvText, name = "Pasted Dataset") => {
    setLoading(true);
    try {
      const res = await api.uploadCSVText(csvText, name);
      if (res.success) {
        setActiveDatasetId(res.dataset_id);
        setDatasetName(res.name);
        setDatasetDescription(`Pasted CSV with ${res.inspection.total_rows} rows and ${res.inspection.total_columns} columns.`);
        setInspection(res.inspection);
        setPreviewData(res.preview);
        setCurrentPage(1);

        const numCols = res.inspection.numeric_columns;
        if (numCols.length > 0) {
          setSelectedCol(res.recommended_x || numCols[0]);
          setSecondaryCol(res.recommended_y || (numCols.length > 1 ? numCols[1] : numCols[0]));
        } else {
          setSelectedCol(null);
          setSecondaryCol(null);
        }

        await refreshDatasets();
        addToast(`Loaded pasted dataset "${name}" successfully!`, "success");
        return true;
      }
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to parse pasted CSV.", "error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteDataset = async (datasetId) => {
    try {
      const res = await api.deleteDataset(datasetId);
      if (res.success) {
        addToast("Dataset deleted.", "info");
        await refreshDatasets();
        if (activeDatasetId === datasetId) {
          setActiveDatasetId(null);
          setDatasetName('');
          setDatasetDescription('');
          setInspection(null);
          setPreviewData(null);
          setSelectedCol(null);
          setSecondaryCol(null);
        }
      }
    } catch (err) {
      addToast(err.message || "Failed to delete dataset", "error");
    }
  };

  const changePage = async (page) => {
    if (!activeDatasetId) return;
    try {
      const res = await api.previewDataset(activeDatasetId, page);
      if (res.success) {
        setPreviewData(res.preview);
        setCurrentPage(page);
      }
    } catch (err) {
      addToast("Failed to fetch dataset page", "error");
    }
  };

  const applyCleaning = async (strategy, columns = null) => {
    if (!activeDatasetId) return;
    setCleaningLoading(true);
    try {
      const res = await api.cleanDataset(activeDatasetId, strategy, columns);
      if (res.success) {
        setInspection(res.inspection);
        setPreviewData(res.preview);
        setCurrentPage(1);
        addToast(res.message || "Dataset cleaned successfully!", "success");
      }
    } catch (err) {
      addToast(err.message || "Failed to clean dataset", "error");
    } finally {
      setCleaningLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        datasets,
        activeDatasetId,
        datasetName,
        datasetDescription,
        inspection,
        previewData,
        currentPage,
        loading,
        cleaningLoading,
        selectedCol,
        secondaryCol,
        studentMode,
        toasts,
        setSelectedCol,
        setSecondaryCol,
        toggleStudentMode,
        selectDataset,
        uploadCSV,
        uploadCSVText,
        deleteDataset,
        refreshDatasets,
        changePage,
        applyCleaning,
        addToast,
        removeToast,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);

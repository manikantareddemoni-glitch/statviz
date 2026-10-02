import {
  parseCSV,
  storeClientDataset,
  getStoredDataset,
  listStoredDatasets,
  deleteStoredDataset,
  getClientPreview,
  cleanStoredDataset,
  calculateFrequencyClient,
  calculateDescriptiveClient,
  calculateOgiveClient,
  calculateChebyshevClient,
  calculateNormalityClient,
  calculateSkewnessClient,
  calculateScatterClient,
  generateReportClient
} from '../utils/clientStatsEngine';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
  }
  return data;
}

export const api = {
  getHealth: async () => {
    try {
      return await request('/health', { method: 'GET' });
    } catch {
      return { status: "healthy", mode: "client-engine" };
    }
  },

  getSamples: async () => {
    try {
      return await request('/samples', { method: 'GET' });
    } catch {
      return { success: true, samples: [] };
    }
  },

  getDatasets: async () => {
    try {
      return await request('/datasets', { method: 'GET' });
    } catch {
      return { success: true, datasets: listStoredDatasets() };
    }
  },

  getDataset: async (id) => {
    try {
      return await request(`/dataset/${id}`, { method: 'GET' });
    } catch {
      const ds = getStoredDataset(id);
      if (!ds) throw new Error("Dataset not found");
      return {
        success: true,
        dataset_id: ds.id,
        name: ds.name,
        recommended_x: ds.recommendedX,
        recommended_y: ds.recommendedY,
        inspection: ds.inspection,
        preview: getClientPreview(ds.records, 1, 15)
      };
    }
  },

  deleteDataset: async (id) => {
    try {
      return await request(`/dataset/${id}`, { method: 'DELETE' });
    } catch {
      deleteStoredDataset(id);
      return { success: true, message: `Dataset '${id}' deleted.` };
    }
  },
  
  uploadCSV: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await request('/upload', {
        method: 'POST',
        body: formData,
      });
    } catch (err) {
      console.warn("Backend /upload unavailable or 405. Running high-performance client statistical engine:", err);
      // Fallback: Read file text and process client-side
      const text = await file.text();
      const { headers, records } = parseCSV(text);
      const datasetId = `custom_${Math.random().toString(36).substring(2, 10)}`;
      const name = file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ');
      const result = storeClientDataset(datasetId, name, headers, records);
      return { success: true, ...result };
    }
  },

  uploadCSVText: async (csvText, name = 'Pasted Dataset') => {
    try {
      return await request('/upload_text', {
        method: 'POST',
        body: JSON.stringify({ csv_text: csvText, name }),
      });
    } catch (err) {
      console.warn("Backend /upload_text unavailable or 405. Running high-performance client statistical engine:", err);
      const { headers, records } = parseCSV(csvText);
      const datasetId = `custom_${Math.random().toString(36).substring(2, 10)}`;
      const result = storeClientDataset(datasetId, name, headers, records);
      return { success: true, ...result };
    }
  },

  previewDataset: async (datasetId, page = 1, pageSize = 15) => {
    try {
      return await request('/preview', {
        method: 'POST',
        body: JSON.stringify({ dataset_id: datasetId, page, page_size: pageSize }),
      });
    } catch {
      const ds = getStoredDataset(datasetId);
      if (!ds) throw new Error("Dataset not found");
      return {
        success: true,
        inspection: ds.inspection,
        preview: getClientPreview(ds.records, page, pageSize)
      };
    }
  },

  cleanDataset: async (datasetId, strategy = 'drop', columns = null) => {
    try {
      return await request('/clean', {
        method: 'POST',
        body: JSON.stringify({ dataset_id: datasetId, strategy, columns }),
      });
    } catch {
      const res = cleanStoredDataset(datasetId, strategy, columns);
      return { success: true, ...res };
    }
  },

  getFrequency: async (datasetId, column, numClasses = null, classWidth = null) => {
    try {
      return await request('/frequency', {
        method: 'POST',
        body: JSON.stringify({ dataset_id: datasetId, column, num_classes: numClasses, class_width: classWidth }),
      });
    } catch {
      const res = calculateFrequencyClient(datasetId, column, numClasses, classWidth);
      return { success: true, column, data: res };
    }
  },

  getDescriptive: async (datasetId, column) => {
    try {
      return await request('/descriptive', {
        method: 'POST',
        body: JSON.stringify({ dataset_id: datasetId, column }),
      });
    } catch {
      const res = calculateDescriptiveClient(datasetId, column);
      return { success: true, column, data: res };
    }
  },

  getOgive: async (datasetId, column, numClasses = null) => {
    try {
      return await request('/ogive', {
        method: 'POST',
        body: JSON.stringify({ dataset_id: datasetId, column, num_classes: numClasses }),
      });
    } catch {
      const res = calculateOgiveClient(datasetId, column, numClasses);
      return { success: true, column, data: res };
    }
  },

  getChebyshev: async (datasetId, column, k = 2.0, numBins = 15) => {
    try {
      return await request('/chebyshev', {
        method: 'POST',
        body: JSON.stringify({ dataset_id: datasetId, column, k, num_bins: numBins }),
      });
    } catch {
      const res = calculateChebyshevClient(datasetId, column, k, numBins);
      return { success: true, column, data: res };
    }
  },

  getNormality: async (datasetId, column, numBins = 15) => {
    try {
      return await request('/normality', {
        method: 'POST',
        body: JSON.stringify({ dataset_id: datasetId, column, num_bins: numBins }),
      });
    } catch {
      const res = calculateNormalityClient(datasetId, column, numBins);
      return { success: true, column, data: res };
    }
  },

  getSkewness: async (datasetId, column) => {
    try {
      return await request('/skewness', {
        method: 'POST',
        body: JSON.stringify({ dataset_id: datasetId, column }),
      });
    } catch {
      const res = calculateSkewnessClient(datasetId, column);
      return { success: true, column, data: res };
    }
  },

  getScatter: async (datasetId, xColumn, yColumn) => {
    try {
      return await request('/scatter', {
        method: 'POST',
        body: JSON.stringify({ dataset_id: datasetId, x_column: xColumn, y_column: yColumn }),
      });
    } catch {
      const res = calculateScatterClient(datasetId, xColumn, yColumn);
      return { success: true, data: res };
    }
  },

  getReport: async (datasetId, primaryColumn, secondaryColumn = null) => {
    try {
      return await request('/report', {
        method: 'POST',
        body: JSON.stringify({ dataset_id: datasetId, primary_column: primaryColumn, secondary_column: secondaryColumn }),
      });
    } catch {
      const res = generateReportClient(datasetId, primaryColumn, secondaryColumn);
      return { success: true, data: res };
    }
  },
};

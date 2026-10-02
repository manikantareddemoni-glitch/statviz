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

  // If body is FormData, delete Content-Type to let browser set boundary
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  getHealth: () => request('/health', { method: 'GET' }),
  getSamples: () => request('/samples', { method: 'GET' }),
  getDatasets: () => request('/datasets', { method: 'GET' }),
  getDataset: (id) => request(`/dataset/${id}`, { method: 'GET' }),
  deleteDataset: (id) => request(`/dataset/${id}`, { method: 'DELETE' }),
  
  uploadCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/upload', {
      method: 'POST',
      body: formData,
    });
  },

  uploadCSVText: (csvText, name = 'Pasted Dataset') =>
    request('/upload_text', {
      method: 'POST',
      body: JSON.stringify({ csv_text: csvText, name }),
    }),

  previewDataset: (datasetId, page = 1, pageSize = 15) =>
    request('/preview', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId, page, page_size: pageSize }),
    }),

  cleanDataset: (datasetId, strategy = 'drop', columns = null) =>
    request('/clean', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId, strategy, columns }),
    }),

  getFrequency: (datasetId, column, numClasses = null, classWidth = null) =>
    request('/frequency', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId, column, num_classes: numClasses, class_width: classWidth }),
    }),

  getDescriptive: (datasetId, column) =>
    request('/descriptive', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId, column }),
    }),

  getOgive: (datasetId, column, numClasses = null) =>
    request('/ogive', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId, column, num_classes: numClasses }),
    }),

  getStemAndLeaf: (datasetId, column, leafUnit = null, splitStems = false) =>
    request('/stem-and-leaf', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId, column, leaf_unit: leafUnit, split_stems: splitStems }),
    }),

  getChebyshev: (datasetId, column, k = 2.0, numBins = 15) =>
    request('/chebyshev', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId, column, k, num_bins: numBins }),
    }),

  getNormality: (datasetId, column, numBins = 15) =>
    request('/normality', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId, column, num_bins: numBins }),
    }),

  getSkewness: (datasetId, column) =>
    request('/skewness', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId, column }),
    }),

  getScatter: (datasetId, xColumn, yColumn) =>
    request('/scatter', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId, x_column: xColumn, y_column: yColumn }),
    }),

  getReport: (datasetId, primaryColumn, secondaryColumn = null) =>
    request('/report', {
      method: 'POST',
      body: JSON.stringify({ dataset_id: datasetId, primary_column: primaryColumn, secondary_column: secondaryColumn }),
    }),
};

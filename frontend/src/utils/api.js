import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export const getAuthToken = () => localStorage.getItem('token');

export const getAuthHeader = () => ({
  Authorization: `Bearer ${getAuthToken()}`
});

export const api = {
  analyzeRepo: (repoUrl) =>
    axios.post(`${API_BASE}/api/analysis/analyze`, { repoUrl }, {
      headers: getAuthHeader()
    }),

  getAnalysisList: (search) =>
    axios.get(`${API_BASE}/api/analysis`, {
      params: { search },
      headers: getAuthHeader()
    }),

  getAnalysis: (id) =>
    axios.get(`${API_BASE}/api/analysis/${id}`, {
      headers: getAuthHeader()
    }),

  getFileContent: (id, filePath) =>
    axios.get(`${API_BASE}/api/analysis/${id}/file`, {
      params: { filePath },
      headers: getAuthHeader()
    }),

  explainFile: (id, filePath) =>
    axios.post(`${API_BASE}/api/analysis/${id}/explain-file`, { filePath }, {
      headers: getAuthHeader()
    }),

  logout: () =>
    axios.post(`${API_BASE}/auth/logout`, {}, {
      headers: getAuthHeader()
    })
};

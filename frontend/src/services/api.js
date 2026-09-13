import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT admin token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('atulyam_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-clear invalid/expired credentials
      localStorage.removeItem('atulyam_admin_token');
      localStorage.removeItem('atulyam_admin_user');
    }
    return Promise.reject(error);
  }
);

export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    return {
      status: 'offline',
      error: error.message || 'Unable to connect to Atulyam API'
    };
  }
};

export default api;

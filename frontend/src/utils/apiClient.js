import axios from 'axios';

// Resolve API base URL dynamically from environment or default to local backend
const RAW_SERVER_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') 
  : (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

export const SERVER_URL = RAW_SERVER_URL;
export const API_BASE_URL = `${RAW_SERVER_URL}/api`;

// Configured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('exchangeToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

/**
 * Resolves full asset/image URL considering relative uploads and external URLs
 * @param {string} url - Image URL or relative path
 * @returns {string} Fully qualified image URL
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${SERVER_URL}${cleanPath}`;
};

/**
 * Returns the WebSocket / Socket.io server host
 */
export const getSocketUrl = () => {
  return SERVER_URL;
};

export default apiClient;

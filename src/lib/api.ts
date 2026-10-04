import axios from 'axios';
import { getAuthToken, removeAuthToken } from './auth-token';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://planora-server-vsyx.onrender.com/api/v1'
    : 'http://localhost:5000/api/v1');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global 401 handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        // Optional redirect to login on expired session
        // window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;

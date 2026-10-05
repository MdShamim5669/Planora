import axios from 'axios';
import { getAuthToken, removeAuthToken } from './auth-token';

export const getApiBaseUrl = (): string => {
  // If running in browser and deployed on Vercel or any non-local domain
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (!isLocalhost) {
      const envUrl = process.env.NEXT_PUBLIC_API_URL;
      if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
        return envUrl;
      }
      return 'https://planora-server-vsyx.onrender.com/api/v1';
    }
  }

  // If environment variable explicitly provided and not pointing to localhost in production
  if (process.env.NEXT_PUBLIC_API_URL) {
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_API_URL.includes('localhost')) {
      return 'https://planora-server-vsyx.onrender.com/api/v1';
    }
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return process.env.NODE_ENV === 'production'
    ? 'https://planora-server-vsyx.onrender.com/api/v1'
    : 'http://localhost:5000/api/v1';
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor: Attach JWT Bearer token & dynamic baseURL
api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
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

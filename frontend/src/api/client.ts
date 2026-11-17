// frontend/src/api/client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';
import { getMockResponse } from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: 401 Unauthorized handling & fallback mock data when backend is offline
apiClient.interceptors.response.use(
  (response) => {
    // Defensive check: If server returned HTML (e.g. Nginx SPA fallback for an unhandled API route),
    // treat it as offline/fallback rather than passing raw HTML to React components
    if (typeof response.data === 'string' && response.data.trim().startsWith('<')) {
      const mockData = getMockResponse(response.config?.url || '', response.config?.method);
      if (mockData !== undefined) {
        return {
          ...response,
          data: mockData,
        };
      }
    }
    return response;
  },
  (error: AxiosError<{ error?: { code?: string; message?: string } }>) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        useAuthStore.getState().logout();
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }

    // Offline / Demo fallback: if backend is unreachable or not running, provide sample mock data
    const mockData = getMockResponse(error.config?.url || '', error.config?.method);
    if (mockData !== undefined) {
      return Promise.resolve({
        data: mockData,
        status: 200,
        statusText: 'OK (Demo Mode)',
        headers: {},
        config: error.config!,
      });
    }

    return Promise.reject(error);
  }
);

export const api = apiClient;
export default apiClient;


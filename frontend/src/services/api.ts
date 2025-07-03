import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import { API_BASE_URL, ERROR_MESSAGES } from '../utils/constants';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers or request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle global error responses
    if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Server error');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (!error.response) {
      console.error('Network error');
    }
    
    return Promise.reject(error);
  }
);

// API Response wrapper
export interface ApiResponse<T> {
  status: 'success' | 'error' | 'fail';
  data?: T;
  message?: string;
  error?: string;
}

// Generic API methods
export const apiClient = {
  get: <T>(url: string, params?: any): Promise<ApiResponse<T>> =>
    api.get(url, { params }).then(res => res.data),
  
  post: <T>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.post(url, data).then(res => res.data),
  
  put: <T>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.put(url, data).then(res => res.data),
  
  patch: <T>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.patch(url, data).then(res => res.data),
  
  delete: <T>(url: string): Promise<ApiResponse<T>> =>
    api.delete(url).then(res => res.data),
};

// Error handling utility
export const handleApiError = (error: AxiosError): string => {
  if (error.response?.data && typeof error.response.data === 'object') {
    const errorData = error.response.data as any;
    return errorData.message || ERROR_MESSAGES.GENERIC;
  }
  
  if (error.code === 'ECONNABORTED') {
    return ERROR_MESSAGES.NETWORK;
  }
  
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK;
  }
  
  return ERROR_MESSAGES.GENERIC;
};

export default api; 
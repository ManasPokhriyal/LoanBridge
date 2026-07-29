import axios from 'axios';
import mockAdapter from './mockAdapter';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 12000,
  adapter: import.meta.env.VITE_USE_MOCK_API === 'true' ? mockAdapter : undefined,
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('loanbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message;
    if (errorMessage) {
      return Promise.reject(new Error(errorMessage));
    }
    return Promise.reject(error);
  }
);

export const panApi = axios.create({
  baseURL: import.meta.env.VITE_PAN_API_BASE_URL || 'http://localhost:9090/api',
  timeout: 12000,
  adapter: import.meta.env.VITE_USE_MOCK_API === 'true' ? mockAdapter : undefined,
});

panApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    if (message) {
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  }
);

export default apiClient;

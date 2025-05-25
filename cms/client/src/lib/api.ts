import axios from 'axios';
import type { AxiosRequestHeaders } from 'axios';

const api = axios.create({
  baseURL: 'http://172.23.46.18:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;

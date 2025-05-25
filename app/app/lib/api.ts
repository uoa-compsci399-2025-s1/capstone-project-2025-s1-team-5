import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({ baseURL: 'https://4b56-202-36-244-215.ngrok-free.app/api' });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('USER_TOKEN');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
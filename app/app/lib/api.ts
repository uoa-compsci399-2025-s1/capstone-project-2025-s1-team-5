import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const ip = process.env.EXPO_PUBLIC_API_URL
const api = axios.create({ baseURL: `http://${ip}:3000/api` });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('USER_TOKEN');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
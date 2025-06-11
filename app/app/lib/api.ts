import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { LOCAL_IP } from '@env'

const api = axios.create({ baseURL: `http://${LOCAL_IP}:3000/api` });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('USER_TOKEN');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
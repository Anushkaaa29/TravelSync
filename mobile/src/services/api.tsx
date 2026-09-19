import axios from 'axios';
import { store } from '../store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://10.0.1.126:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  config => {
    const token = store.getState().auth.token;
    console.log('TOKEN FROM REDUX =>', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);
API.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.data?.error === 'jwt expired') {
      await AsyncStorage.removeItem('token');

      store.dispatch({ type: 'auth/setLogout' });
    }
    return Promise.reject(error);
  },
);

export default API;

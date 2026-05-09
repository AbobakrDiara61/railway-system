import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      useAuthStore.getState().logout();
      toast.error('Session expired. Please login again.');
      window.location.href = '/login';
    } else if (status === 403) {
      window.location.href = '/access-denied';
    } else if (status === 404) {
      toast.error('Resource not found.');
    } else if (status >= 500) {
      toast.error('Server error. Please try again.');
    } else if (!error.response) {
      toast.error('No connection. Check your internet.');
    }

    return Promise.reject(error);
  }
);

export default api;

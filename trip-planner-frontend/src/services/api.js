import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// Request interceptor for adding CSRF token
api.interceptors.request.use((config) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];
  
  // Add CSRF token to headers for state-changing requests
  if (token && ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
    config.headers['X-XSRF-TOKEN'] = token;
  }
  
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
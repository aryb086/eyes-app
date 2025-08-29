import axios from 'axios';

// Get API URL based on environment
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    // For production builds, use the production URL directly
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return 'https://eyes-app-backend-9f922055ebf7.herokuapp.com/api/v1';
    }
    // For local development, use localhost
    return 'http://localhost:5000/api';
  }
  
  // Fallback for SSR or other environments
  return process.env?.REACT_APP_API_BASE_URL || 'https://eyes-app-backend-9f922055ebf7.herokuapp.com/api/v1';
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

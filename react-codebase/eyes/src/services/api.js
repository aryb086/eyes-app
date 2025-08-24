import axios from 'axios';

// Support both env names; CRA inlines these at build time
export const API_URL =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies with requests
});

// Request interceptor to add auth token to requests if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    // We don't need to manually set the token in the Authorization header
    // as it will be sent automatically via cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired, invalid token, etc.)
    if (error.response && error.response.status === 401) {
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
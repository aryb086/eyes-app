// API configuration for the Eyes app
// This file handles API configuration for both development and production environments

// Get API URL from environment variable or use production URL as fallback
const getApiUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // For production builds, use the production URL directly
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return 'https://eyes-app-backend-9f922055ebf7.herokuapp.com/api/v1';
    }
    // For local development, use localhost
    return 'http://localhost:5000/api/v1';
  }
  
  // Use environment variable if available, otherwise fallback to production
  return process.env.REACT_APP_API_BASE_URL || 'https://eyes-app-backend-9f922055ebf7.herokuapp.com/api/v1';
};

export const API_URL = getApiUrl();

// Debug logging for API URL
if (typeof window !== 'undefined') {
  console.log('🔧 API Configuration Debug:');
  console.log('  - process.env.REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
  console.log('  - window.location.hostname:', window.location.hostname);
  console.log('  - Final API_URL:', API_URL);
}

// API endpoints
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    GOOGLE: '/auth/google',
    GITHUB: '/auth/github',
    CALLBACK: '/auth/callback',
  },
  
  // User endpoints
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
    UPDATE_LOCATION: '/users/update-location',
    LOCATION: '/users/location',
    NEARBY: '/users/nearby',
  },
  
  // Post endpoints
  POSTS: {
    CREATE: '/posts',
    GET_ALL: '/posts',
    GET_BY_ID: (id) => `/posts/${id}`,
    UPDATE: (id) => `/posts/${id}`,
    DELETE: (id) => `/posts/${id}`,
    LIKE: (id) => `/posts/${id}/like`,
    UNLIKE: (id) => `/posts/${id}/unlike`,
    COMMENT: (id) => `/posts/${id}/comments`,
    GET_BY_LOCATION: '/posts/location',
    GET_BY_CITY: (city) => `/posts/city/${city}`,
    GET_BY_NEIGHBORHOOD: (neighborhood) => `/posts/neighborhood/${neighborhood}`,
  },
  
  // Location endpoints
  LOCATION: {
    CITIES: '/location/cities',
    NEIGHBORHOODS: '/location/neighborhoods',
    GEOCODE: '/location/geocode',
    REVERSE_GEOCODE: '/location/reverse-geocode',
  },
  
  // Health check
  HEALTH: '/health',
};

// API utility functions
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Debug logging for API requests
  console.log('🌐 API Request Debug:');
  console.log('  - API_URL:', API_URL);
  console.log('  - endpoint:', endpoint);
  console.log('  - Full URL:', url);
  
  const defaultOptions = {
    headers: {
      ...options.headers,
    },
    credentials: 'include', // Include cookies for authentication
  };

  // Only set Content-Type for non-FormData requests
  // Check if body is FormData or if Content-Type is explicitly set to multipart
  const isFormData = options.body instanceof FormData || 
                    options.headers?.['Content-Type']?.includes('multipart/form-data');
  
  console.log('🔍 DEBUG: API Request Content-Type Check:');
  console.log('  - options.body instanceof FormData:', options.body instanceof FormData);
  console.log('  - options.headers?.[Content-Type]:', options.headers?.['Content-Type']);
  console.log('  - isFormData:', isFormData);
  
  if (!isFormData) {
    defaultOptions.headers['Content-Type'] = 'application/json';
    console.log('  - Setting Content-Type to application/json');
  } else {
    console.log('  - Skipping Content-Type (FormData detected)');
  }

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    // Handle different response types
    if (response.headers.get('content-type')?.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } else {
      // Handle non-JSON responses
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.text();
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Specific API methods
export const api = {
  // GET request
  get: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'GET' }),
  
  // POST request
  post: (endpoint, data, options = {}) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiRequest(endpoint, { 
      ...options, 
      method: 'POST', 
      body
    });
  },
  
  // PUT request
  put: (endpoint, data, options = {}) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return apiRequest(endpoint, { 
      ...options, 
      method: 'PUT', 
      body
    });
  },
  
  // DELETE request
  delete: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
  
  // PATCH request
  patch: (endpoint, data, options = {}) => 
    apiRequest(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    }),
};

export default api;
import axios from 'axios';
import { oauthConfig } from '../config/oauth';

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

const API_BASE_URL = getApiUrl();

export const oauthService = {
  // Google OAuth
  googleAuth: async (code) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/google`, {
        code
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Google authentication failed');
    }
  },

  // GitHub OAuth
  githubAuth: async (code) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/github`, {
        code
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'GitHub authentication failed');
    }
  },

  // Get Google OAuth URL
  getGoogleAuthUrl: () => {
    if (!oauthConfig.google.enabled) {
      throw new Error('Google OAuth is not configured.');
    }
    
    const clientId = oauthConfig.google.clientId;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'email profile';
    const state = 'google'; // Add state to identify the provider
    
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
  },

  // Get GitHub OAuth URL
  getGitHubAuthUrl: () => {
    if (!oauthConfig.github.enabled) {
      throw new Error('GitHub OAuth is not configured.');
    }
    
    const clientId = oauthConfig.github.clientId;
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'user:email';
    const state = 'github'; // Add state to identify the provider
    
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;
  }
};

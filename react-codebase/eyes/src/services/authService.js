import api, { ENDPOINTS } from './api';

class AuthService {
  // Login user
  async login(email, password) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, userData);
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userLocation');
    }
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.post(ENDPOINTS.AUTH.REFRESH);
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      this.logout();
      throw error;
    }
  }

  // Google OAuth
  async googleAuth(code) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.GOOGLE, { code });
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Google auth failed:', error);
      throw error;
    }
  }

  // GitHub OAuth
  async githubAuth(code) {
    try {
      const response = await api.post(ENDPOINTS.AUTH.GITHUB, { code });
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('GitHub auth failed:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await api.put(ENDPOINTS.USERS.UPDATE, userData);
      
      // Update local storage with new user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await api.get(ENDPOINTS.USERS.PROFILE);
      return response;
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;

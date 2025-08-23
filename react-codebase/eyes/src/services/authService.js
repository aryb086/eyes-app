import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';
const API_URL = `${BASE_URL}/auth`;

const register = async (userData) => {
  try {
    console.log('Sending registration request to:', `${API_URL}/register`);
    console.log('Registration data:', JSON.stringify(userData, null, 2));
    
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: function (status) {
        return status < 500; // Reject only if status is greater than or equal to 500
      }
    });
    
    console.log('Registration response:', response);
    
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
    
    // If we get here, there was no token in the response
    throw new Error(response.data.message || 'Registration failed: No token received');
  } catch (error) {
    console.error('Registration error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      throw new Error(error.response.data?.message || `Registration failed with status ${error.response.status}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Request a password reset email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Result of the request
 */
const requestPasswordReset = async (email) => {
  try {
    // Call the backend API to handle password reset request
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  
    // The backend will handle sending the email
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to send password reset email');
    }
    
    return { success: true, message: 'Password reset email sent successfully' };
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw new Error(error.response?.data?.message || 'Failed to send password reset email');
  }
};

/**
 * Reset a user's password using a reset token
 * @param {string} token - Password reset token
 * @param {Object} data - New password data
 * @param {string} data.password - New password
 * @returns {Promise<Object>} - Result of the password reset
 */
const resetPassword = async (token, { password }) => {
  try {
    // Call the backend API to handle password reset
    const response = await axios.post(`${API_URL}/auth/reset-password`, {
      token,
      password
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to reset password');
    }
    
    return { success: true, message: 'Password reset successful' };
  } catch (error) {
    console.error('Error resetting password:', error);
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

/**
 * Validate a password reset token
 * @param {string} token - Password reset token to validate
 * @returns {Promise<Object>} - Token validation result
 */
const validateResetToken = async (token) => {
  try {
    // In a real app, you would verify the token with the backend
    // For now, just check if it exists
    if (!token) {
      return { valid: false, error: 'No token provided' };
    }
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getAuthHeader,
  requestPasswordReset,
  resetPassword,
  validateResetToken
};

export default authService;

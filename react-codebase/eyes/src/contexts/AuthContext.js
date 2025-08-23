import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // You might want to validate the token with the server here
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Only run once on component mount
  useEffect(() => {
    const checkAuth = async () => {
      await getCurrentUser();
    };
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setCurrentUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setCurrentUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error };
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    getCurrentUser,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

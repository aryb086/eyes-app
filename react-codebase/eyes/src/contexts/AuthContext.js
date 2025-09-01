import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
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

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setCurrentUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error };
    }
  };

  const register = async (name, username, email, password) => {
    try {
      const userData = { fullName: name, username, email, password };
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

  const updateUserLocation = async (locationData) => {
    try {
      // Update user location in backend
      const response = await authService.updateUserLocation(locationData);
      
      // Update local user state
      if (response.success && response.user) {
        setCurrentUser(response.user);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user location:', error);
      return { success: false, message: error.message };
    }
  };

  const value = {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    getCurrentUser,
    login,
    register,
    logout,
    updateUserLocation,
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

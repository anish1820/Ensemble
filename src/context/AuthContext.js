import React, { createContext, useState, useEffect } from 'react';
import { getUserId, saveUserId, removeUserId } from '../utils/storage';

// Create the Authentication Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user ID on app launch
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // Retrieve user ID from storage
        const storedUserId = await getUserId();
        
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  // Login function
  const login = async (newUserId) => {
    try {
      // Save user ID to storage
      await saveUserId(newUserId);
      setUserId(newUserId);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Remove user ID from storage
      await removeUserId();
      setUserId(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Context value
  const authContext = {
    userId,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

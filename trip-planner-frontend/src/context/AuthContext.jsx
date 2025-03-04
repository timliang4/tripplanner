import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedIn = async () => {
      try {
        const response = await api.get('/user/current');
        setUser(response.data);
      } catch (error) {
        console.log('Not logged in', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = () => {
    // Redirect to OAuth login
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const logout = async () => {
    try {
      // Try first logout
      await api.post('/logout');
    } catch (error) {
      // If first attempt fails (403), try again immediately
      try {
        await api.post('/logout');
      } catch (error) {
        console.error('Logout error', error);
      }
    }
    // Only update state and redirect after both attempts
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

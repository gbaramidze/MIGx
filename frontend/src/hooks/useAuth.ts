import { useState, useEffect, useCallback } from 'react';
import { authAPI, setAuthToken, clearAuthToken } from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    // Check if user is already logged in (e.g., token in localStorage)
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      const user = localStorage.getItem('user');
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: user || 'researcher', // Default user for demo
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await authAPI.login(username, password);
      setAuthToken(response.access_token);
      localStorage.setItem('authToken', response.access_token);
      localStorage.setItem('user', username);

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: username,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Login failed. Please check your credentials.'
      };
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    user: authState.user,
    login,
    logout,
  };
};
import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logout as logoutService } from '../utils/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getCurrentUser();
      setUser(response.user);
      setError(null);
    } catch (err) {
      console.error('Failed to load user:', err);
      setError(err.message);
      // Clear invalid token
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
    setError(null);
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setError(null);
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    refreshUser: loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

const API_URL = 'http://localhost:3001/api/auth';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Register a new user
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user');
    }

    return data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await fetch(`${API_URL}/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password');
    }

    return data;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  isAuthenticated
};

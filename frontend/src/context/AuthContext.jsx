import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/v1/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Failed to authenticate token', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, [token]);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      // Convert credentials to form data for OAuth2 compatibility
      const formData = new FormData();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);

      const response = await axios.post('/api/v1/auth/token', formData);
      
      const { access_token } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', access_token);
      setToken(access_token);

      // Fetch user details
      const userResponse = await axios.get('/api/v1/auth/me', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });
      
      setUser(userResponse.data);
      toast.success('Login successful!');
      navigate('/dashboard');
      
      return true;
    } catch (error) {
      console.error('Login failed', error);
      const message = error.response?.data?.detail || 'Login failed. Please check your credentials.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      await axios.post('/api/v1/auth/register', userData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
      return true;
    } catch (error) {
      console.error('Registration failed', error);
      const message = error.response?.data?.detail || 'Registration failed. Please try again.';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

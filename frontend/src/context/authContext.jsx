// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  loginUser as apiLogin, 
  registerUser as apiRegister,
  logoutUser as apiLogout 
} from '../api/auth.api';

import { useNavigate } from 'react-router-dom';

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
  const [error, setError] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  
  const navigate = useNavigate();

  // Clear error after 1.5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 1500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Check current user on mount
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await getCurrentUser();
      const userData = res.data?.data?.user || res.data?.user;
      setUser(userData);
    } catch (err) {
      console.error('Auth Check Failed:', err);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (loginData) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await apiLogin(loginData);
      
      const userData = res.data?.data?.user || res.data?.user;
      const token = res.data?.data?.accessToken || res.data?.accessToken;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      setIsLoginModalOpen(false);
      
      // Navigate based on role
      if (userData?.role !== 'admin') {
        navigate(`/profile/${userData._id}`);
      } else {
        navigate('/admin');
      }
      
      return { success: true, data: userData };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid Credentials';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (signupData) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await apiRegister(signupData);
      
      const userData = res?.data?.data?.user || res?.data?.user;
      const token = res?.data?.data?.accessToken || res?.data?.accessToken;

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      
      setIsSignupModalOpen(false);
      
      return { success: true, data: userData };
    } catch (err) {
      let errorMsg = 'Signup Failed';
      
      if (err.response?.status === 409) {
        errorMsg = 'Email already registered. Please login.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.clear();
      setUser(null);
      setIsLoginModalOpen(false);
      setIsSignupModalOpen(false);
      navigate('/');
    }
  };

  const openLoginModal = () => {
    setError('');
    setIsLoginModalOpen(true);
  };

  const openSignupModal = () => {
    setError('');
    setIsSignupModalOpen(true);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
    setError('');
  };

  const switchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
    setError('');
  };

  const switchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
    setError('');
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoginModalOpen,
    isSignupModalOpen,
    loginUser,
    registerUser,
    logoutUser,
    openLoginModal,
    openSignupModal,
    closeModals,
    switchToLogin,
    switchToSignup,
    checkUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
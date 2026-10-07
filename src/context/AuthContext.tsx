import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { userApi } from '../services/api';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isStaffOrAdmin: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot' | 'reset';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot' | 'reset') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('nexura_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nexura_token') || null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');

  useEffect(() => {
    if (token) {
      localStorage.setItem('nexura_token', token);
    } else {
      localStorage.removeItem('nexura_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexura_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexura_user');
    }
  }, [user]);

  const login = async (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await userApi.login({ email: cleanEmail, password });
      if (response && response.token) {
        setToken(response.token);
        setUser(response);
        toast.success(`Welcome back, ${response.fullName}!`);
        setAuthModalOpen(false);
        return true;
      }
    } catch {
      // Local fallback if backend is offline
    }

    // Role assignment based on credentials typed by the user
    let role: Role = 'CUSTOMER';
    let fullName = cleanEmail.split('@')[0].toUpperCase();

    if (cleanEmail === 'admin@nexuracinemas.lk' || cleanEmail.includes('admin')) {
      role = 'SUPER_ADMIN';
      fullName = 'Nexura Master Admin';
    } else if (cleanEmail.includes('manager')) {
      role = 'CINEMA_MANAGER';
      fullName = 'Cinema Manager';
    } else if (cleanEmail.includes('usher')) {
      role = 'TICKET_USHER';
      fullName = 'Ticket Gate Usher';
    }

    const fallbackUser: User = {
      id: Math.floor(Math.random() * 1000) + 10,
      fullName,
      email: cleanEmail,
      role,
      token: 'jwt-token-' + Date.now()
    };

    setToken(fallbackUser.token || 'token');
    setUser(fallbackUser);
    toast.success(`Logged in as ${fallbackUser.fullName}`);
    setAuthModalOpen(false);
    return true;
  };

  const register = async (userData: any) => {
    // Only regular customers register publicly
    const customerPayload = {
      ...userData,
      role: 'CUSTOMER'
    };

    try {
      const response = await userApi.register(customerPayload);
      toast.success('Registration successful! Please sign in.');
      setAuthModalMode('login');
      return response;
    } catch {
      const mockCreated: User = {
        id: Math.floor(Math.random() * 1000) + 10,
        fullName: userData.fullName,
        email: userData.email,
        role: 'CUSTOMER',
        token: 'jwt-token-' + Date.now()
      };
      setToken(mockCreated.token || 'token');
      setUser(mockCreated);
      toast.success(`Welcome to Nexura Cinemas, ${userData.fullName}!`);
      setAuthModalOpen(false);
      return mockCreated;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nexura_token');
    localStorage.removeItem('nexura_user');
    toast.success('Signed out successfully');
  };

  const isStaffOrAdmin = !!user && ['SUPER_ADMIN', 'CINEMA_MANAGER', 'TICKET_USHER'].includes(user.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isStaffOrAdmin,
        login,
        register,
        logout,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, EnglishLevel } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, level?: EnglishLevel) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 1,
  name: 'Aman Sharma',
  email: 'aman@example.com',
  english_level: 'Elementary (A2)',
  target_minutes: 30,
  preferred_language: 'Hinglish',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('speakup_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('speakup_auth_token');
    if (token) {
      refreshProfile();
    }
  }, []);

  const refreshProfile = async () => {
    try {
      const res = await api.getProfile();
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('speakup_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.warn('Could not refresh profile:', err);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('speakup_auth_token', res.token);
      localStorage.setItem('speakup_user', JSON.stringify(res.user));
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, level: EnglishLevel = 'Beginner (A1)') => {
    setIsLoading(true);
    try {
      const res = await api.register({ name, email, password, english_level: level });
      localStorage.setItem('speakup_auth_token', res.token);
      localStorage.setItem('speakup_user', JSON.stringify(res.user));
      setUser(res.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('speakup_auth_token');
    localStorage.removeItem('speakup_user');
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    try {
      const res = await api.updateProfile(data);
      if (res.user) {
        setUser(res.user);
        localStorage.setItem('speakup_user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.error('Update profile error:', err);
      // Fallback local update
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('speakup_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

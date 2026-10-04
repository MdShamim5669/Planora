'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Role, ApiResponse } from '@/types';
import api from '@/lib/api';
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/auth-token';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: Role | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchCurrentUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
      } else {
        setUser(null);
        removeAuthToken();
      }
    } catch {
      setUser(null);
      removeAuthToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', {
      email,
      password,
    });
    if (response.data.success && response.data.data) {
      const { token, user } = response.data.data;
      setAuthToken(token);
      setUser(user);
    }
  };

  const register = async (payload: { name: string; email: string; password: string; phone?: string }) => {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', payload);
    if (response.data.success && response.data.data) {
      const { token, user } = response.data.data;
      setAuthToken(token);
      setUser(user);
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
    router.push('/');
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        register,
        logout,
        refreshUser,
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

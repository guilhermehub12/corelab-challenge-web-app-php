"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/api';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Verificar se existe um token
        const token = localStorage.getItem('token');
        if (token) {
          const { data } = await authService.getCurrentUser();
          setUser(data);
        }
      } catch (err) {
        // Em caso de erro, limpar o token
        console.error('Erro ao verificar o status de autenticação:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register({ 
        name, email, password, password_confirmation: passwordConfirmation 
      });
      localStorage.setItem('token', response.token);
      setUser(response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      localStorage.removeItem('token');
      setUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
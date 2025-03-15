"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types/api';
import { authService } from '../services/auth.service';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  checkPermission: (requiredProfile: 'admin' | 'manager' | 'member') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Verificar se existe um token no cookie
        const token = getCookie('token');
        if (token) {
          const { data } = await authService.getCurrentUser();
          setUser(data);
        }
      } catch (err) {
        // Em caso de erro, limpar o token
        deleteCookie('token');
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
      
      // Salvar token no cookie (7 dias)
      setCookie('token', response.token, { maxAge: 60 * 60 * 24 * 7 });
      
      // Atualizar estado do usuário
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
      
      // Salvar token no cookie (7 dias)
      setCookie('token', response.token, { maxAge: 60 * 60 * 24 * 7 });
      
      // Atualizar estado do usuário
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
      
      // Remover token do cookie
      deleteCookie('token');
      
      // Limpar estado do usuário
      setUser(null);
      
      // Redirecionar para login
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  };
  
  const checkPermission = (requiredProfile: 'admin' | 'manager' | 'member'): boolean => {
    if (!user) return false;

    // Verificar permissão baseada no perfil
    const profiles = {
      admin: ['admin'],
      manager: ['admin', 'manager'],
      member: ['admin', 'manager', 'member']
    };

    return profiles[requiredProfile].includes(user.profile);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AccessControlProps {
  requiredProfile: 'admin' | 'manager' | 'member';
  children: ReactNode;
  fallback?: ReactNode;
}

export const AccessControl = ({ 
  requiredProfile, 
  children, 
  fallback = null 
}: AccessControlProps) => {
  const { user, checkPermission } = useAuth();
  
  // Se o usuário não estiver autenticado ou não tiver permissão, renderize o fallback
  if (!user || !checkPermission(requiredProfile)) {
    return <>{fallback}</>;
  }
  
  // Se o usuário tiver permissão, renderize as crianças
  return <>{children}</>;
};
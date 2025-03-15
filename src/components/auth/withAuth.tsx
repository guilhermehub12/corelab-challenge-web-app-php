'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/hooks/useNotification';

type ProfileType = 'admin' | 'manager' | 'member';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredProfile: ProfileType = 'member'
) {
  const WithAuth = (props: P) => {
    const { user, loading, checkPermission } = useAuth();
    const router = useRouter();
    const notification = useNotification();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      if (!loading) {
        // Se o usuário não estiver autenticado
        if (!user) {
          router.push('/login');
          return;
        }

        // Verificar permissão
        const hasPermission = checkPermission(requiredProfile);
        
        if (!hasPermission) {
          notification.error('Você não tem permissão para acessar esta página');
          router.push('/tasks');
          return;
        }
        
        setIsAuthorized(true);
      }
    }, [loading, user, router, notification, checkPermission]);

    // Mostrar loading ou nada até a verificação ser concluída
    if (loading || !isAuthorized) {
      return <div className="loading-screen">Carregando...</div>;
    }

    // Se autorizado, renderizar o componente
    return <Component {...props} />;
  };

  return WithAuth;
}
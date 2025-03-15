'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Se o usuário estiver logado, redirecione para as tarefas
        router.push('/tasks');
      } else {
        // Se não estiver logado, redirecione para o login
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Tela de carregamento simples
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <h1>Carregando...</h1>
    </div>
  );
}
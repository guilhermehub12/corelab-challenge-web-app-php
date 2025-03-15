'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import styles from './Login.module.scss';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();
  const notification = useNotification();
  
  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!password) {
      newErrors.password = 'A senha é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      notification.success('Login realizado com sucesso!');
      router.push('/tasks');
    } catch (error: any) {
      notification.error(error);
      
      // Checar erros específicos
      if (error.errors) {
        const fieldErrors: { email?: string; password?: string } = {};
        
        if (error.errors.email) {
          fieldErrors.email = error.errors.email[0];
        }
        
        if (error.errors.password) {
          fieldErrors.password = error.errors.password[0];
        }
        
        setErrors(fieldErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logo}>CoreTasks</h1>
        </div>
        
        <h2 className={styles.title}>Login</h2>
        <p className={styles.subtitle}>Faça login para gerenciar suas tarefas</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            fullWidth
          />
          
          <Input
            label="Senha"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            fullWidth
          />
          
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Entrar
          </Button>
        </form>
        
        <div className={styles.links}>
          <Link href="/register" className={styles.link}>
            Não tem uma conta? Registre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
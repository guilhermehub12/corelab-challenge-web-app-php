'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import styles from './Register.module.scss';
import { ApiError } from '@/types/api';

const createApiError = (err: unknown): ApiError => {
  if (err && typeof err === 'object' && 'message' in err) {
    return err as ApiError;
  }
  return { 
    message: err instanceof Error ? err.message : 'Ocorreu um erro desconhecido',
    errors: {} 
  };
};

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();
  const notification = useNotification();
  
  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      password_confirmation?: string;
    } = {};
    
    if (!name) {
      newErrors.name = 'O nome é obrigatório';
    }
    
    if (!email) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!password) {
      newErrors.password = 'A senha é obrigatória';
    } else if (password.length < 8) {
      newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
    }
    
    if (!passwordConfirmation) {
      newErrors.password_confirmation = 'A confirmação de senha é obrigatória';
    } else if (password !== passwordConfirmation) {
      newErrors.password_confirmation = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      await register(name, email, password, passwordConfirmation);
      notification.success('Registro realizado com sucesso!');
      router.push('/tasks');
    } catch (error: unknown) {
      const apiError = createApiError(error);
      notification.error(apiError);
      
      // Checar erros específicos
      if (apiError.errors) {
        const fieldErrors: {
          name?: string;
          email?: string;
          password?: string;
          password_confirmation?: string;
        } = {};
        
        if (apiError.errors.name) {
          fieldErrors.name = apiError.errors.name[0];
        }
        
        if (apiError.errors.email) {
          fieldErrors.email = apiError.errors.email[0];
        }
        
        if (apiError.errors.password) {
          fieldErrors.password = apiError.errors.password[0];
        }
        
        if (apiError.errors.password_confirmation) {
          fieldErrors.password_confirmation = apiError.errors.password_confirmation[0];
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
        
        <h2 className={styles.title}>Criar Conta</h2>
        <p className={styles.subtitle}>Registre-se para começar a gerenciar suas tarefas</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <Input
            label="Nome"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            fullWidth
          />
          
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
          
          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="Confirme sua senha"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            error={errors.password_confirmation}
            fullWidth
          />
          
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Registrar
          </Button>
        </form>
        
        <div className={styles.links}>
          <Link href="/login" className={styles.link}>
            Já tem uma conta? Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}
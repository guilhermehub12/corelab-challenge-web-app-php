import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { ToastType } from '@/components/ui/toast/Toast';
// import { ToastType } from '@/components/ui/toast/Toast';

export interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export interface ToastState {
  id: string;
  type: ToastType;
  message: string | React.ReactNode;
  duration: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const addToast = useCallback((
    type: ToastType,
    message: string | React.ReactNode,
    options: ToastOptions = {}
  ) => {
    const id = nanoid();
    const toast: ToastState = {
      id,
      type,
      message,
      duration: options.duration ?? 5000
    };

    setToasts(prevToasts => [...prevToasts, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Helper methods
  const success = useCallback(
    (message: string | React.ReactNode, options?: ToastOptions) => 
      addToast('success', message, options),
    [addToast]
  );

  const error = useCallback(
    (message: string | React.ReactNode, options?: ToastOptions) => 
      addToast('error', message, options),
    [addToast]
  );

  const warning = useCallback(
    (message: string | React.ReactNode, options?: ToastOptions) => 
      addToast('warning', message, options),
    [addToast]
  );

  const info = useCallback(
    (message: string | React.ReactNode, options?: ToastOptions) => 
      addToast('info', message, options),
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info
  };
}
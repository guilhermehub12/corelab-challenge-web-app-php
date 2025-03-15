'use client';

import { ReactNode, createContext, useContext } from 'react';
import { Toast, ToastContainer } from '@/components/ui/toast/Toast';
import { useToast, ToastOptions } from '@/hooks/useToast';

interface ToastContextType {
  success: (message: string | ReactNode, options?: ToastOptions) => string;
  error: (message: string | ReactNode, options?: ToastOptions) => string;
  warning: (message: string | ReactNode, options?: ToastOptions) => string;
  info: (message: string | ReactNode, options?: ToastOptions) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
    clearAllToasts
  } = useToast();

  return (
    <ToastContext.Provider
      value={{
        success,
        error,
        warning,
        info,
        removeToast,
        clearAllToasts
      }}
    >
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
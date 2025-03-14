import toast, { Toast } from 'react-hot-toast';
import { ApiError } from '../types/api';

interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

export const useNotification = () => {
  const defaultOptions: NotificationOptions = {
    duration: 5000,
    position: 'top-right',
  };

  const success = (message: string, options?: NotificationOptions) => {
    return toast.success(message, { ...defaultOptions, ...options });
  };

  const error = (error: string | ApiError, options?: NotificationOptions) => {
    let message: string;
    
    if (typeof error === 'string') {
      message = error;
    } else {
      message = error.message || 'Um erro ocorreu';
      
      if (error.errors) {
        const validationErrors = Object.values(error.errors)
          .flat()
          .join('\n');
        
        if (validationErrors) {
          message = `${message}\n${validationErrors}`;
        }
      }
    }
    
    return toast.error(message, { ...defaultOptions, ...options });
  };

  const info = (message: string, options?: NotificationOptions) => {
    return toast(message, { ...defaultOptions, ...options });
  };

  const warning = (message: string, options?: NotificationOptions) => {
    return toast(message, { 
      ...defaultOptions, 
      ...options,
      style: { 
        background: '#FFF3CD', 
        color: '#856404',
        borderLeft: '4px solid #856404',
      },
      icon: '⚠️',
    });
  };

  const loading = (message: string = 'Carregando...', options?: NotificationOptions) => {
    return toast.loading(message, { ...defaultOptions, ...options });
  };

  const dismiss = (toastId?: Toast) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return {
    success,
    error,
    info,
    warning,
    loading,
    dismiss,
  };
};
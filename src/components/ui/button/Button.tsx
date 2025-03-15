import { ButtonHTMLAttributes, ReactNode, useCallback } from 'react';
import { useTactileFeedback } from '@/hooks/useTactileFeedback';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disableTactileFeedback?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  onClick,
  disableTactileFeedback = false,
  ...rest
}: ButtonProps) => {
  const { vibrateOnClick, isSupported } = useTactileFeedback();

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Adicionar feedback tátil se suportado
    if (isSupported && !disableTactileFeedback) {
      vibrateOnClick();
    }

    // Chamar o handler original
    onClick?.(e);
  }, [onClick, isSupported, disableTactileFeedback, vibrateOnClick]);

  return (
    <button
      className={`
        ${styles.button} 
        ${styles[variant]} 
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ''}
        ${isLoading ? styles.loading : ''}
        ${className}
      `}
      disabled={isLoading || disabled}
      onClick={handleClick}
      {...rest}
    >
      {isLoading && <span className={styles.spinner} />}
      {!isLoading && leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      <span className={isLoading ? styles.invisible : ''}>{children}</span>
      {!isLoading && rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  );
};

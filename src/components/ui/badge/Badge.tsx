import { ReactNode } from 'react';
import styles from './Badge.module.scss';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  className = '',
}: BadgeProps) => {
  return (
    <span className={`
      ${styles.badge} 
      ${styles[variant]} 
      ${styles[size]} 
      ${rounded ? styles.rounded : ''}
      ${className}
    `}>
      {children}
    </span>
  );
};
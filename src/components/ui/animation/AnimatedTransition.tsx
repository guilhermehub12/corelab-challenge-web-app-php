'use client';

import { ReactNode, useState, useEffect } from 'react';
import styles from './AnimatedTransition.module.scss';

type AnimationType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'none';

interface AnimatedTransitionProps {
  children: ReactNode;
  show: boolean;
  type?: AnimationType;
  duration?: number;
  delay?: number;
  onExited?: () => void;
  className?: string;
}

export const AnimatedTransition = ({
  children,
  show,
  type = 'fade',
  duration = 300,
  delay = 0,
  onExited,
  className = '',
}: AnimatedTransitionProps) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      // Pequeno delay para garantir que o DOM está pronto antes da animação
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        onExited?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onExited]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        ${styles.animated}
        ${styles[type]}
        ${isAnimating ? styles.enter : styles.exit}
        ${className}
      `}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: isAnimating && delay ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
};
import { HTMLAttributes } from 'react';
import styles from './Skeleton.module.scss';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'card';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave' | false;
}

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
  ...rest
}: SkeletonProps) => {
  const animationClass = animation === 'pulse' 
    ? styles.pulse 
    : animation === 'wave' 
    ? styles.wave 
    : '';

  return (
    <div 
      className={`${styles.skeleton} ${styles[variant]} ${animationClass} ${className}`}
      style={{ 
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined
      }}
      {...rest}
    />
  );
};

interface SkeletonTextProps extends Omit<SkeletonProps, 'variant'> {
  lines?: number;
  lastLineWidth?: string | number;
}

export const SkeletonText = ({ 
  lines = 3, 
  height = 16,
  lastLineWidth = '75%',
  className = '',
  ...rest 
}: SkeletonTextProps) => {
  return (
    <div className={`${styles.textContainer} ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index}
          variant="text"
          height={height}
          width={index === lines - 1 && lastLineWidth ? lastLineWidth : '100%'}
          {...rest}
        />
      ))}
    </div>
  );
};

interface SkeletonCardProps extends Omit<SkeletonProps, 'variant'> {
  headerHeight?: string | number;
  contentLines?: number;
  footerHeight?: string | number;
}

export const SkeletonCard = ({
  width = '100%',
  height,
  headerHeight = 32,
  contentLines = 3,
  footerHeight = 24,
  className = '',
  ...rest
}: SkeletonCardProps) => {
  return (
    <div 
      className={`${styles.card} ${className}`}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto'
      }}
    >
      <Skeleton 
        variant="rectangular" 
        height={headerHeight} 
        className={styles.cardHeader}
        {...rest}
      />
      <div className={styles.cardContent}>
        <SkeletonText 
          lines={contentLines} 
          {...rest}
        />
      </div>
      <Skeleton 
        variant="rectangular" 
        height={footerHeight} 
        className={styles.cardFooter}
        {...rest}
      />
    </div>
  );
};
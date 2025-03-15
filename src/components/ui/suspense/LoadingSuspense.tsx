import { Suspense, ReactNode } from 'react';
import { SkeletonCard } from '@/components/ui/skeleton/Skeleton';
import styles from './LoadingSuspense.module.scss';

interface LoadingSuspenseProps {
  children: ReactNode;
  fallback?: ReactNode;
  type?: 'card' | 'table' | 'form' | 'page';
  count?: number;
}

export const LoadingSuspense = ({
  children,
  fallback,
  type = 'card',
  count = 3
}: LoadingSuspenseProps) => {
  // Se um fallback personalizado for fornecido, use-o
  if (fallback) {
    return <Suspense fallback={fallback}>{children}</Suspense>;
  }

  // Fallbacks padrão baseados no tipo
  let defaultFallback;

  switch (type) {
    case 'card':
      defaultFallback = (
        <div className={styles.cardGrid}>
          {Array.from({ length: count }).map((_, index) => (
            <SkeletonCard key={index} contentLines={3} />
          ))}
        </div>
      );
      break;
    case 'form':
      defaultFallback = (
        <div className={styles.form}>
          <div className={styles.formHeader}>
            <div className={styles.skeletonTitle} />
          </div>
          <div className={styles.formBody}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={styles.formField}>
                <div className={styles.skeletonLabel} />
                <div className={styles.skeletonInput} />
              </div>
            ))}
          </div>
          <div className={styles.formFooter}>
            <div className={styles.skeletonButton} />
          </div>
        </div>
      );
      break;
    case 'page':
      defaultFallback = (
        <div className={styles.page}>
          <div className={styles.pageHeader}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonSubtitle} />
          </div>
          <div className={styles.pageContent}>
            <div className={styles.cardGrid}>
              {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} contentLines={3} />
              ))}
            </div>
          </div>
        </div>
      );
      break;
    default:
      defaultFallback = <div className={styles.loading}>Carregando...</div>;
  }

  return <Suspense fallback={defaultFallback}>{children}</Suspense>;
};
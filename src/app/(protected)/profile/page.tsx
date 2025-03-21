import { Suspense } from 'react';
import { SkeletonCard } from '@/components/ui/skeleton/Skeleton';
import styles from './ProfilePage.module.scss';

export default function ProfilePage() {
    return (
        
        <Suspense fallback={
            <div className={styles.skeletonContainer}>
              <div className={styles.skeletonHeader}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonButton} />
              </div>
              <div className={styles.skeletonGrid}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} contentLines={3} />
                ))}
              </div>
            </div>
          }>
            <div>
           <h1>Página do perfil</h1>
        </div>
          </Suspense>
    );
}
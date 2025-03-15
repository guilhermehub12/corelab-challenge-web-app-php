'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header/Header';
import { Sidebar } from '@/components/layout/sidebar/Sidebar';
import { Container } from '@/components/layout/container/Container';
import styles from './MainLayout.module.scss';

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

export const MainLayout = ({ 
  children, 
  onSearch = () => {}
}: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className={styles.layout}>
      <Header 
        onSearch={onSearch} 
        onToggleSidebar={toggleSidebar} 
      />
      
      <div className={styles.mainContent}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <main className={styles.content}>
          <Container>
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};
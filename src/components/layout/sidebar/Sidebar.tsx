'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AccessControl } from '@/components/auth/AccessControl';
import styles from './Sidebar.module.scss';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  requiredProfile?: 'admin' | 'manager' | 'member';
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: 'Todas as Tarefas',
      path: '/tasks',
      icon: <TasksIcon />,
      requiredProfile: 'member',
    },
    {
      label: 'Favoritas',
      path: '/tasks/favorites',
      icon: <StarIcon />,
      requiredProfile: 'member',
    },
    {
      label: 'Usuários',
      path: '/users',
      icon: <UsersIcon />,
      requiredProfile: 'admin',
    },
    {
      label: 'Perfil',
      path: '/profile',
      icon: <ProfileIcon />,
      requiredProfile: 'member',
    },
  ];

  return (
    <>
      <div 
        className={`${styles.backdrop} ${isOpen ? styles.active : ''}`} 
        onClick={onClose}
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Menu</h2>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <AccessControl 
                key={item.path}
                requiredProfile={item.requiredProfile || 'member'}
              >
                <li className={styles.navItem}>
                  <Link
                    href={item.path}
                    className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
                    onClick={onClose}
                  >
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.label}>{item.label}</span>
                  </Link>
                </li>
              </AccessControl>
            ))}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <p>© 2025 CoreTasks</p>
        </div>
      </aside>
    </>
  );
};

// Icons Components
const TasksIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.74"></path>
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';
import { ThemeSwitch } from '@/components/ui/switch/ThemeSwitch';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import { Badge } from '@/components/ui/badge/Badge';
import { useNotification } from '@/hooks/useNotification';
import styles from './Header.module.scss';

interface HeaderProps {
    onSearch: (query: string) => void;
    onToggleSidebar: () => void;
}

interface ProfileObject {
    id: number;
    type: string;
}

export const Header = ({ onSearch, onToggleSidebar }: HeaderProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout } = useAuth();
    const { toggleSidebar } = useUI();
    const router = useRouter();
    const notification = useNotification();

    // Helper para obter o tipo de perfil
    const getProfileType = (profile: string | ProfileObject | undefined): string => {
        if (!profile) return '';
        if (typeof profile === 'string') return profile;
        return profile.type || '';
    };

    // Detectar scroll para aplicar shadow no header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleLogout = async () => {
        try {
            await logout();
            notification.success('Logout realizado com sucesso');
            router.push('/login');
        } catch {
            notification.error('Erro ao fazer logout');
        }
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className={styles.headerContent}>
                <div className={styles.leftSection}>
                    <button
                        className={styles.menuButton}
                        onClick={() => {
                            toggleSidebar();
                            onToggleSidebar();
                        }}
                        aria-label="Toggle menu"
                    >
                        <span className={styles.menuIcon}></span>
                    </button>

                    <div className={styles.logo}>
                        <h1>CoreTasks</h1>
                    </div>
                </div>

                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <Input
                        placeholder="Pesquisar tarefas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        leftIcon={<SearchIcon />}
                    />
                </form>

                <div className={styles.rightSection}>
                    <ThemeSwitch />

                    <div className={styles.userInfo}>
                        <div className={styles.userName}>
                            {user?.name}
                            {user?.profile && (
                                <Badge
                                    variant={getUserProfileBadgeVariant(
                                        getProfileType(user.profile)
                                    )}
                                    size="sm"
                                    rounded
                                    className={styles.userBadge}
                                >
                                    {formatUserRole(getProfileType(user.profile))}
                                </Badge>
                            )}
                        </div>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleLogout}
                    >
                        Sair
                    </Button>
                </div>
            </div>
        </header>
    );
};

// Funções e componentes auxiliares
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const formatUserRole = (profile: string): string => {
    if (!profile) return '';

    const roles: Record<string, string> = {
        admin: 'Admin',
        manager: 'Gerente',
        member: 'Membro'
    };
    return roles[profile] || profile;
};


const getUserProfileBadgeVariant = (profile?: string): 'primary' | 'success' | 'info' => {
    if (!profile) return 'info';
    
    const variants: Record<string, 'primary' | 'success' | 'info'> = {
        admin: 'primary',
        manager: 'success',
        member: 'info'
    };
    return variants[profile] || 'info';
};

import { ReactNode } from 'react';
import styles from './Alert.module.scss';

type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: ReactNode;
    icon?: ReactNode;
    onClose?: () => void;
    className?: string;
}

export const Alert = ({
    variant = 'info',
    title,
    children,
    icon,
    onClose,
    className = '',
}: AlertProps) => {
    return (
        <div className={`${styles.alert} ${styles[variant]} ${className}`}>
            {icon && <div className={styles.icon}>{icon}</div>}

            <div className={styles.content}>
                {title && <h4 className={styles.title}>{title}</h4>}
                <div className={styles.message}>{children}</div>
            </div>

            {onClose && (
                <button className={styles.closeButton} onClick={onClose} aria-label="Close alert">
                    <CloseIcon />
                </button>
            )}
        </div>
    );
};

// Ícones para as variantes de alerta
const SuccessIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);

const DangerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const SuccessAlert = (props: Omit<AlertProps, 'variant' | 'icon'>) => (
    <Alert {...props} variant="success" icon={<SuccessIcon />} />
);

export const WarningAlert = (props: Omit<AlertProps, 'variant' | 'icon'>) => (
    <Alert {...props} variant="warning" icon={<WarningIcon />} />
);

export const DangerAlert = (props: Omit<AlertProps, 'variant' | 'icon'>) => (
    <Alert {...props} variant="danger" icon={<DangerIcon />} />
);

export const InfoAlert = (props: Omit<AlertProps, 'variant' | 'icon'>) => (
    <Alert {...props} variant="info" icon={<InfoIcon />} />
);
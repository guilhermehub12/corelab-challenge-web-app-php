import { InputHTMLAttributes, forwardRef, useState, ReactNode } from 'react';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, fullWidth = false, className = '', type = 'text', ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    
    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };

    return (
      <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={`${styles.inputWrapper} ${error ? styles.error : ''}`}>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          
          <input
            ref={ref}
            type={isPasswordType ? (showPassword ? 'text' : 'password') : type}
            className={`
              ${styles.input}
              ${leftIcon ? styles.hasLeftIcon : ''}
              ${(rightIcon || isPasswordType) ? styles.hasRightIcon : ''}
            `}
            {...rest}
          />
          
          {isPasswordType && (
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={togglePasswordVisibility}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          )}
          
          {rightIcon && !isPasswordType && <span className={styles.rightIcon}>{rightIcon}</span>}
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
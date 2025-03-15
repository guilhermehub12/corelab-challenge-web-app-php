'use client';

import { useMemo } from 'react';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxButtons?: number;
  disabled?: boolean;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxButtons = 5,
  disabled = false
}: PaginationProps) => {
  // Gerar array de números de página para botões de paginação
  const pageNumbers = useMemo(() => {
    const totalButtons = Math.min(maxButtons, totalPages);
    const halfButtons = Math.floor(totalButtons / 2);
    
    let startPage = Math.max(1, currentPage - halfButtons);
    const endPage = Math.min(totalPages, startPage + totalButtons - 1);
    
    // Ajustar startPage se ficarmos sem páginas no final
    if (endPage - startPage + 1 < totalButtons) {
      startPage = Math.max(1, endPage - totalButtons + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [currentPage, totalPages, maxButtons]);

  const canPrevPage = currentPage > 1;
  const canNextPage = currentPage < totalPages;

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageButton}
        onClick={() => onPageChange(1)}
        disabled={!canPrevPage || disabled}
        aria-label="Primeira página"
      >
        <DoubleLeftIcon />
      </button>
      
      <button
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canPrevPage || disabled}
        aria-label="Página anterior"
      >
        <LeftIcon />
      </button>
      
      <div className={styles.pageNumbers}>
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            className={`${styles.pageButton} ${pageNum === currentPage ? styles.active : ''}`}
            onClick={() => onPageChange(pageNum)}
            disabled={disabled}
            aria-label={`Página ${pageNum}`}
            aria-current={pageNum === currentPage ? 'page' : undefined}
          >
            {pageNum}
          </button>
        ))}
      </div>
      
      <button
        className={styles.pageButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canNextPage || disabled}
        aria-label="Próxima página"
      >
        <RightIcon />
      </button>
      
      <button
        className={styles.pageButton}
        onClick={() => onPageChange(totalPages)}
        disabled={!canNextPage || disabled}
        aria-label="Última página"
      >
        <DoubleRightIcon />
      </button>
    </div>
  );
};

// Ícones
const LeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const RightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const DoubleLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="11 17 6 12 11 7"></polyline>
    <polyline points="18 17 13 12 18 7"></polyline>
  </svg>
);

const DoubleRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13 17 18 12 13 7"></polyline>
    <polyline points="6 17 11 12 6 7"></polyline>
  </svg>
);
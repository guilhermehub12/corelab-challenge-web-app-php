import { useState, useCallback, useMemo } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems: number;
  maxPageButtons?: number;
  onChange?: (page: number) => void;
}

export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  totalItems,
  maxPageButtons = 5,
  onChange,
}: UsePaginationOptions) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  const goToPage = useCallback((page: number) => {
    const targetPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(targetPage);
    onChange?.(targetPage);
  }, [totalPages, onChange]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  const changePageSize = useCallback((newSize: number) => {
    setPageSize(newSize);
    // Ajustar a página atual para evitar estar fora dos limites
    const newTotalPages = Math.max(1, Math.ceil(totalItems / newSize));
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
      onChange?.(newTotalPages);
    }
  }, [currentPage, totalItems, onChange]);

  // Calcular o intervalo de itens que estão sendo exibidos
  const itemRange = useMemo(() => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return { start, end };
  }, [currentPage, pageSize, totalItems]);

  // Gerar array de números de página para botões de paginação
  const pageNumbers = useMemo(() => {
    const totalButtons = Math.min(maxPageButtons, totalPages);
    const halfButtons = Math.floor(totalButtons / 2);
    
    let startPage = Math.max(1, currentPage - halfButtons);
    const endPage = Math.min(totalPages, startPage + totalButtons - 1);
    
    // Ajustar startPage se ficarmos sem páginas no final
    if (endPage - startPage + 1 < totalButtons) {
      startPage = Math.max(1, endPage - totalButtons + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [currentPage, totalPages, maxPageButtons]);

  return {
    currentPage,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changePageSize,
    canPrevPage: currentPage > 1,
    canNextPage: currentPage < totalPages,
    itemRange,
    pageNumbers,
  };
}
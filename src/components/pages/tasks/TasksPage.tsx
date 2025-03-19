'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTasks } from '@/context/TasksContext';
import { useToastContext } from '@/context/ToastContext';
import { TaskGrid } from '@/components/tasks/grid/TaskGrid';
import { MainLayout } from '@/app/(protected)/MainLayout';
import { AnimatedTransition } from '@/components/ui/animation/AnimatedTransition';
import { Button } from '@/components/ui/button/Button';
import { usePagination } from '@/hooks/usePagination';
import styles from './TasksPage.module.scss';

const TasksPage = () => {
  const { tasks, totalPages, loading, fetchTasks, error } = useTasks();
  const toast = useToastContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Memoizar a contagem total de itens
  const totalItems = useMemo(() => totalPages * 12, [totalPages]);

  // Usar o hook de paginação
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: 12,
    totalItems,
    onChange: (page) => {
      fetchTasks(page, searchQuery);
    }
  });

  // Carregar tarefas iniciais
  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  // Exibir erros como toast
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error, toast]);

  // Handler para pesquisa
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    
    fetchTasks(1, query)
      .finally(() => {
        setIsSearching(false);
      });
  }, [fetchTasks]);

  return (
    <MainLayout onSearch={handleSearch}>
      <AnimatedTransition show type="fade" duration={300}>
        <div className={styles.container}>
        {isSearching && (
            <div className={styles.searchingIndicator}>
              Buscando tarefas...
            </div>
          )}

          <TaskGrid 
            tasks={tasks} 
            title={searchQuery ? `Resultados para "${searchQuery}"` : "Minhas Tarefas"} 
            showCreateButton={true}
            isLoading={loading || isSearching} 
          />

          {/* Paginação */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <Button
                size="sm"
                variant="outline"
                onClick={pagination.firstPage}
                disabled={!pagination.canPrevPage || loading}
              >
                Primeira
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={pagination.prevPage}
                disabled={!pagination.canPrevPage || loading}
              >
                Anterior
              </Button>
              
              <div className={styles.pageNumbers}>
                {pagination.pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`${styles.pageButton} ${pageNum === pagination.currentPage ? styles.active : ''}`}
                    onClick={() => pagination.goToPage(pageNum)}
                    disabled={loading}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                onClick={pagination.nextPage}
                disabled={!pagination.canNextPage || loading}
              >
                Próxima
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={pagination.lastPage}
                disabled={!pagination.canNextPage || loading}
              >
                Última
              </Button>
            </div>
          )}
        </div>
      </AnimatedTransition>
    </MainLayout>
  );
};

export default TasksPage;
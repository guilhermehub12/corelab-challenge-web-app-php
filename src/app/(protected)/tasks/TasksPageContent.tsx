'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTasks } from '@/context/TasksContext';
import { useToastContext } from '@/context/ToastContext';
import { TaskGrid } from '@/components/tasks/grid/TaskGrid';
import { MainLayout } from '@/app/(protected)/MainLayout';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { ColorFilterSelector } from '@/components/tasks/filters/ColorFilterSelector';
import { AnimatedTransition } from '@/components/ui/animation/AnimatedTransition';
import styles from './TasksPage.module.scss';
import { Task } from '@/types/api';

export default function TasksPageContent() {
  const {
    tasks,
    colors,
    totalPages,
    currentPage,
    loading,
    error,
    fetchTasks,
    searchQuery,
    setSearchQuery
  } = useTasks();
  const toast = useToastContext();
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

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

  const [filteredResults, setFilteredResults] = useState<Task[]>([]);

  // Handler para pesquisa
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    fetchTasks(1, query);
  }, [fetchTasks, setSearchQuery]);

  // Handler para filtro de cor
  const handleColorFilter = useCallback((colorId: number | null) => {
    setSelectedColorId(colorId);

    // Se uma cor for selecionada, filtrar as tarefas pela cor
    if (colorId !== null) {
      const filteredTasks = tasks.filter(task => task.color_id === colorId);
      setFilteredResults(filteredTasks);
      console.log('Id da cor: ' + colorId);
      console.log('tarefas: ' + filteredTasks);
    } else {
      // Se nenhuma cor estiver selecionada, recarregar todas as tarefas
      setFilteredResults([]);
      fetchTasks(currentPage, searchQuery);
    }
  }, [currentPage, fetchTasks, searchQuery, tasks]);

  // Filtrar tarefas localmente por cor se um filtro estiver ativo
  const displayedTasks = selectedColorId !== null
    ? filteredResults
    : tasks;

  // Handler para paginação
  const handlePageChange = useCallback((page: number) => {
    fetchTasks(page, searchQuery);
  }, [fetchTasks, searchQuery]);

  return (
    <MainLayout onSearch={handleSearch}>
      <AnimatedTransition show type="fade" duration={300}>
        <div className={styles.container}>
          <div className={styles.filters}>
            <ColorFilterSelector
              colors={colors}
              selectedColorId={selectedColorId}
              onChange={handleColorFilter}
            />
          </div>

          <TaskGrid
            tasks={displayedTasks}
            title={searchQuery
              ? `Resultados para "${searchQuery}"${selectedColorId !== null ? ' (filtrado por cor)' : ''}`
              : selectedColorId !== null
                ? "Tarefas filtradas por cor"
                : "Minhas Tarefas"
            }
            showCreateButton={true}
          />

          {totalPages > 1 && !selectedColorId && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          )}
        </div>
      </AnimatedTransition>
    </MainLayout>
  );
}
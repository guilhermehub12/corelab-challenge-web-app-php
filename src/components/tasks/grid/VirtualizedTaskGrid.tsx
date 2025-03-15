'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { Task } from '@/types/api';
import { TaskCard } from '@/components/tasks/card/TaskCard';
import styles from './VirtualizedTaskGrid.module.scss';

interface VirtualizedTaskGridProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onToggleFavorite: (taskId: number) => void;
  onColorChange: (taskId: number, colorId: number) => void;
  itemsPerRow?: number;
  itemHeight?: number;
  containerHeight?: number;
}

export const VirtualizedTaskGrid = ({
  tasks,
  onEdit,
  onDelete,
  onToggleFavorite,
  onColorChange,
  itemsPerRow = 3, // Padrão, será ajustado com base no tamanho da tela
  itemHeight = 250, // Altura estimada de um card
  containerHeight = 600 // Altura do contêiner de visualização
}: VirtualizedTaskGridProps) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [actualItemsPerRow, setActualItemsPerRow] = useState(itemsPerRow);
  
  // Detectar número de itens por linha com base no tamanho da tela
  useEffect(() => {
    const updateItemsPerRow = () => {
      if (window.innerWidth < 576) {
        setActualItemsPerRow(1);
      } else if (window.innerWidth < 768) {
        setActualItemsPerRow(2);
      } else if (window.innerWidth < 992) {
        setActualItemsPerRow(3);
      } else {
        setActualItemsPerRow(4);
      }
    };
    
    updateItemsPerRow();
    window.addEventListener('resize', updateItemsPerRow);
    return () => window.removeEventListener('resize', updateItemsPerRow);
  }, []);

  // Calcular o número total de linhas
  const totalRows = Math.ceil(tasks.length / actualItemsPerRow);
  
  // Calcular a altura total da lista
  const totalHeight = totalRows * itemHeight;
  
  // Atualizar o intervalo visível durante a rolagem
  const updateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;
    
    const scrollTop = containerRef.current.scrollTop;
    const buffer = 2; // Adicionar linhas de buffer para rolagem suave
    
    const startRow = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const endRow = Math.min(
      totalRows - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
    );
    
    const start = startRow * actualItemsPerRow;
    const end = Math.min(tasks.length, (endRow + 1) * actualItemsPerRow);
    
    setVisibleRange({ start, end });
  }, [actualItemsPerRow, containerHeight, itemHeight, tasks.length, totalRows]);
  
  // Configurar o listener de rolagem
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    updateVisibleRange();
    container.addEventListener('scroll', updateVisibleRange);
    return () => container.removeEventListener('scroll', updateVisibleRange);
  }, [updateVisibleRange]);
  
  // Atualizar o intervalo visível quando o número de tarefas ou itens por linha mudar
  useEffect(() => {
    updateVisibleRange();
  }, [tasks.length, actualItemsPerRow, updateVisibleRange]);
  
  // Filtrar apenas as tarefas visíveis
  const visibleTasks = tasks.slice(visibleRange.start, visibleRange.end);

  return (
    <div 
      ref={containerRef}
      className={styles.container}
      style={{ height: containerHeight }}
    >
      <div 
        className={styles.content}
        style={{ height: totalHeight }}
      >
        <div 
          className={styles.itemsContainer}
          style={{ 
            transform: `translateY(${Math.floor(visibleRange.start / actualItemsPerRow) * itemHeight}px)` 
          }}
        >
          <div 
            className={styles.grid}
            style={{ 
              gridTemplateColumns: `repeat(${actualItemsPerRow}, 1fr)` 
            }}
          >
            {visibleTasks.map(task => (
              <div key={task.id} className={styles.gridItem}>
                <TaskCard
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                  onColorChange={onColorChange}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
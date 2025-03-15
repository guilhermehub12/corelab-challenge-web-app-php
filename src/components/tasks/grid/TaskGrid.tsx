'use client';

import { useState } from 'react';
import { Task } from '@/types/api';
import { TaskCard } from '@/components/tasks/card/TaskCard';
import { TaskForm } from '@/components/tasks/form/TaskForm';
import { useTasks } from '@/context/TasksContext';
import { useNotification } from '@/hooks/useNotification';
import { Modal } from '@/components/ui/modal/Modal';
import styles from './TaskGrid.module.scss';

interface TaskGridProps {
  tasks: Task[];
  title?: string;
  showCreateButton?: boolean;
}

export const TaskGrid = ({ 
  tasks, 
  title = 'Tarefas', 
  showCreateButton = true 
}: TaskGridProps) => {
  const { colors, createTask, updateTask, deleteTask, toggleFavorite, changeColor } = useTasks();
  const notification = useNotification();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers para manipulação de tarefas
  const handleCreateTask = async (title: string, content: string, colorId: number) => {
    setIsSubmitting(true);
    try {
      await createTask(title, content, colorId);
      notification.success('Tarefa criada com sucesso!');
      setIsCreateModalOpen(false);
    } catch (error) {
      notification.error('Erro ao criar tarefa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTask = async (title: string, content: string, colorId: number) => {
    if (!selectedTask) return;
    
    setIsSubmitting(true);
    try {
      await updateTask(selectedTask.id, title, content, colorId);
      notification.success('Tarefa atualizada com sucesso!');
      setIsEditModalOpen(false);
    } catch (error) {
      notification.error('Erro ao atualizar tarefa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    setIsSubmitting(true);
    try {
      await deleteTask(selectedTask.id);
      notification.success('Tarefa excluída com sucesso!');
      setIsDeleteModalOpen(false);
    } catch (error) {
      notification.error('Erro ao excluir tarefa.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async (taskId: number) => {
    try {
      const result = await toggleFavorite(taskId);
      notification.success(
        result 
          ? 'Tarefa adicionada aos favoritos!' 
          : 'Tarefa removida dos favoritos!'
      );
    } catch (error) {
      notification.error('Erro ao atualizar favoritos.');
    }
  };

  const handleColorChange = async (taskId: number, colorId: number) => {
    try {
      await changeColor(taskId, colorId);
    } catch (error) {
      notification.error('Erro ao alterar a cor.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        
        {showCreateButton && (
          <button 
            className={styles.createButton}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusIcon /> Nova Tarefa
          </button>
        )}
      </div>
      
      {tasks.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <EmptyIcon />
          </div>
          <h2>Nenhuma tarefa encontrada</h2>
          <p>Comece criando uma nova tarefa!</p>
          
          {showCreateButton && (
            <button 
              className={styles.createEmptyButton}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Criar Nova Tarefa
            </button>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {tasks.map(task => (
            <div key={task.id} className={styles.gridItem}>
              <TaskCard
                task={task}
                onEdit={(task) => {
                  setSelectedTask(task);
                  setIsEditModalOpen(true);
                }}
                onDelete={(taskId) => {
                  setSelectedTask(tasks.find(t => t.id === taskId) || null);
                  setIsDeleteModalOpen(true);
                }}
                onToggleFavorite={handleToggleFavorite}
                onColorChange={handleColorChange}
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Modal de Criação */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <TaskForm
          colors={colors}
          isLoading={isSubmitting}
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
      
      {/* Modal de Edição */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        {selectedTask && (
          <TaskForm
            task={selectedTask}
            colors={colors}
            isLoading={isSubmitting}
            onSubmit={handleEditTask}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>
      
      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className={styles.deleteConfirmation}>
          <h2>Excluir Tarefa</h2>
          <p>Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.</p>
          
          <div className={styles.deleteActions}>
            <button 
              className={styles.cancelButton}
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            
            <button 
              className={styles.deleteButton}
              onClick={handleDeleteTask}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Icon components
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EmptyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="9" x2="15" y2="9"></line>
    <line x1="9" y1="12" x2="15" y2="12"></line>
    <line x1="9" y1="15" x2="13" y2="15"></line>
  </svg>
);
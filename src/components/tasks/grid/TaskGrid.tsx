'use client';

import { useCallback } from 'react';
import { Task } from '@/types/api';
import { TaskCard } from '@/components/tasks/card/TaskCard';
import { TaskForm } from '@/components/tasks/form/TaskForm';
import { useTasks } from '@/context/TasksContext';
import { useNotification } from '@/hooks/useNotification';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/ui/modal/Modal';
import styles from './TaskGrid.module.scss';
import { useUIState } from '@/hooks/useUIState';

interface TaskGridProps {
  tasks: Task[];
  title?: string;
  showCreateButton?: boolean;
  isLoading?: boolean;
}

export const TaskGrid = ({
  tasks,
  title = 'Tarefas',
  showCreateButton = true,
  isLoading = false
}: TaskGridProps) => {
  const { colors, createTask, updateTask, deleteTask, toggleFavorite } = useTasks();
  const notification = useNotification();

  // Modais usando o hook useModal
  const createModal = useModal();
  const editModal = useModal();
  const deleteModal = useModal();

  // Estado de loading
  const { state: uiState, updateState } = useUIState({
    isSubmitting: false,
    selectedTask: null as Task | null
  });

  // Handlers para manipulação de tarefas
  const handleCreateTask = useCallback(async (title: string, content: string, colorId: number) => {
    updateState({ isSubmitting: true });
    try {
      await createTask(title, content, colorId);
      notification.success('Tarefa criada com sucesso!');
      createModal.close();
    } catch {
      notification.error('Erro ao criar tarefa.');
    } finally {
      updateState({ isSubmitting: false });
    }
  }, [createTask, notification, createModal, updateState]);

  const handleEditTask = useCallback(async (title: string, content: string, colorId: number) => {
    if (!uiState.selectedTask) return;

    updateState({ isSubmitting: true });
    try {
      await updateTask(uiState.selectedTask.id, title, content, colorId);
      notification.success('Tarefa atualizada com sucesso!');
      editModal.close();
    } catch {
      notification.error('Erro ao atualizar tarefa.');
    } finally {
      updateState({ isSubmitting: false });
    }
  }, [uiState.selectedTask, updateTask, notification, editModal, updateState]);

  const handleDeleteTask = useCallback(async () => {
    if (!uiState.selectedTask) return;

    updateState({ isSubmitting: true });
    try {
      await deleteTask(uiState.selectedTask.id);
      notification.success('Tarefa excluída com sucesso!');
      deleteModal.close();
    } catch {
      notification.error('Erro ao excluir tarefa.');
    } finally {
      updateState({ isSubmitting: false });
    }
  }, [uiState.selectedTask, deleteTask, notification, deleteModal, updateState]);

  const handleToggleFavorite = useCallback(async (taskId: number) => {
    try {
      const result = await toggleFavorite(taskId);
      notification.success(
        result
          ? 'Tarefa adicionada aos favoritos!'
          : 'Tarefa removida dos favoritos!'
      );
    } catch {
      notification.error('Erro ao atualizar favoritos.');
    }
  }, [toggleFavorite, notification]);

  // const handleColorChange = useCallback(async (taskId: number, colorId: number) => {
  //   try {
  //     await changeColor(taskId, colorId);
  //   } catch {
  //     notification.error('Erro ao alterar a cor.');
  //   }
  // }, [changeColor, notification]);

  // Abrir modal de edição
  const openEditModal = useCallback((task: Task) => {
    updateState({ selectedTask: task });
    editModal.open();
  }, [editModal, updateState]);

  // Abrir modal de exclusão
  const openDeleteModal = useCallback((taskId: number) => {
    const task = tasks.find(t => t.id === taskId) || null;
    updateState({ selectedTask: task });
    deleteModal.open();
  }, [tasks, deleteModal, updateState]);
  console.log(tasks);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>

        {showCreateButton && (
          <button
            className={styles.createButton}
            onClick={() => createModal.open()}
            disabled={isLoading}
          >
            <PlusIcon /> Nova Tarefa
          </button>
        )}
      </div>

      {isLoading && tasks.length === 0 ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando tarefas...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <EmptyIcon />
          </div>
          <h2>Nenhuma tarefa encontrada</h2>
          <p>Comece criando uma nova tarefa!</p>

          {showCreateButton && (
            <button
              className={styles.createEmptyButton}
              onClick={() => createModal.open()}
              disabled={isLoading}
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
                onEdit={openEditModal}
                onDelete={(taskId) => openDeleteModal(taskId)}
                onToggleFavorite={handleToggleFavorite}
              // onColorChange={handleColorChange}
              />
            </div>
          ))}
          {isLoading && tasks.length > 0 && (
            <div className={styles.overlayLoading}>
              <div className={styles.loadingSpinner}></div>
            </div>
          )}
        </div>

      )}

      {/* Modal de Criação */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
      >
        <TaskForm
          colors={colors}
          isLoading={uiState.isSubmitting}
          onSubmit={handleCreateTask}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Modal de Edição */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
      >
        {uiState.selectedTask && (
          <TaskForm
            task={uiState.selectedTask}
            colors={colors}
            isLoading={uiState.isSubmitting}
            onSubmit={handleEditTask}
            onCancel={editModal.close}
          />
        )}
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
      >
        <div className={styles.deleteConfirmation}>
          <h2>Excluir Tarefa</h2>
          <p>Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.</p>

          <div className={styles.deleteActions}>
            <button
              className={styles.cancelButton}
              onClick={deleteModal.close}
              disabled={uiState.isSubmitting}
            >
              Cancelar
            </button>

            <button
              className={styles.deleteButton}
              onClick={handleDeleteTask}
              disabled={uiState.isSubmitting}
            >
              {uiState.isSubmitting ? 'Excluindo...' : 'Excluir'}
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
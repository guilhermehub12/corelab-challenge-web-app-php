'use client';

import { memo, useEffect, useState } from 'react';
import { Task } from '@/types/api';
import { formatDate } from '@/utils/dateUtils';
import styles from './TaskCard.module.scss';
import { useTasks } from '@/context/TasksContext';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onToggleFavorite: (taskId: number) => void;
}

export const TaskCardComponent  = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleFavorite
}: TaskCardProps) => {
  const { colors, changeColor } = useTasks();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(task.is_favorited);

  useEffect(() => {
    setIsFavorited(task.is_favorited);
  }, [task.is_favorited]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
    onToggleFavorite(task.id);
  };

  const handleChangeColor = async (colorId: number) => {
    try {
      await changeColor(task.id, colorId);
      console.log('teste')
      // TODO adicionar notificações de sucesso
    } catch (error) {
      console.error('Erro ao alterar cor:', error);
      // TODO Notificação de erro
    }
    setIsColorPickerOpen(false);
    setIsMenuOpen(false);
  };



  return (
    <div 
      className={styles.card} 
      style={{ backgroundColor: task.color.hex_code }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        
        <div className={styles.actions}>
          <button 
            className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ''}`}
            onClick={handleToggleFavorite}
            aria-label={isFavorited ? "Remova dos favoritos" : "Adicione aos favoritos"}
          >
            <StarIcon filled={isFavorited} />
          </button>
          
          <button 
            className={styles.menuButton}
            onClick={toggleMenu}
            aria-label="Menu de tarefas"
          >
            <DotsIcon />
          </button>
          
          {isMenuOpen && (
            <div className={styles.menu}>
              <button 
                className={styles.menuItem}
                onClick={() => {
                  onEdit(task);
                  setIsMenuOpen(false);
                }}
              >
                <EditIcon /> Editar
              </button>
              
              <button 
                className={`${styles.menuItem} ${styles.danger}`}
                onClick={() => {
                  onDelete(task.id);
                  setIsMenuOpen(false);
                }}
              >
                <TrashIcon /> Excluir
              </button>

              <button 
                className={styles.menuItem}
                onClick={() => setIsColorPickerOpen(prev => !prev)}
              >
                <ColorIcon /> Cor
              </button>
            </div>
          )}

{isColorPickerOpen && (
            <div className={styles.colorPicker}>
              {colors.map(color => (
                <button 
                  key={color.id}
                  className={styles.colorOption}
                  style={{ backgroundColor: color.hex_code }}
                  onClick={() => handleChangeColor(color.id)}
                  title={`Cor ${color.name}`}
                >
                  {task.color_id === color.id ? '✓' : ''}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
      
      <div className={styles.content}>
        <p>{task.description}</p>
      </div>
      
      <div className={styles.footer}>
        <span className={styles.date}>
          Criado em {formatDate(task.created_at)}
        </span>
      </div>
    </div>
  );
};

// Memoização do componente para evitar re-renderizações desnecessárias
export const TaskCard = memo(TaskCardComponent, (prevProps, nextProps) => {
  // Comparação profunda para determinar se o componente deve re-renderizar
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.color_id === nextProps.task.color_id &&
    prevProps.task.is_favorited === nextProps.task.is_favorited
  );
});

// Icon components
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const DotsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const ColorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="12" cy="6" r="1.5" />
    <circle cx="16" cy="8" r="1.5" />
    <circle cx="8" cy="16" r="1.5" />
    <circle cx="12" cy="18" r="1.5" />
  </svg>
);
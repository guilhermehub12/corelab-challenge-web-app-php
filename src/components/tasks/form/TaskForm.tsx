'use client';

import { useState, useEffect } from 'react';
import { Task, TaskColor } from '@/types/api';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import { ColorPicker } from '@/components/ui/colorPicker/ColorPicker';
import styles from './TaskForm.module.scss';

interface TaskFormProps {
  task?: Task;
  colors: TaskColor[];
  isLoading: boolean;
  onSubmit: (title: string, content: string, colorId: number) => void;
  onCancel: () => void;
}

export const TaskForm = ({
  task,
  colors,
  isLoading,
  onSubmit,
  onCancel
}: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [colorId, setColorId] = useState<number>(1); // Default color ID
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  // Preencher o formulário se houver uma task para edição
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setContent(task.content);
      setColorId(task.color_id);
    } else {
      // Default color ID (blue) for new tasks
      const defaultColor = colors.find(c => c.name === 'blue') || colors[0];
      if (defaultColor) {
        setColorId(defaultColor.id);
      }
    }
  }, [task, colors]);

  const validate = (): boolean => {
    const newErrors: { title?: string; content?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'O título é obrigatório';
    }
    
    if (!content.trim()) {
      newErrors.content = 'O conteúdo é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit(title, content, colorId);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
        <div className={styles.colorPickerContainer}>
          <ColorPicker
            colors={colors}
            selectedColorId={colorId}
            onChange={setColorId}
          />
        </div>
      </div>
      
      <div className={styles.formGroup}>
        <Input
          label="Título"
          placeholder="Título da tarefa"
          value={title}
          onChange={e => setTitle(e.target.value)}
          error={errors.title}
          fullWidth
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.label}>
          Conteúdo
          {errors.content && <span className={styles.error}>{errors.content}</span>}
        </label>
        <textarea
          className={`${styles.textarea} ${errors.content ? styles.hasError : ''}`}
          placeholder="Conteúdo da tarefa"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={5}
        />
      </div>
      
      <div className={styles.actions}>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {task ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
};
'use client';

import { useEffect } from 'react';
import { Task, TaskColor } from '@/types/api';
import { Button } from '@/components/ui/button/Button';
import { Input } from '@/components/ui/input/Input';
import { ColorPicker } from '@/components/ui/colorPicker/ColorPicker';
import { useForm } from '@/hooks/useForm';
import { useValidator } from '@/hooks/useValidator';
import styles from './TaskForm.module.scss';

interface TaskFormValues {
  title: string;
  description: string;
  colorId: number;
  [key: string]: unknown;
}

interface TaskFormProps {
  task?: Task;
  colors: TaskColor[];
  isLoading: boolean;
  onSubmit: (title: string, description: string, colorId: number) => void;
  onCancel: () => void;
}

export const TaskForm = ({
  task,
  colors,
  isLoading,
  onSubmit,
  onCancel
}: TaskFormProps) => {
  // Definir valor inicial para cor (azul padrão ou a primeira cor disponível)
  const defaultColorId = colors.find(c => c.name === 'blue')?.id || colors[0]?.id || 1;

  // Validador para o formulário
  const { createValidator } = useValidator();
  const validator = createValidator<TaskFormValues>({
    title: {
      required: 'O título é obrigatório',
      maxLength: { value: 100, message: 'O título não pode ter mais de 100 caracteres' }
    },
    description: {
      required: 'O conteúdo é obrigatório',
    },
    colorId: {
      validate: [
        {
          test: (value) => !!colors.find(c => c.id === value),
          message: 'Selecione uma cor válida'
        }
      ]
    }
  });

  // Inicializar formulário
  const form = useForm<TaskFormValues>({
    initialValues: {
      title: task?.title || '',
      description: task?.description || '',
      colorId: task?.color_id || defaultColorId,
    },
    validate: validator,
    onSubmit: (values) => {
      onSubmit(values.title, values.description, values.colorId);
    }
  });

  // Atualizar formulário quando a task mudar
  useEffect(() => {
    if (task) {
      form.setValues({
        title: task.title,
        description: task.description,
        colorId: task.color_id,
      });
    }
  }, [task, form]);

  return (
    <form className={styles.form} onSubmit={form.handleSubmit}>
      <div className={styles.header}>
        <h2>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
        <div className={styles.colorPickerContainer}>
          <ColorPicker
            colors={colors}
            selectedColorId={form.values.colorId}
            onChange={(colorId) => form.setFieldValue('colorId', colorId)}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <Input
          label="Título"
          name="title"
          placeholder="Título da tarefa"
          value={form.values.title}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.touched.title ? form.errors.title : undefined}
          fullWidth
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Conteúdo
          {form.touched.description && form.errors.description && (
            <span className={styles.error}>{form.errors.description}</span>
          )}
        </label>
        <textarea
          name="description"
          className={`${styles.textarea} ${form.touched.description && form.errors.description ? styles.hasError : ''
            }`}
          placeholder="Conteúdo da tarefa"
          value={form.values.description}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
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
          isLoading={isLoading || form.isSubmitting}
          disabled={!form.isValid}
        >
          {task ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  );
};
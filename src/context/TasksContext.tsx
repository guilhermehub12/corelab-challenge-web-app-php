"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Task, TaskColor, ApiError } from '../types/api';
import { tasksService } from '../services/tasks.service';

interface TasksContextState {
  tasks: Task[];
  favorites: Task[];
  colors: TaskColor[];
  loading: boolean;
  error: ApiError | null;
  totalPages: number;
  currentPage: number;
}

interface TasksContextActions {
  fetchTasks: (page?: number, search?: string) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  createTask: (title: string, content: string, colorId?: number) => Promise<Task>;
  updateTask: (id: number, title?: string, content?: string, colorId?: number) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<boolean>;
  changeColor: (id: number, colorId: number) => Promise<Task>;
  clearError: () => void;
  refreshTasks: () => Promise<void>;
}

type TasksContextType = TasksContextState & TasksContextActions;

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TasksContextState>({
    tasks: [],
    favorites: [],
    colors: [],
    loading: true,
    error: null,
    totalPages: 1,
    currentPage: 1
  });

  // Funções utilitárias para atualizar o estado imutavelmente
  const setStateValue = <K extends keyof TasksContextState>(key: K, value: TasksContextState[K]) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const clearError = useCallback(() => {
    setStateValue('error', null);
  }, []);

  // Carregar cores disponíveis
  useEffect(() => {
    const loadColors = async () => {
      try {
        const { data } = await tasksService.getColors();
        setStateValue('colors', data);
      } catch (err) {
        console.error('Error loading colors:', err);
      }
    };

    loadColors();
  }, []);

  // Carregar tasks
  const fetchTasks = useCallback(async (page = 1, search?: string) => {
    setStateValue('loading', true);
    clearError();
    try {
      const response = await tasksService.getAllTasks(page, 10, search);
      setStateValue('tasks', response.data);
      setStateValue('totalPages', response.meta.last_page);
      setStateValue('currentPage', response.meta.current_page);
    } catch (err: any) {
      setStateValue('error', err);
    } finally {
      setStateValue('loading', false);
    }
  }, [clearError]);

  // Recarregar tasks atuais
  const refreshTasks = useCallback(async () => {
    return fetchTasks(state.currentPage);
  }, [fetchTasks, state.currentPage]);

  // Carregar favoritos
  const fetchFavorites = useCallback(async () => {
    try {
      const response = await tasksService.getFavorites();
      setStateValue('favorites', response.data);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  }, []);

  // Criar task
  const createTask = useCallback(async (title: string, content: string, colorId?: number): Promise<Task> => {
    setStateValue('loading', true);
    clearError();
    try {
      const response = await tasksService.createTask({ title, content, color_id: colorId });
      // Recarregar tasks após criar
      await refreshTasks();
      if (state.favorites.length > 0) {
        await fetchFavorites();
      }
      return response.data;
    } catch (err: any) {
      setStateValue('error', err);
      throw err;
    } finally {
      setStateValue('loading', false);
    }
  }, [clearError, fetchFavorites, refreshTasks, state.favorites.length]);

  // Atualizar task
  const updateTask = useCallback(async (id: number, title?: string, content?: string, colorId?: number): Promise<Task> => {
    setStateValue('loading', true);
    clearError();
    try {
      const response = await tasksService.updateTask(id, { title, content, color_id: colorId });
      
      // Atualizar o estado localmente para evitar nova requisição
      setStateValue('tasks', state.tasks.map(task => 
        task.id === id ? response.data : task
      ));
      
      setStateValue('favorites', state.favorites.map(task => 
        task.id === id ? response.data : task
      ));
      
      return response.data;
    } catch (err: any) {
      setStateValue('error', err);
      throw err;
    } finally {
      setStateValue('loading', false);
    }
  }, [clearError, state.favorites, state.tasks]);

  // Excluir task
  const deleteTask = useCallback(async (id: number): Promise<void> => {
    setStateValue('loading', true);
    clearError();
    try {
      await tasksService.deleteTask(id);
      // Atualizar estados
      setStateValue('tasks', state.tasks.filter(task => task.id !== id));
      setStateValue('favorites', state.favorites.filter(task => task.id !== id));
    } catch (err: any) {
      setStateValue('error', err);
      throw err;
    } finally {
      setStateValue('loading', false);
    }
  }, [clearError, state.favorites, state.tasks]);

  // Alternar favorito
  const toggleFavorite = useCallback(async (id: number): Promise<boolean> => {
    try {
      const { data } = await tasksService.toggleFavorite(id);
      
      // Atualizar o estado da task nos arrays
      setStateValue('tasks', state.tasks.map(task => 
        task.id === id ? { ...task, is_favorite: data.is_favorite } : task
      ));
      
      // Se tornou favorito, adiciona aos favoritos
      if (data.is_favorite) {
        const taskToAdd = state.tasks.find(task => task.id === id);
        if (taskToAdd && !state.favorites.some(task => task.id === id)) {
          setStateValue('favorites', [...state.favorites, { ...taskToAdd, is_favorite: true }]);
        }
      } else {
        // Se deixou de ser favorito, remove dos favoritos
        setStateValue('favorites', state.favorites.filter(task => task.id !== id));
      }
      
      return data.is_favorite;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      return false;
    }
  }, [state.favorites, state.tasks]);

  // Mudar cor da task
  const changeColor = useCallback(async (id: number, colorId: number): Promise<Task> => {
    try {
      const { data } = await tasksService.changeColor(id, colorId);
      
      // Atualizar estado
      setStateValue('tasks', state.tasks.map(task => 
        task.id === id ? data : task
      ));
      
      setStateValue('favorites', state.favorites.map(task => 
        task.id === id ? data : task
      ));
      
      return data;
    } catch (err) {
      console.error('Error changing color:', err);
      throw err;
    }
  }, [state.favorites, state.tasks]);

  return (
    <TasksContext.Provider value={{
      ...state,
      fetchTasks,
      fetchFavorites,
      createTask,
      updateTask,
      deleteTask,
      toggleFavorite,
      changeColor,
      clearError,
      refreshTasks
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks deve ser usado dentro de um TasksProvider');
  }
  return context;
};
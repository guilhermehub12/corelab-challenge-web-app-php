"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskColor } from '../types/api';
import { tasksService } from '../services/tasks.service';

interface TasksContextType {
  tasks: Task[];
  favorites: Task[];
  colors: TaskColor[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  fetchTasks: (page?: number) => Promise<void>;
  fetchFavorites: () => Promise<void>;
  createTask: (title: string, content: string, colorId?: number) => Promise<void>;
  updateTask: (id: number, title?: string, content?: string, colorId?: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
  changeColor: (id: number, colorId: number) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [favorites, setFavorites] = useState<Task[]>([]);
  const [colors, setColors] = useState<TaskColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Carregar cores disponíveis
  useEffect(() => {
    const loadColors = async () => {
      try {
        const { data } = await tasksService.getColors();
        setColors(data);
      } catch (err) {
        console.error('Error loading colors:', err);
      }
    };

    loadColors();
  }, []);

  // Carregar notas
  const fetchTasks = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tasksService.getAllTasks(page);
      setTasks(response.data);
      setTotalPages(response.meta.last_page);
      setCurrentPage(response.meta.current_page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar notas');
    } finally {
      setLoading(false);
    }
  };

  // Carregar favoritos
  const fetchFavorites = async () => {
    try {
      const response = await tasksService.getFavorites();
      setFavorites(response.data);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  // Criar nota
  const createTask = async (title: string, content: string, colorId?: number) => {
    setLoading(true);
    try {
      await tasksService.createTask({ title, content, color_id: colorId });
      // Recarregar notas após criar
      await fetchTasks(currentPage);
      if (favorites.length > 0) {
        await fetchFavorites();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar nota');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar nota
  const updateTask = async (id: number, title?: string, content?: string, colorId?: number) => {
    setLoading(true);
    try {
      await tasksService.updateTask(id, { title, content, color_id: colorId });
      // Atualizar estados
      setTasks(tasks.map(task => 
        task.id === id 
          ? { ...task, title: title || task.title, content: content || task.content, color_id: colorId || task.color_id } 
          : task
      ));
      setFavorites(favorites.map(task => 
        task.id === id 
          ? { ...task, title: title || task.title, content: content || task.content, color_id: colorId || task.color_id } 
          : task
      ));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar nota');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir nota
  const deleteTask = async (id: number) => {
    setLoading(true);
    try {
      await tasksService.deleteTask(id);
      // Atualizar estados
      setTasks(tasks.filter(task => task.id !== id));
      setFavorites(favorites.filter(task => task.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir nota');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Alternar favorito
  const toggleFavorite = async (id: number) => {
    try {
      const { data } = await tasksService.toggleFavorite(id);
      
      // Atualizar o estado da nota nos arrays
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, is_favorite: data.is_favorite } : task
      ));
      
      // Se tornou favorito, adiciona aos favoritos
      if (data.is_favorite) {
        const taskToAdd = tasks.find(task => task.id === id);
        if (taskToAdd && !favorites.some(task => task.id === id)) {
          setFavorites([...favorites, { ...taskToAdd, is_favorite: true }]);
        }
      } else {
        // Se deixou de ser favorito, remove dos favoritos
        setFavorites(favorites.filter(task => task.id !== id));
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  // Mudar cor da nota
  const changeColor = async (id: number, colorId: number) => {
    try {
      const { data } = await tasksService.changeColor(id, colorId);
      
      // Atualizar estado
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, color_id: colorId, color: data.color } : task
      ));
      setFavorites(favorites.map(task => 
        task.id === id ? { ...task, color_id: colorId, color: data.color } : task
      ));
    } catch (err) {
      console.error('Error changing color:', err);
    }
  };

  return (
    <TasksContext.Provider value={{
      tasks,
      favorites,
      colors,
      loading,
      error,
      totalPages,
      currentPage,
      fetchTasks,
      fetchFavorites,
      createTask,
      updateTask,
      deleteTask,
      toggleFavorite,
      changeColor
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
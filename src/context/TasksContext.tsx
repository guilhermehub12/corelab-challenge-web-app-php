'use client';

import { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { Task, TaskColor, ApiError } from '@/types/api';
import { tasksService } from '@/services/tasks.service';

// Tipos para o estado
interface TasksState {
  tasks: Task[];
  favorites: Task[];
  colors: TaskColor[];
  loading: boolean;
  error: ApiError | null;
  totalPages: number;
  currentPage: number;
  lastFetched: number | null;
  searchQuery: string;
}

// Tipos para as ações
type TasksAction =
  | { type: 'SET_TASKS'; payload: { tasks: Task[]; totalPages: number; currentPage: number } }
  | { type: 'SET_FAVORITES'; payload: Task[] }
  | { type: 'SET_COLORS'; payload: TaskColor[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'REMOVE_TASK'; payload: number }
  | { type: 'TOGGLE_FAVORITE'; payload: { id: number; isFavorite: boolean } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: ApiError | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'CLEAR_CACHE' };

// Estado inicial
const initialState: TasksState = {
  tasks: [],
  favorites: [],
  colors: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1,
  lastFetched: null,
  searchQuery: '',
};

// Reducer para gerenciar o estado
const tasksReducer = (state: TasksState, action: TasksAction): TasksState => {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload.tasks,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
        lastFetched: Date.now(),
      };
    case 'SET_FAVORITES':
      return {
        ...state,
        favorites: action.payload,
      };
    case 'SET_COLORS':
      return {
        ...state,
        colors: action.payload,
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
        favorites: state.favorites.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'REMOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        favorites: state.favorites.filter(task => task.id !== action.payload),
      };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, is_favorited: action.payload.isFavorite }
            : task
        ),
        favorites: action.payload.isFavorite
          ? [...state.favorites, state.tasks.find(task => task.id === action.payload.id)!]
          : state.favorites.filter(task => task.id !== action.payload.id),
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'CLEAR_CACHE':
      return {
        ...state,
        lastFetched: null,
      };
    default:
      return state;
  }
};

// Interface do contexto
interface TasksContextType {
  // State
  tasks: Task[];
  favorites: Task[];
  colors: TaskColor[];
  loading: boolean;
  error: ApiError | null;
  totalPages: number;
  currentPage: number;
  searchQuery: string;

  // Actions
  fetchTasks: (page?: number, search?: string, forceRefresh?: boolean) => Promise<void>;
  fetchFavorites: (forceRefresh?: boolean) => Promise<void>;
  createTask: (title: string, content: string, colorId?: number) => Promise<Task>;
  updateTask: (id: number, title?: string, content?: string, colorId?: number) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<boolean>;
  changeColor: (id: number, colorId: number) => Promise<Task>;
  clearError: () => void;
  setSearchQuery: (query: string) => void;
  clearCache: () => void;
}
// ...restante do código abaixo

// Criação do contexto
const TasksContext = createContext<TasksContextType | undefined>(undefined);

// Cache time em milissegundos (5 minutos)
const CACHE_TIME = 5 * 60 * 1000;

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  // Carregar cores disponíveis
  useEffect(() => {
    const loadColors = async () => {
      try {
        const { data } = await tasksService.getColors();
        dispatch({ type: 'SET_COLORS', payload: data });
        // Salvar no localStorage para uso offline
        localStorage.setItem('taskColors', JSON.stringify(data));
      } catch (err) {
        console.error('Error loading colors (debug em loadColors no TasksContext):', err);
        // Tentar carregar do localStorage
        const cachedColors = localStorage.getItem('taskColors');
        if (cachedColors) {
          dispatch({ type: 'SET_COLORS', payload: JSON.parse(cachedColors) });
        }
      }
    };

    loadColors();
  }, []);

  // Helper para verificar se o cache está válido
  const isCacheValid = useCallback((): boolean => {
    if (!state.lastFetched) return false;
    return Date.now() - state.lastFetched < CACHE_TIME;
  }, [state.lastFetched]);

  // Carregar tarefas
  const fetchTasks = useCallback(async (page = 1, search = '', forceRefresh = false): Promise<void> => {
    // Verificar se podemos usar cache
    if (!forceRefresh && isCacheValid() && page === state.currentPage && search === state.searchQuery) {
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    if (search !== state.searchQuery) {
      dispatch({ type: 'SET_SEARCH_QUERY', payload: search });
    }

    try {
      const response = await tasksService.getAllTasks(page, 12, search);
      dispatch({
        type: 'SET_TASKS',
        payload: {
          tasks: response.data,
          totalPages: response.meta.last_page,
          currentPage: response.meta.current_page
        }
      });

      // Salvar uma versão simplificada no localStorage para uso offline
      localStorage.setItem('cachedTasks', JSON.stringify({
        tasks: response.data,
        totalPages: response.meta.last_page,
        currentPage: response.meta.current_page,
        timestamp: Date.now(),
        searchQuery: search
      }));
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err });

      // Tentar carregar do localStorage em caso de erro
      const cachedTasksJSON = localStorage.getItem('cachedTasks');
      if (cachedTasksJSON) {
        try {
          const cachedData = JSON.parse(cachedTasksJSON);
          dispatch({
            type: 'SET_TASKS',
            payload: {
              tasks: cachedData.tasks,
              totalPages: cachedData.totalPages,
              currentPage: cachedData.currentPage
            }
          });
          dispatch({ type: 'SET_SEARCH_QUERY', payload: cachedData.searchQuery });
        } catch (e) {
          console.error('Error parsing cached tasks:', e);
        }
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentPage, state.searchQuery, isCacheValid]);

  // Carregar favoritos
  const fetchFavorites = useCallback(async (forceRefresh = false): Promise<void> => {
    // Se já temos favoritos e não é forçada a atualização, retornamos
    if (!forceRefresh && state.favorites.length > 0 && isCacheValid()) {
      return;
    }

    try {
      const response = await tasksService.getFavorites();
      dispatch({ type: 'SET_FAVORITES', payload: response.data });

      // Salvar no localStorage para uso offline
      localStorage.setItem('cachedFavorites', JSON.stringify({
        favorites: response.data,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error('Error loading favorites:', err);

      // Tentar carregar do localStorage em caso de erro
      const cachedFavoritesJSON = localStorage.getItem('cachedFavorites');
      if (cachedFavoritesJSON) {
        try {
          const cachedData = JSON.parse(cachedFavoritesJSON);
          dispatch({ type: 'SET_FAVORITES', payload: cachedData.favorites });
        } catch (e) {
          console.error('Error parsing cached favorites:', e);
        }
      }
    }
  }, [state.favorites.length, isCacheValid]);

  // Criar tarefa
  const createTask = useCallback(async (title: string, content: string, colorId?: number): Promise<Task> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await tasksService.createTask({ title, content, color_id: colorId });
      const newTask = response.data;

      dispatch({ type: 'ADD_TASK', payload: newTask });
      dispatch({ type: 'CLEAR_CACHE' });

      return newTask;
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Atualizar tarefa
  const updateTask = useCallback(async (id: number, title?: string, content?: string, colorId?: number): Promise<Task> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await tasksService.updateTask(id, { title, content, color_id: colorId });
      const updatedTask = response.data;

      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });

      return updatedTask;
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Excluir tarefa
  const deleteTask = useCallback(async (id: number): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await tasksService.deleteTask(id);
      dispatch({ type: 'REMOVE_TASK', payload: id });
    } catch (err: any) {
      dispatch({ type: 'SET_ERROR', payload: err });
      throw err;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Alternar favorito
  const toggleFavorite = useCallback(async (id: number): Promise<boolean> => {
    try {
      const { data } = await tasksService.toggleFavorite(id);
      const isTaskFavorited = data?.is_favorited ?? false;

      dispatch({
        type: 'TOGGLE_FAVORITE',
        payload: { id, isFavorite: isTaskFavorited }
      });

      return isTaskFavorited;
    } catch (err) {
      console.error('Erro alternando o favorito:', err);
      return false;
    }
  }, []);

  // Mudar cor da tarefa
  const changeColor = useCallback(async (id: number, colorId: number): Promise<Task> => {
    try {
      const { data } = await tasksService.changeColor(id, colorId);

      dispatch({ type: 'UPDATE_TASK', payload: data });

      return data;
    } catch (err) {
      console.error('Error changing color:', err);
      throw err;
    }
  }, []);

  // Limpar erros
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Definir query de pesquisa
  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  // Limpar cache
  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE' });
  }, []);

  return (
    <TasksContext.Provider value={{
      // State
      tasks: state.tasks,
      favorites: state.favorites,
      colors: state.colors,
      loading: state.loading,
      error: state.error,
      totalPages: state.totalPages,
      currentPage: state.currentPage,
      searchQuery: state.searchQuery,

      // Actions
      fetchTasks,
      fetchFavorites,
      createTask,
      updateTask,
      deleteTask,
      toggleFavorite,
      changeColor,
      clearError,
      setSearchQuery,
      clearCache
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
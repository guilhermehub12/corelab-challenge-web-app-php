'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';

// Tipos para o estado
interface UIState {
  isSidebarOpen: boolean;
  theme: 'light' | 'dark';
  isLoading: boolean;
  loadingMessage: string | null;
}

// Tipos para as ações
type UIAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'START_LOADING'; payload?: string }
  | { type: 'STOP_LOADING' };

// Estado inicial
const initialState: UIState = {
  isSidebarOpen: false,
  theme: 'light',
  isLoading: false,
  loadingMessage: null,
};

// Reducer para gerenciar os estados de forma mais previsível
const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };
    case 'SET_SIDEBAR':
      return {
        ...state,
        isSidebarOpen: action.payload,
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    case 'START_LOADING':
      return {
        ...state,
        isLoading: true,
        loadingMessage: action.payload || 'Carregando...',
      };
    case 'STOP_LOADING':
      return {
        ...state,
        isLoading: false,
        loadingMessage: null,
      };
    default:
      return state;
  }
};

// Tipo do contexto
interface UIContextType {
  state: UIState;
  toggleSidebar: () => void;
  setSidebar: (isOpen: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

// Criação do contexto
const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  // Actions
  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setSidebar = (isOpen: boolean) => {
    dispatch({ type: 'SET_SIDEBAR', payload: isOpen });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
    // Persistir tema no localStorage
    localStorage.setItem('theme', theme);
    // Aplicar classe ao documento para estilos CSS
    document.documentElement.setAttribute('data-theme', theme);
  };

  const startLoading = (message?: string) => {
    dispatch({ type: 'START_LOADING', payload: message });
  };

  const stopLoading = () => {
    dispatch({ type: 'STOP_LOADING' });
  };

  return (
    <UIContext.Provider
      value={{
        state,
        toggleSidebar,
        setSidebar,
        setTheme,
        startLoading,
        stopLoading,
      }}
    >
      {children}
      {/* Componente de Loading Global */}
      {state.isLoading && (
        <div className="global-loading-overlay">
          <div className="global-loading-spinner"></div>
          {state.loadingMessage && <p>{state.loadingMessage}</p>}
        </div>
      )}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
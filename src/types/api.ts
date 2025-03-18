// Usuário
export interface User {
    id: number;
    name: string;
    email: string;
    profile: 'admin' | 'manager' | 'member';
    created_at: string;
    updated_at: string;
  }
  
  // tarefa
  export interface Task {
    id: number;
    title: string;
    content: string;
    color_id: number;
    color: TaskColor;
    is_favorited: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
  }
  
  // Cor da tarefa
  export interface TaskColor {
    id: number;
    name: string;
    hex_code: string;
  }
  
  // Respostas da API
  export interface ApiResponse<T> {
    data: T;
    status: number;
    message?: string;
  }
  
  export interface ApiPaginatedResponse<T> {
    data: T[];
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
  }
  
  // Requisições
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }
  
  export interface CreateTaskRequest {
    title: string;
    content: string;
    color_id?: number;
  }
  
  export interface UpdateTaskRequest {
    title?: string;
    content?: string;
    color_id?: number;
  }

  // Erros
export interface ApiError {
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };

}
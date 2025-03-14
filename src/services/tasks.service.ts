import { ApiService } from './api.service';
import { 
  ApiPaginatedResponse, 
  ApiResponse, 
  Task, 
  CreateTaskRequest, 
  UpdateTaskRequest,
  TaskColor
} from '../types/api';

export class TasksService extends ApiService {
  constructor() {
    super('/tasks');
  }

  // Obter todas as notas (paginadas)
  async getAllTasks(page = 1): Promise<ApiPaginatedResponse<Task>> {
    return this.get<ApiPaginatedResponse<Task>>('', { page });
  }

  // Obter uma nota específica
  async getTask(id: number): Promise<ApiResponse<Task>> {
    return this.get<ApiResponse<Task>>(`/${id}`);
  }

  // Criar uma nova nota
  async createTask(task: CreateTaskRequest): Promise<ApiResponse<Task>> {
    return this.post<ApiResponse<Task>>('', task);
  }

  // Atualizar uma nota existente
  async updateTask(id: number, task: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    return this.put<ApiResponse<Task>>(`/${id}`, task);
  }

  // Excluir uma nota
  async deleteTask(id: number): Promise<ApiResponse<null>> {
    return this.delete<ApiResponse<null>>(`/${id}`);
  }

  // Obter notas favoritas
  async getFavorites(): Promise<ApiPaginatedResponse<Task>> {
    return this.get<ApiPaginatedResponse<Task>>('/favorites');
  }

  // Alternar status de favorito
  async toggleFavorite(id: number): Promise<ApiResponse<{ is_favorite: boolean }>> {
    return this.post<ApiResponse<{ is_favorite: boolean }>>(`/${id}/favorite`, {});
  }

  // Obter cores disponíveis
  async getColors(): Promise<ApiResponse<TaskColor[]>> {
    return this.get<ApiResponse<TaskColor[]>>('/colors');
  }

  // Alterar a cor de uma nota
  async changeColor(id: number, colorId: number): Promise<ApiResponse<Task>> {
    return this.put<ApiResponse<Task>>(`/${id}/color/${colorId}`, {});
  }
}

export const tasksService = new TasksService();
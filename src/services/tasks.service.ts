import { ApiService } from "./api.service";
import {
  ApiPaginatedResponse,
  ApiResponse,
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskColor,
} from "../types/api";

export class TasksService extends ApiService {
  constructor() {
    super("/tasks");
  }

  // Obter todas as tasks (paginadas)
  async getAllTasks(page = 1, perPage = 10, search?: string): Promise<ApiPaginatedResponse<Task>> {
    const params: Record<string, unknown> = { 
      page, 
      per_page: perPage 
    };
    if (search) params.search = search;
    return this.get<ApiPaginatedResponse<Task>>('', params);
  }
  

  // Obter uma tarefa específica
  async getTask(id: number): Promise<ApiResponse<Task>> {
    return this.get<ApiResponse<Task>>(`/${id}`);
  }

  // Criar uma nova tarefa
  async createTask(task: CreateTaskRequest): Promise<ApiResponse<Task>> {
    return this.post<ApiResponse<Task>>("", task);
  }

  // Atualizar uma tarefa existente
  async updateTask(
    id: number,
    task: UpdateTaskRequest
  ): Promise<ApiResponse<Task>> {
    return this.put<ApiResponse<Task>>(`/${id}`, task);
  }

  // Excluir uma tarefa
  async deleteTask(id: number): Promise<ApiResponse<null>> {
    return this.delete<ApiResponse<null>>(`/${id}`);
  }

  // Obter tarefas favoritas
  async getFavorites(
    page = 1,
    perPage = 10
  ): Promise<ApiPaginatedResponse<Task>> {
    return this.get<ApiPaginatedResponse<Task>>("/favorites", {
      page,
      per_page: perPage,
    });
  }

  // Alternar status de favorito
  async toggleFavorite(
    id: number
  ): Promise<ApiResponse<{ is_favorited: boolean }>> {
    return this.post<ApiResponse<{ is_favorited: boolean }>>(
      `/${id}/favorite`,
      {}
    );
  }

  // Obter cores disponíveis
  async getColors(): Promise<ApiResponse<TaskColor[]>> {
    return this.get<ApiResponse<TaskColor[]>>("/colors");
  }

  // Alterar a cor de uma tarefa
  async changeColor(id: number, colorId: number): Promise<ApiResponse<Task>> {
    return this.put<ApiResponse<Task>>(`/${id}/color/${colorId}`, {});
  }

  // Obter tasks por status
  async getTasksByStatus(
    status: string,
    page = 1,
    perPage = 10
  ): Promise<ApiPaginatedResponse<Task>> {
    return this.get<ApiPaginatedResponse<Task>>(`/status/${status}`, {
      page,
      per_page: perPage,
    });
  }
}

export const tasksService = new TasksService();

import { ApiService } from './api.service';
import { ApiResponse, LoginRequest, RegisterRequest, User } from '../types/api';

interface LoginResponse {
  user: User;
  token: string;
}

export class AuthService extends ApiService {
  constructor() {
    super('');
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>('/login', credentials);
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>('/register', userData);
  }

  async logout(): Promise<ApiResponse<null>> {
    return this.post<ApiResponse<null>>('/logout', {});
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<ApiResponse<User>>('/user');
  }
}

export const authService = new AuthService();
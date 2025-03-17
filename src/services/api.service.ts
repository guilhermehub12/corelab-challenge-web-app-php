import axios from '../lib/axios';

export class ApiService {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  protected async get<T>(path = '', params: Record<string, unknown> = {}): Promise<T> {
    const { data } = await axios.get<T>(`${this.endpoint}${path}`, { params });
    return data;
  }
  
  protected async post<T, D = Record<string, unknown>>(path = '', payload: D): Promise<T> {
    const { data } = await axios.post<T>(`${this.endpoint}${path}`, payload);
    return data;
  }

  protected async put<T, D = Record<string, unknown>>(path = '', payload: D): Promise<T> {
    const { data } = await axios.put<T>(`${this.endpoint}${path}`, payload);
    return data;
  }

  protected async delete<T>(path = ''): Promise<T> {
    const { data } = await axios.delete<T>(`${this.endpoint}${path}`);
    return data;
  }
}
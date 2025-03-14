import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError } from "../types/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para adicionar token de autenticação
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Obter token do localStorage
    const token = localStorage.getItem("token");

    // Adicionar token ao header se existir
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Adicionar o token de API (se especificado no .env)
    const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;
    if (apiToken && config.headers) {
      config.headers["X-API-TOKEN"] = apiToken;
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<never> => {
    const apiError: ApiError = {
      message: "Um erro ocorreu durante a requisição",
      status: error.response?.status,
    };

    if (error.response) {
      // Servidor retornou um código de status de erro
      const { status, data } = error.response;

      // Parse do erro da API
      if (data && typeof data === "object") {
        apiError.message = (data as any).message || apiError.message;
        apiError.errors = (data as any).errors;
      }

      // Lidar com erros específicos por código de status
      switch (status) {
        case 401:
          // Não autorizado
          localStorage.removeItem("token");
          window.location.href = "/login";
          apiError.message =
            "Sessão expirada. Por favor, faça login novamente.";
          break;
        case 403:
          // Proibido/Sem permissão
          apiError.message = "Você não tem permissão para realizar esta ação.";
          break;
        case 404:
          // Não encontrado
          apiError.message = "O recurso solicitado não foi encontrado.";
          break;
        case 422:
          // Erro de validação
          apiError.message = "Por favor, verifique os dados informados.";
          break;
        case 429:
          // Muitas requisições
          apiError.message =
            "Limite de requisições excedido. Tente novamente mais tarde.";
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          // Erros de servidor
          apiError.message =
            "Ocorreu um erro no servidor. Tente novamente mais tarde.";
          break;
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      apiError.message =
        "Não foi possível conectar-se ao servidor. Verifique sua conexão.";
    }

    // Log do erro para debugging (em desenvolvimento)
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", apiError);
    }

    return Promise.reject(apiError);
  }
);

export default axiosInstance;

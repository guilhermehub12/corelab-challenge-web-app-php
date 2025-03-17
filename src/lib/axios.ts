import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError } from "../types/api";
import { deleteCookie, getCookie } from 'cookies-next';

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 segundos de timeout
});

// Lista de rotas de autenticação que não devem redirecionar em caso de erro 401
const authRoutes = ["/login", "/register"];

// Interceptor para adicionar tokens
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Sempre adicionar o token da API em todas as requisições
    const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;
    if (apiToken && config.headers) {
      config.headers["X-API-TOKEN"] = apiToken;
    }

    // Adicionar token de autenticação do usuário apenas se existir
    if (typeof window !== "undefined") {
      const token = getCookie("token");
      console.log("Token enviado na requisição:", token);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
        apiError.message =
          (data as Record<string, unknown>).message?.toString() ||
          apiError.message;
        apiError.errors = (data as Record<string, unknown>).errors as
          | Record<string, string[]>
          | undefined;
      }

      // Verificar se estamos em uma rota de autenticação
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      const isAuthRoute = authRoutes.some((route) =>
        currentPath.startsWith(route)
      );

      // Lidar com erros específicos por código de status
      switch (status) {
        case 401:
          // Não autorizado - apenas redirecionar se NÃO estiver em uma rota de autenticação
          if (typeof window !== "undefined") {
            deleteCookie("token");

            // Não redirecionar para login se já estiver em uma rota de autenticação
            if (!isAuthRoute) {
              window.location.href = "/login";
            }
          }

          apiError.message =
            "Sessão expirada. Por favor, faça login novamente.";
          break;
        // Outros cases permanecem os mesmos...
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      apiError.message =
        "Não foi possível conectar-se ao servidor. Verifique sua conexão.";
    }

    // Log do erro para debugging (em desenvolvimento)
    if (process.env.NODE_ENV === "development") {
      console.error("API Erro:", {
        apiError,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        hasToken: typeof window !== "undefined" ? !!getCookie('token') : 'N/A'
      });
    }

    return Promise.reject(apiError);
  }
);

export default axiosInstance;

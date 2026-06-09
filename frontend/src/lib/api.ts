import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError, RefreshTokenResponse } from "@/types";

// ─── Constants ───────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const REQUEST_TIMEOUT = 30_000;
const TOKEN_KEY = "permitpal_access_token";
const REFRESH_TOKEN_KEY = "permitpal_refresh_token";

// ─── Token Management ────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ─── Axios Instance ──────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
});

// ─── Request Interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Refresh Token Queue ─────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
}

// ─── Response Interceptor ────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh on 401 and if we haven't already retried
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      window.dispatchEvent(new CustomEvent("auth:logout"));
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until refresh completes
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<RefreshTokenResponse>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        { timeout: REQUEST_TIMEOUT }
      );

      setTokens(data.accessToken, data.refreshToken);
      processQueue(null, data.accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      }

      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();
      window.dispatchEvent(new CustomEvent("auth:logout"));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// ─── Typed Helper Functions ──────────────────────────────────────────────────

export async function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function apiPost<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

export async function apiPut<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

export async function apiPatch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
}

export async function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

// ─── Error Extraction ────────────────────────────────────────────────────────

export function extractApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;
    if (apiError?.message) return apiError.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export function extractValidationErrors(
  error: unknown
): Record<string, string[]> | null {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;
    return apiError?.errors || null;
  }
  return null;
}

export default apiClient;

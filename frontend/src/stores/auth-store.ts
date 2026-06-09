import { create } from "zustand";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "@/types";
import {
  apiPost,
  clearTokens,
  extractApiError,
  getAccessToken,
  setTokens,
} from "@/lib/api";

// ─── JWT Payload Parsing ─────────────────────────────────────────────────────

interface JwtPayload {
  sub: string;
  email: string;
  given_name: string;
  family_name: string;
  role: string;
  org_id: string;
  org_name: string;
  exp: number;
  iat: number;
}

function parseJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload) return true;
  return Date.now() >= payload.exp * 1000;
}

function userFromPayload(payload: JwtPayload): User {
  return {
    id: payload.sub,
    email: payload.email,
    firstName: payload.given_name,
    lastName: payload.family_name,
    role: payload.role as User["role"],
    organisationId: payload.org_id,
    organisationName: payload.org_name,
    avatarUrl: null,
    isActive: true,
    lastLoginAt: null,
    createdAt: "",
    updatedAt: "",
  };
}

// ─── Store Interface ─────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
  clearError: () => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiPost<AuthResponse>("/auth/login", credentials);
      setTokens(response.accessToken, response.refreshToken);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: extractApiError(error),
      });
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiPost<AuthResponse>("/auth/register", data);
      setTokens(response.accessToken, response.refreshToken);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: extractApiError(error),
      });
      throw error;
    }
  },

  logout: () => {
    clearTokens();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  loadUser: () => {
    const token = getAccessToken();
    if (!token || isTokenExpired(token)) {
      clearTokens();
      set({ user: null, isAuthenticated: false });
      return;
    }

    const payload = parseJwt(token);
    if (!payload) {
      clearTokens();
      set({ user: null, isAuthenticated: false });
      return;
    }

    set({
      user: userFromPayload(payload),
      isAuthenticated: true,
    });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Listen for forced logout events (from API interceptor)
if (typeof window !== "undefined") {
  window.addEventListener("auth:logout", () => {
    useAuthStore.getState().logout();
  });
  
  // Initialize user state immediately to prevent redirect flickers
  useAuthStore.getState().loadUser();
}

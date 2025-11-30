import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';
import { LoginRequest } from '~/src/types/auth';

// Constantes
const TOKEN_KEY = 'hullzero_access_token';
const REFRESH_TOKEN_KEY = 'hullzero_refresh_token';
const USER_KEY = 'hullzero_user';
const REMEMBER_EMAIL_KEY = 'hullzero_remember_email';

// Tipos
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  employee_id?: string;
  department?: string;
  position?: string;
  roles: string[];
}

export interface PasswordChange {
  current_password: string;
  new_password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  rememberedEmail: string | null;

  // Actions
  login: (credentials: LoginRequest, options?: { rememberMe?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
  refreshAccessToken: () => Promise<string | null>;
  changePassword: (data: PasswordChange) => Promise<void>;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  loadRememberedEmail: () => Promise<void>;
  setError: (error: string | null) => void;
}

// Cliente API
const createApiClient = (): AxiosInstance => {
  return axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 10000
  });
};

export const useAuthStore = create<AuthState>((set, get) => {
  const apiClient = createApiClient();

  // Configurar interceptor para adicionar token automaticamente
  apiClient.interceptors.request.use(
    async (config) => {
      const token = get().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor para renovar token em caso de 401
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const newToken = await get().refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );

  return {
    user: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null,
    rememberedEmail: null,

    login: async (credentials: LoginRequest, options?: { rememberMe?: boolean }) => {
      set({ loading: true, error: null });

      try {
        const formData = new URLSearchParams();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);

        const response = await apiClient.post<TokenResponse>('/api/auth/login', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        const { access_token, refresh_token } = response.data;

        // Armazenar tokens
        await AsyncStorage.setItem(TOKEN_KEY, access_token);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);

        // Armazenar email se "Lembrar-me" estiver marcado
        if (options?.rememberMe) {
          await AsyncStorage.setItem(REMEMBER_EMAIL_KEY, credentials.email);
        } else {
          await AsyncStorage.removeItem(REMEMBER_EMAIL_KEY);
        }

        set({
          token: access_token,
          refreshToken: refresh_token,
          loading: false
        });

        // Buscar informações do usuário
        await get().getCurrentUser();
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || 'Erro ao fazer login';
        set({ error: errorMessage, loading: false });
        throw error;
      }
    },

    logout: async () => {
      try {
        await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
        set({
          user: null,
          token: null,
          refreshToken: null,
          error: null
        });
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    },

    getCurrentUser: async () => {
      try {
        const token = get().token;
        if (!token) return null;

        const response = await apiClient.get<User>('/api/auth/me');

        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data));
        set({ user: response.data });

        return response.data;
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        await get().logout();
        return null;
      }
    },

    refreshAccessToken: async () => {
      try {
        const refreshToken = get().refreshToken;
        if (!refreshToken) {
          await get().logout();
          return null;
        }

        const response = await apiClient.post<TokenResponse>('/api/auth/refresh', {
          refresh_token: refreshToken
        });

        const { access_token, refresh_token: new_refresh_token } = response.data;

        await AsyncStorage.setItem(TOKEN_KEY, access_token);
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, new_refresh_token);

        set({
          token: access_token,
          refreshToken: new_refresh_token
        });

        return access_token;
      } catch (error) {
        console.error('Erro ao renovar token:', error);
        await get().logout();
        return null;
      }
    },

    changePassword: async (data: PasswordChange) => {
      try {
        await apiClient.post('/api/auth/change-password', data);
      } catch (error: any) {
        const errorMessage = error.response?.data?.detail || 'Erro ao alterar senha';
        throw new Error(errorMessage);
      }
    },

    isAuthenticated: () => {
      return !!get().token;
    },

    hasRole: (role: string) => {
      const user = get().user;
      if (!user) return false;
      return user.roles.includes(role);
    },

    hasAnyRole: (roles: string[]) => {
      const user = get().user;
      if (!user) return false;
      return roles.some((role) => user.roles.includes(role));
    },

    loadRememberedEmail: async () => {
      try {
        const email = await AsyncStorage.getItem(REMEMBER_EMAIL_KEY);
        set({ rememberedEmail: email });
      } catch (error) {
        console.error('Erro ao carregar email lembrado:', error);
      }
    },

    setError: (error: string | null) => {
      set({ error });
    }
  };
});

// Função para carregar estado inicial do AsyncStorage
export const initializeAuth = async () => {
  try {
    const [token, refreshToken, userStr, rememberedEmail] = await AsyncStorage.multiGet([
      TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      USER_KEY,
      REMEMBER_EMAIL_KEY
    ]);

    const state = useAuthStore.getState();

    if (token[1]) {
      state.token = token[1];
    }

    if (refreshToken[1]) {
      state.refreshToken = refreshToken[1];
    }

    if (userStr[1]) {
      try {
        state.user = JSON.parse(userStr[1]);
      } catch (error) {
        console.error('Erro ao parsear usuário:', error);
      }
    }

    if (rememberedEmail[1]) {
      state.rememberedEmail = rememberedEmail[1];
    }
  } catch (error) {
    console.error('Erro ao inicializar autenticação:', error);
  }
};

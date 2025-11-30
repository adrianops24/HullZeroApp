import { create } from 'zustand';
import api from '~/src/services/api';
import {
  loginRequest,
  registerRequest,
  verifyToken,
  saveToken,
  saveUser,
  logout,
  loadSession,
  saveRememberedEmail,
  clearRememberedEmail,
  setRememberMeFlag
} from '~/src/services/auth';
import { handleApiError } from '~/src/services/error';
import { showErrorToast } from '~/src/lib/hooks/useNotificated';
import { RegisterRequest, LoginRequest } from '~/src/types/auth';
import { UserResponse } from '~/src/types/user';

type LoginOptions = { rememberMe?: boolean };
type RegisterOptions = { rememberMe?: boolean };

interface AuthStore {
  user: UserResponse | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  rememberedEmail: string | null;
  rememberMe: boolean;
  login(loginData: LoginRequest, options?: LoginOptions): Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  register(registerData: RegisterRequest, options?: RegisterOptions): Promise<void>;
  fetchUserProfile(): Promise<void>; // nova função
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  rememberedEmail: null,
  rememberMe: false,

  login: async (loginData: LoginRequest, options?: { rememberMe?: boolean }) => {
    set({ loading: true });
    try {
      const loginResponse = await loginRequest(loginData);
      const user = await verifyToken(loginResponse.accessToken);
      const { accessToken } = loginResponse;
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      const rememberMe = options?.rememberMe ?? false;
      set({ token: accessToken, user, loading: false, rememberMe });

      if (rememberMe) {
        await saveToken(accessToken);

        if (user) {
          await saveUser(user);
        }

        await setRememberMeFlag(true);
        await clearRememberedEmail();

        console.log('Login bem-sucedido', accessToken);
        return;
      }

      await setRememberMeFlag(false);
      await saveRememberedEmail(loginData.email);
    } catch (err) {
      const errors = handleApiError(err, { summary: 'Erro ao realizar o login' });
      errors.forEach((error) => {
        showErrorToast(error);
      });

      set({ loading: false });
      throw err;
    }
  },

  register: async (registerData: RegisterRequest, options?: { rememberMe?: boolean }) => {
    set({ loading: true });
    try {
      const user = await registerRequest(registerData);
      const { credentials } = registerData;

      const loginResponse = await loginRequest(credentials);
      const { accessToken } = loginResponse;

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      const rememberMe = options?.rememberMe ?? false;
      set({ token: accessToken, user, loading: false, rememberMe });

      if (rememberMe) {
        await saveToken(accessToken);

        if (user) {
          await saveUser(user);
        }

        await setRememberMeFlag(true);
        await clearRememberedEmail();

        console.log('Cadastro realizado com sucesso', accessToken);
        return;
      }

      await setRememberMeFlag(false);
      await saveRememberedEmail(credentials.email);
    } catch (err) {
      const errors = handleApiError(err, { summary: 'Erro ao realizar o cadastro' });
      errors.forEach((error) => {
        showErrorToast(error);
      });

      set({ loading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await logout();
      set({ token: null, user: null });
    } catch (err) {
      handleApiError(err, { summary: 'Erro ao realizar logout' });
      set({ token: null, user: null });
    }
  },

  loadSession: async () => {
    try {
      const session = await loadSession();

      if (session.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${session.token}`;
        set({ token: session.token, user: session.user, rememberMe: session.rememberMe, rememberedEmail: null });
        console.log('Sessão restaurada', session.token, session.user);
      } else {
        set({ rememberedEmail: session.rememberedEmail, rememberMe: session.rememberMe });
      }
    } catch (err) {
      handleApiError(err, { summary: 'Erro ao carregar a sessão' });
      set({ token: null, user: null, rememberedEmail: null, rememberMe: false });
    }
  },

  fetchUserProfile: async () => {
    const { token } = get();

    if (!token) {
      console.warn('Token não encontrado para buscar perfil do usuário');
      return;
    }

    set({ loading: true });

    try {
      // Chama o endpoint /auth/me
      const response = await api.get<UserResponse>('/auth/me');
      const user = response.data;
      set({ user, loading: false });

      // Salva o usuário atualizado se rememberMe estiver ativo
      const { rememberMe } = get();
      if (rememberMe && user) {
        await saveUser(user);
      }

      console.log('Perfil do usuário atualizado:', user);
    } catch (err) {
      const errors = handleApiError(err, { summary: 'Erro ao buscar perfil do usuário' });
      errors.forEach((error) => {
        showErrorToast(error);
      });

      set({ loading: false });

      const status = (err as any)?.response?.status;
      if (status === 401 || status === 403) {
        console.log('Token inválido, fazendo logout...');
        await get().logout();
      }

      throw err;
    }
  } // fim da função fetchUserProfile
}));

import api from './api';
import * as SecureStore from 'expo-secure-store';
import { LoginRequest, LoginResponse, RegisterRequest } from '~/src/types/auth';
import { UserResponse } from '~/src/types/user';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const REMEMBERED_EMAIL_KEY = 'rememberedEmail';
const REMEMBER_ME_FLAG_KEY = 'rememberMe';

export type SessionInformation = {
  token: string | null;
  user: UserResponse | null;
  rememberedEmail: string | null;
  rememberMe: boolean;
};

export const loginRequest = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('auth/login', credentials);
  return response.data;
};

export const registerRequest = async (registerData: RegisterRequest): Promise<UserResponse> => {
  const response = await api.post<UserResponse>('auth/register', registerData);
  return response.data;
};

export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const saveUser = async (user: UserResponse): Promise<void> => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const verifyToken = async (token: string): Promise<UserResponse | null> => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  //const response = await api.get<UserResponse>('/auth/me');
  //return response.data;

  return null;
};

export const logout = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
  delete api.defaults.headers.common['Authorization'];
};

export const saveRememberedEmail = async (email: string): Promise<void> => {
  await SecureStore.setItemAsync(REMEMBERED_EMAIL_KEY, email);
};

export const clearRememberedEmail = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(REMEMBERED_EMAIL_KEY);
};

export const getRememberedEmail = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(REMEMBERED_EMAIL_KEY);
  } catch {
    return null;
  }
};

export const setRememberMeFlag = async (remember: boolean): Promise<void> => {
  await SecureStore.setItemAsync(REMEMBER_ME_FLAG_KEY, remember ? 'true' : 'false');
};

export const getRememberMeFlag = async (): Promise<boolean> => {
  try {
    const flag = await SecureStore.getItemAsync(REMEMBER_ME_FLAG_KEY);
    return flag === 'true';
  } catch {
    return false;
  }
};

export const loadSession = async (): Promise<SessionInformation> => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userStr = await SecureStore.getItemAsync(USER_KEY);
    const rememberedEmail = await SecureStore.getItemAsync(REMEMBERED_EMAIL_KEY);
    const rememberMeStr = await SecureStore.getItemAsync(REMEMBER_ME_FLAG_KEY);
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user, rememberedEmail, rememberMe: rememberMeStr === 'true' };
  } catch (error) {
    console.log(error);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    return { token: null, user: null, rememberedEmail: null, rememberMe: false };
  }
};

export const clearPersistedSession = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch {
    /* ignore */
  }
};

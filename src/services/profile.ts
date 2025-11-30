import api from './api';
import { UserProfileResponse, UserResponse } from '~/src/types/user';

export type SessionInformation = {
  user: UserResponse | null;
};

export const getProfile = async (nickname: string): Promise<UserProfileResponse> => {
  const response = await api.get<UserProfileResponse>('auth/me', {
    params: { nickname }
  });
  return response.data;
};

import { create } from 'zustand';
import { getProfile } from '~/src/services/profile';
import { handleApiError } from '~/src/services/error';
import { showErrorToast } from '~/src/lib/hooks/useNotificated';
import { UserProfileResponse } from '~/src/types/user';

export const useProfileStore = create((set) => ({
  profile: null as UserProfileResponse | null,
  loading: false,
  error: null as string | null,

  fetchProfile: async (nickname: string) => {
    set({ loading: true, error: null });

    try {
      const profile = await getProfile(nickname);
      set({ profile, loading: false });
    } catch (err) {
      const errors = handleApiError(err, { summary: 'Erro ao carregar perfil' });
      errors.forEach((message) => showErrorToast(message));
      set({ loading: false, error: errors[0] ?? null });
    }
  },

  resetProfile: () => set({ profile: null, error: null }),

  setProfile: (profile: UserProfileResponse | null) => set({ profile })
}));

export type ProfileStoreState = ReturnType<typeof useProfileStore.getState>;

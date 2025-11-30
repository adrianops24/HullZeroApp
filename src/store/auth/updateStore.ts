import { useAuthStore } from '../auth/authStore';

// Exemplo de uso
const { fetchUserProfile } = useAuthStore();

// Buscar dados atualizados do usuário
const refreshProfile = async () => {
  try {
    await fetchUserProfile();
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
  }
};

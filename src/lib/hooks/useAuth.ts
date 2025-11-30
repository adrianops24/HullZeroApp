import { useAuthStore } from '~/src/store/auth/authStore';

export const useAuth = () => {
  const { user, token, loading, login, logout, getCurrentUser, hasRole, hasAnyRole, isAuthenticated } = useAuthStore();

  return {
    user,
    isAuthenticated: isAuthenticated(),
    isLoading: loading,
    login,
    logout,
    refreshUser: getCurrentUser,
    hasRole,
    hasAnyRole
  };
};

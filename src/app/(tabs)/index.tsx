import { useEffect } from 'react';
import { useRouter } from 'expo-router';

// Este arquivo era a splash dentro de (tabs). Agora redirecionamos para a rota correta.
export default function TabsIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Ao abrir a rota / (tabs), navegar para /home
    router.replace('/screens/auth');
  }, []);

  return null;
}

import '../../global.css';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { Checkbox } from 'expo-checkbox';
import { cssInterop } from 'nativewind';
import PagerView from 'react-native-pager-view';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore, initializeAuth } from '~/src/store/auth/authStore';

cssInterop(PagerView, {
  className: 'style'
});

cssInterop(Checkbox, {
  className: 'style'
});

SplashScreen.preventAutoHideAsync();

// Criar instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000 // 5 minutos
    }
  }
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'montserrat-regular': require('../assets/fonts/Montserrat-VariableFont_wght.ttf'),
    'WorkSans-regular': require('../assets/fonts/WorkSans-VariableFont_wght.ttf')
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // Inicializar autenticação ao carregar o app
    initializeAuth();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="screens" options={{ headerShown: false }} />

        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </QueryClientProvider>
  );
}

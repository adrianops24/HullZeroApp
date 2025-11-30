import '../../global.css';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { Checkbox } from 'expo-checkbox';
import { cssInterop } from 'nativewind';
import PagerView from 'react-native-pager-view';

cssInterop(PagerView, {
  className: 'style'
});

cssInterop(Checkbox, {
  className: 'style'
});

SplashScreen.preventAutoHideAsync();

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

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="screens" options={{ headerShown: false }} />

      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

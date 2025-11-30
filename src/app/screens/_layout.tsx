import { Stack, SplashScreen } from 'expo-router';
import { createNotifications } from 'react-native-notificated';
import { cssInterop } from 'nativewind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PagerView from 'react-native-pager-view';

const { NotificationsProvider } = createNotifications({
  notificationWidth: 320,

  duration: 3000,
  notificationPosition: 'top',
  isNotch: undefined,
  gestureConfig: { direction: 'y' }
});

cssInterop(PagerView, {
  className: 'style'
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationsProvider>
        <Stack>
          <Stack.Screen name="testsBody" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="splash" options={{ headerShown: false }} />
        </Stack>
      </NotificationsProvider>
    </GestureHandlerRootView>
  );
}

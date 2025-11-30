import { registerRootComponent } from 'expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNotifications } from 'react-native-notificated';
import { initializeAuth } from '~/src/store/auth/authStore';
import React, { useEffect } from 'react';
import RootLayout from '~/src/app/_layout'; // ajuste o caminho se precisar
function App() {
  useEffect(() => {
    initializeAuth();
  }, []);

  const { NotificationsProvider } = createNotifications({
    notificationWidth: 320,

    duration: 3000,
    notificationPosition: 'top',
    isNotch: undefined,
    gestureConfig: { direction: 'y' }
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationsProvider>
        <RootLayout />
      </NotificationsProvider>
    </GestureHandlerRootView>
  );
}

export default registerRootComponent(App);

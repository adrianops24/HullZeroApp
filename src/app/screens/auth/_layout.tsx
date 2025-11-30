import { Stack } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Checkbox } from 'expo-checkbox';

import PagerView from 'react-native-pager-view';

cssInterop(PagerView, {
  className: 'style'
});

cssInterop(Checkbox, {
  className: 'style'
});

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}

import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { display: 'none' }
      }}
    >
      <Tabs.Screen name="index" options={{}} />
      <Tabs.Screen
        name="onboarding"
        options={{
          animation: 'fade'
        }}
      />
    </Tabs>
  );
}

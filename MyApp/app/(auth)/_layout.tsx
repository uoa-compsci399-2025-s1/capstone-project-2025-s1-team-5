import { Tabs } from 'expo-router';
export default function Layout() {
  return (
    <Tabs>
      {/* <Tabs.Screen name="Home" options={{ headerShown: false }} /> */}
      <Tabs.Screen name="Modules" options={{ headerShown: false }} />
      <Tabs.Screen name="Forum" options={{ headerShown: false }} />
      <Tabs.Screen name="Profile" options={{ headerShown: false }} />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { UserProvider } from '@/app/contexts/UserContext';

export default function Layout() {
  return (
    <UserProvider>
      <Tabs>
        {/* <Tabs.Screen name="Home" options={{ headerShown: false }} /> */}
        <Tabs.Screen name="Modules" options={{ headerShown: false }} />
        <Tabs.Screen name="Forum" options={{ headerShown: false }} />
        <Tabs.Screen name="Profile" options={{ headerShown: false }} />
      </Tabs>
    </UserProvider>
    
  );
}

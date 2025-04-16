import { Tabs } from 'expo-router';
import { UserProvider } from '@/contexts/UserContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Layout() {
  return (
    <UserProvider>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => {
            if (route.name === 'Modules') {
              return (
                <MaterialIcons name="menu-book" size={size} color={color} />
              );
            } else if (route.name === 'Forum') {
              return (
                <MaterialIcons name="forum" size={size} color={color} />
              );
            } else if (route.name === 'Profile') {
              return (
                <MaterialIcons name={focused ? 'person' : 'person-outline'} size={size} color={color}/>
              );
            }
            return null;
          },
          tabBarActiveTintColor: '#00467f',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: {
            backgroundColor: '#f2f2f2',
            borderTopWidth: 1,
            borderTopColor: '#ccc',
            paddingBottom: 5, 
            height: 60,       
          },
          tabBarLabelStyle: {
            fontSize: 11,
          },
          tabBarIconStyle: {
            marginTop: 3, 
          },
          headerShown: false,
        })}
      >
        <Tabs.Screen name="Modules" />
        <Tabs.Screen name="Forum" />
        <Tabs.Screen name="Profile" />
      </Tabs>
    </UserProvider>
  );
}

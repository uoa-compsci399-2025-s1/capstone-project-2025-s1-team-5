import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'UoA Your Way',
          headerStyle: {
            backgroundColor: '#00467f',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
            color: '#ffffff',
          },
          headerTintColor: '#ffffff',
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: 'Sign Up',
          headerStyle: {
            backgroundColor: '#00467f',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
            color: '#ffffff',
          },
          headerTintColor: '#ffffff',
        }} 
      />
      <Stack.Screen 
        name="createprofile" 
        options={{ 
          title: 'Create Profile',
          headerStyle: {
            backgroundColor: '#00467f',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
            color: '#ffffff',
          },
          headerTintColor: '#ffffff',
        }} 
      />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

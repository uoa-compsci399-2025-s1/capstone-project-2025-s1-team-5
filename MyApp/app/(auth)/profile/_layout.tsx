import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Profile',
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
        name="changepassword" 
        options={{ 
          title: 'Change Password',
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
    </Stack>
  );
}

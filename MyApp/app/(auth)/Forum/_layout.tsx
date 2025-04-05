import { Stack } from 'expo-router';

export default function ForumLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Forum',
          headerStyle: {
            backgroundColor: '#00467f',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
            color: '#ffffff',
          },
        }} 
      />
    </Stack>
  );
}

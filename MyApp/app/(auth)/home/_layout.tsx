import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Home',
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

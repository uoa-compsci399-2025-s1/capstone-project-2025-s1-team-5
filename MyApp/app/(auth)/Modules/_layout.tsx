import { Stack } from 'expo-router';

export default function ModulesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Modules',
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
        name="module1" 
        options={{ 
          title: 'Get Set Up For Success',
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
        name="module2" 
        options={{ 
          title: 'Academic Preparedness for UoA',
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
        name="module3" 
        options={{ 
          title: 'Connect to the University & New Zealand',
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
        name="module4" 
        options={{ 
          title: 'Preparing for Departure',
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

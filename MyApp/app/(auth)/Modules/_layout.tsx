import { Stack } from 'expo-router';

export default function ModulesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Profile' }} />
      <Stack.Screen name="module1" options={{ title: 'Get Set Up For Success' }} />
      <Stack.Screen name="module2" options={{ title: 'Academic preparedness for UoA' }} />
      <Stack.Screen name="module3" options={{ title: 'Connect to the University & New Zealand' }} />
      <Stack.Screen name="module4" options={{ title: 'Preparing for Departure' }} />
    </Stack>
  );
}

import { Stack } from 'expo-router';
import StyledText from '@/components/StyledText';

export default function ModulesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#00467f' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Modules</StyledText>,
          headerTintColor: '#ffffff',
        }} 
      />
      <Stack.Screen 
        name="module1" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#00467f' },
          headerTitle: () => <StyledText type="subtitle" style={{ color: '#ffffff' }}>Get Set Up For Success</StyledText>,
          headerTintColor: '#ffffff',
        }} 
      />
      <Stack.Screen 
        name="module2" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#00467f' },
          headerTitle: () => <StyledText type="subtitle" style={{ color: '#ffffff' }}>Academic Preparedness for UoA</StyledText>,
          headerTintColor: '#ffffff',
        }} 
      />
      <Stack.Screen 
        name="module3" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#00467f' },
          headerTitle: () => <StyledText type="subtitle" style={{ color: '#ffffff' }}>Connect to the University & New Zealand</StyledText>,
          headerTintColor: '#ffffff',
        }} 
      />
      <Stack.Screen 
        name="module4" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#00467f' },
          headerTitle: () => <StyledText type="subtitle" style={{ color: '#ffffff' }}>Preparing for Departure</StyledText>,
          headerTintColor: '#ffffff',
        }} 
      />
    </Stack>
  );
}

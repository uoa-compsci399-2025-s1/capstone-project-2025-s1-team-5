import { Stack } from 'expo-router';
import StyledText from '@/components/StyledText';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#00467f' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Profile</StyledText>,
          headerTintColor: '#ffffff', 
        }} 
      />
      <Stack.Screen 
        name="changepassword" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#00467f' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Change Password</StyledText>,
          headerTintColor: '#ffffff', 
        }} 
      />
    </Stack>
  );
}

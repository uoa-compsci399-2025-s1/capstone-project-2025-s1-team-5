import { Stack } from 'expo-router';
import StyledText from '@/components/StyledText';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#00467f' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Home</StyledText>,
        }} 
      />
    </Stack>
  );
}

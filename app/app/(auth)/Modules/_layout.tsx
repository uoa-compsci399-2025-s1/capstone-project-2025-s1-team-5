import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import StyledText from '@/components/StyledText';

export default function ModulesLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#00467f' },
          headerTitle: () => <StyledText type="title" style={{ color: '#fff' }}>Modules</StyledText>,
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="[moduleNumber]" 
        options={{
          title: '',
          headerStyle: { backgroundColor: '#00467f' },
          headerTitle: () => {
            const params = useLocalSearchParams();
            const moduleTitles: Record<string, string> = {
              '1': 'Get Set Up For Success',
              '2': 'Academic Preparedness for UoA',
              '3': 'Connect to the University & New Zealand',
              '4': 'Preparing for Departure',
            };
            const title = moduleTitles[params.moduleNumber as string] ?? 'Module';
            return <StyledText type="subtitle" style={{ color: '#fff' }}>{title}</StyledText>;
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack>
  );
}

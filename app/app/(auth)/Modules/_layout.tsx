import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import StyledText from '@/components/StyledText';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function ModulesLayout() {
  const {theme} = useContext(ThemeContext);
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: theme.primary },
          headerTitle: () => <StyledText type="title" style={{ color: '#fff' }}>Modules</StyledText>,
          headerTintColor: '#fff',
        }} 
      />
      <Stack.Screen 
        name="[moduleNumber]" 
        options={{
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
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

import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';

const moduleTitles: Record<string, string> = {
  '1': 'Get Set Up For Success',
  '2': 'Academic Preparedness for UoA',
  '3': 'Connect to the University & New Zealand',
  '4': 'Preparing for Departure',
};

export default function ModulesLayout() {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#0c0c48' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerTitle: () => <StyledText type="title" style={{ color: '#fff' }}>Modules</StyledText>,
          headerStyle: { backgroundColor: theme.primary },
        }} 
      />
      <Stack.Screen 
        name="[moduleNumber]" 
        options={({ route }) => ({
          headerTitle: () => {
            const { moduleNumber } = route.params as { moduleNumber: string };
            return (
              <StyledText type="subtitle" style={{ color: '#fff' }}>
                {moduleTitles[moduleNumber] || `Module ${moduleNumber}`}
              </StyledText>
            );
          },
        })}
      />
    </Stack>
  );
}
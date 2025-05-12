import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';
import { moduleTitles, moduleSubmodules } from './modulescreen';

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
          headerTitle: () => (
            <StyledText type="title" style={{ color: '#fff' }}>
              Modules
            </StyledText>
          ),
          headerStyle: { backgroundColor: theme.primary },
        }} 
      />
      <Stack.Screen 
        name="[moduleNumber]" 
        options={({ route }) => {
          const { moduleNumber } = route.params as { moduleNumber: string };
          return {
            headerTitle: () => (
              <StyledText type="title" style={{ color: '#fff' }}>
                {moduleTitles[Number(moduleNumber)] || `Module ${moduleNumber}`}
              </StyledText>
            ),
          };
        }}
      />
      <Stack.Screen
        name="submodulescreen"
        options={({ route }) => {
          const { moduleNumber, submoduleNumber } = route.params as {
            moduleNumber: string;
            submoduleNumber: string;
          };
          const submoduleTitle =
            moduleSubmodules[Number(moduleNumber)]?.[Number(submoduleNumber)]?.title;
          return {
            headerTitle: () => (
              <StyledText type="title" style={{ color: '#fff' }}>
                {submoduleTitle || 'Submodule'}
              </StyledText>
            ),
          };
        }}
      />
    </Stack>
  );
}

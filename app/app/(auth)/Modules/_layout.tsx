import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import { moduleTitles, moduleSubmodules } from './modulescreen';

type ModuleRouteParams = {
  moduleNumber: string;
};

type SubmoduleRouteParams = {
  moduleNumber: string;
  submoduleNumber: string;
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
          headerTitle: 'Modules',
          headerStyle: { backgroundColor: theme.primary },
        }} 
      />
      <Stack.Screen 
        name="[moduleNumber]" 
        options={({ route }) => {
          const { moduleNumber } = route.params as ModuleRouteParams;
          return {
            headerTitle: moduleTitles[Number(moduleNumber)] || `Module ${moduleNumber}`,
            headerTitleContainerStyle: {
              left: 0,
              right: 0,
            },
          };
        }}
      />
      <Stack.Screen
        name="submodulescreen"
        options={({ route }) => {
          const { moduleNumber, submoduleNumber } = route.params as SubmoduleRouteParams;
          const submoduleTitle =
            moduleSubmodules[Number(moduleNumber)]?.[Number(submoduleNumber)]?.title;
          return {
            headerTitle: submoduleTitle || 'Submodule',
            headerTitleContainerStyle: {
              left: 0,
              right: 0,
            },
          };
        }}
      />
    </Stack>
  );
}
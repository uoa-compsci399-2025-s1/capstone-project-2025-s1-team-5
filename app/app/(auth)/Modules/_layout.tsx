// app/Modules/_layout.tsx
import React, { useContext } from 'react';
import { Stack, useLocalSearchParams} from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function ModulesLayout() {
  const { theme } = useContext(ThemeContext);

  const {
      moduleId,
      subsectionId,
      title: linkTitle  
    } = useLocalSearchParams<{
      moduleId?: string;
      subsectionId?: string;
      url?: string;
      title?: string;
    }>();

  const titleModules = 'Modules';
  const titleModule = moduleId ?? titleModules;
  const titleSubsection = subsectionId ?? titleModule;
  const titleLinkViewer = linkTitle ?? 'Resource';

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.primary },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
      }}
    >
      {/* index.tsx */}
      <Stack.Screen
        name="index"
        options={{ headerTitle: titleModules }}
      />

      {/* Modules/[moduleId]/index.tsx */}
      <Stack.Screen
        name="[moduleId]/index"
        options={{
          headerTitle: titleModule
        }}
      />

      {/* Modules/[moduleId]/[subsectionId].tsx */}
      <Stack.Screen
        name="[moduleId]/[subsectionId]"
        options={{
          headerTitle: titleSubsection
        }}
      />
    
      <Stack.Screen
          name="[moduleId]/LinkViewer"
          options={{
          headerTitle: titleLinkViewer
        }}
      />

    </Stack>
  );
}

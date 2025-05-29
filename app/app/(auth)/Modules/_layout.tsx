// app/Modules/_layout.tsx
import React, { useContext } from 'react';
import { Stack, useLocalSearchParams, useSegments } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function ModulesLayout() {
  const { theme } = useContext(ThemeContext);
  const segments = useSegments(); // ['Modules', moduleId?, subsectionId?]

  // 取路由参数
  const { moduleId, subsectionId } = useLocalSearchParams<{
    moduleId?: string;
    subsectionId?: string;
  }>();

  // 根据当前是哪一级页面，设置 headerTitle
  let headerTitle = 'Modules';
  if (segments.length === 2 && moduleId) {
    // /Modules/[moduleId]
    headerTitle = moduleId; 
  } else if (segments.length === 3 && subsectionId) {
    // /Modules/[moduleId]/[subsectionId]
    headerTitle = subsectionId;
  }

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
        options={{ headerTitle: 'Modules' }}
      />

      {/* Modules/[moduleId]/index.tsx */}
      <Stack.Screen
        name="[moduleId]/index"
        options={{
          headerTitle,
        }}
      />

      {/* Modules/[moduleId]/[subsectionId].tsx */}
      <Stack.Screen
        name="[moduleId]/[subsectionId]"
        options={{
          headerTitle,
        }}
      />
    
      <Stack.Screen
        name="[moduleId]/LinkViewer"
        options={{ headerTitle: 'Resource' }}   // 或 title param
      />

    </Stack>
  );
}

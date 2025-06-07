import React, { useContext } from 'react';
import { Stack } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function ModulesLayout() {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.primary },
        headerTintColor: '#fff',
        headerTitleAlign: 'left',
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerTitle: 'Modules' }}
      />
      <Stack.Screen
        name="[moduleId]/index"
        options={({ route }) => {
          const params = route.params as { title?: string };
          return {
            headerTitle: params?.title ?? 'Module',
          };
        }}
      />
      <Stack.Screen
        name="[moduleId]/[subsectionId]"
        options={({ route }) => {
          const params = route.params as { title?: string };
          return {
            headerTitle: params?.title ?? 'Subsection',
          };
        }}
      />
      <Stack.Screen
        name="[moduleId]/LinkViewer"
        options={({ route }) => {
          const params = route.params as { title?: string };
          return {
            headerTitle: params?.title ?? 'Resource',
          };
        }}
      />
      <Stack.Screen
        name="[moduleId]/QuizViewer"
        options={({ route }) => {
          const params = route.params as { title?: string };
          return {
            headerTitle: params?.title ?? 'Quiz',
          };
        }}
      />
    </Stack>
  );
}

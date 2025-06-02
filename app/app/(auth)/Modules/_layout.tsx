// // app/Modules/_layout.tsx
// import React, { useContext } from 'react';
// import { Stack, useLocalSearchParams} from 'expo-router';
// import { ThemeContext } from '@/contexts/ThemeContext';
//
// export default function ModulesLayout() {
//   const { theme } = useContext(ThemeContext);
//
//   const {
//       moduleId,
//       subsectionId,
//       title: linkTitle
//     } = useLocalSearchParams<{
//       moduleId?: string;
//       subsectionId?: string;
//       url?: string;
//       title?: string;
//     }>();
//
//   const titleModules = 'Modules';
//   const titleModule = moduleId ?? titleModules;
//   const titleSubsection = subsectionId ?? titleModule;
//   const titleLinkViewer = linkTitle ?? 'Resource';
//   const { quizId, title: quizTitle } = useLocalSearchParams<{ quizId?: string; title?: string }>();
//
//
//   return (
//     <Stack
//       screenOptions={{
//         headerStyle: { backgroundColor: theme.primary },
//         headerTintColor: '#fff',
//         headerTitleAlign: 'left',
//       }}
//     >
//       {/* index.tsx */}
//       <Stack.Screen
//         name="index"
//         options={{ headerTitle: titleModules }}
//       />
//
//       {/* Modules/[moduleId]/index.tsx */}
//       <Stack.Screen
//         name="[moduleId]/index"
//         options={{
//           headerTitle: titleModule
//         }}
//       />
//
//       {/* Modules/[moduleId]/[subsectionId].tsx */}
//       <Stack.Screen
//         name="[moduleId]/[subsectionId]"
//         options={{
//           headerTitle: titleSubsection
//         }}
//       />
//
//       <Stack.Screen
//           name="[moduleId]/LinkViewer"
//           options={{
//           headerTitle: titleLinkViewer
//         }}
//       />
//
//       <Stack.Screen
//         name="[moduleId]/QuizViewer"
//         options={{ headerTitle: quizTitle ?? 'Quiz' }}
//       />
//
//     </Stack>
//   );
// }

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
      {/* Modules/index.tsx */}
      <Stack.Screen
        name="index"
        options={{ headerTitle: 'Modules' }}
      />

      {/* Modules/[moduleId]/index.tsx */}
      <Stack.Screen
        name="[moduleId]/index"
        options={({ route }) => ({
          headerTitle: route.params?.title ?? 'Modules',
        })}
      />

      {/* Modules/[moduleId]/[subsectionId].tsx */}
      <Stack.Screen
        name="[moduleId]/[subsectionId]"
        options={({ route }) => ({
          headerTitle: route.params?.title ?? 'Subsection',
        })}
      />

      {/* Modules/[moduleId]/LinkViewer.tsx */}
      <Stack.Screen
        name="[moduleId]/LinkViewer"
        options={({ route }) => ({
          headerTitle: route.params?.title ?? 'Resource',
        })}
      />

      {/* Modules/[moduleId]/QuizViewer.tsx */}
      <Stack.Screen
        name="[moduleId]/QuizViewer"
        options={({ route }) => ({
          headerTitle: route.params?.title ?? 'Quiz',
        })}
      />
    </Stack>
  );
}

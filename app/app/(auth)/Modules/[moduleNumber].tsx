import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ModuleScreen from './modulescreen';
import { moduleTitles } from './modulescreen';

export default function ModuleNumberScreen() {
  const { moduleNumber } = useLocalSearchParams();
  const num = parseInt(moduleNumber as string, 10);
  const router = useRouter();

  return (
    <ModuleScreen 
      moduleNumber={num}
      onBack={() => router.back()}
    />
  );
}

ModuleNumberScreen.options = ({ route }: any) => {
  const { moduleNumber } = route.params;
  const num = parseInt(moduleNumber, 10);
  return {
    title: moduleTitles[num] || `Module ${num}`,
    headerBackTitle: 'Back',
  };
};
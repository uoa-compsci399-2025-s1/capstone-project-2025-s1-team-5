import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ModuleScreen from './modulescreen';
import { moduleTitles } from './modulescreen';

export default function ModuleNumberScreen() {
  return <ModuleScreen />;
}

ModuleNumberScreen.options = ({ route }: any) => {
  const { moduleNumber } = route.params;
  const num = parseInt(moduleNumber, 10);
  return {
    title: moduleTitles[num] || `Module ${num}`,
    headerBackTitle: 'Back',
  };
};
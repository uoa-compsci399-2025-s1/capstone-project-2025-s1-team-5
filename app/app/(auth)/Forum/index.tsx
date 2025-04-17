import React from 'react';
import { ScrollView } from 'react-native';
import QuizComponent from '@/components/Quiz'; 

export default function ForumScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <QuizComponent />
    </ScrollView>
  );
}

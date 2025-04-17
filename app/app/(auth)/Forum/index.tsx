import React from 'react';
import { ScrollView } from 'react-native';
import QuestionCard from '@/components/QuestionCard';

const sampleQuestion = {
  question: 'What is Kahu?',
  options: ['A bird', 'UoA App', 'A Owl', 'idk'],
  correctAnswer: 'UoA App',
};

export default function ForumScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <QuestionCard questionData={sampleQuestion} />
    </ScrollView>
  );
}

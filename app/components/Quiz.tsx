import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import QuestionCard from '@/components/QuestionCard';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

const sampleQuestions: Question[] = [
  {
    question: 'What is Kahu?',
    options: ['A Bird', 'UoA App', 'An Owl', 'IDK'],
    correctAnswer: 'UoA App',
  },
  {
    question: 'What is the capital of New Zealand?',
    options: ['Auckland', 'Wellington', 'Christchurch', 'Dunedin'],
    correctAnswer: 'Wellington',
  },
  {
    question: 'What does UoA stand for?',
    options: ['University of Auckland', 'University of Adelaide', 'University of Amsterdam', 'University of Atlanta'],
    correctAnswer: 'University of Auckland',
  },
  // questions, options and correctAnswer pulled from database
];

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false); 

  const handleAnswerChecked = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    setIsAnswerChecked(true); 
    setTimeout(() => moveToNextQuestion(), 1500);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setIsAnswerChecked(false); 
    } else {
      alert(`Quiz Finished! Your score is ${score} out of ${sampleQuestions.length}`);
    }
  };

  const progress = (currentQuestionIndex + 1) / sampleQuestions.length;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <ProgressBar progress={progress} color="#00467f" style={styles.progressBar} />
      
      <QuestionCard
        questionData={sampleQuestions[currentQuestionIndex]}
        onAnswerChecked={handleAnswerChecked}
        resetShowResult={!isAnswerChecked} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    marginBottom: 20,
  },
});

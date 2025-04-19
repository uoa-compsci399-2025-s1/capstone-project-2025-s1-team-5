import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';

import QuestionCard from '@/components/QuestionCard';
import StyledText from '@/components/StyledText';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

const sampleQuestions: Question[] = [
  {
    question: 'What is Kahu?',
    options: ['A Owl', 'UoA App', 'A Place', 'IDK'],
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
  {
    question: 'Which New Zealand city is the best?',
    options: ['Auckland', 'Tauranga', 'Otago', 'Christchurch'],
    correctAnswer: 'Auckland',
  },
];

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const handleAnswerChecked = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    setIsAnswerChecked(true);
    setTimeout(() => moveToNextQuestion(), 2000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setIsAnswerChecked(false);
    } else {
      setIsQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsAnswerChecked(false);
    setIsQuizFinished(false);
  };

  const progress = (currentQuestionIndex + 1) / sampleQuestions.length;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {!isQuizFinished ? (
        <>
          <ProgressBar progress={progress} color="#00467f" style={styles.progressBar} />
          <QuestionCard
            questionData={sampleQuestions[currentQuestionIndex]}
            onAnswerChecked={handleAnswerChecked}
            resetShowResult={!isAnswerChecked}
          />
        </>
      ) : (
        <View style={styles.resultContainer}>
          <StyledText type="title" style={styles.resultTitle}>Quiz Completed!</StyledText>
          <StyledText type="default" style={styles.resultText}>You scored {score} out of {sampleQuestions.length}.</StyledText>
          <TouchableOpacity style={styles.retakeButton} onPress={restartQuiz}>
            <StyledText type="boldLabel" style={styles.retakeButtonText}>Retake Quiz</StyledText>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  progressBar: {
    marginBottom: 20,
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 4,
    marginTop: 50,
  },
  resultTitle: {
    fontSize: 24,
    marginBottom: 12,
    color: '#00467f',
  },
  resultText: {
    fontSize: 18,
    marginBottom: 20,
  },
  retakeButton: {
    backgroundColor: '#00467f',
    paddingVertical: 12,
    borderRadius: 8,
    width: '60%',
  },
  retakeButtonText: {
    textAlign: 'center',
    color: '#ffffff',
  },
});

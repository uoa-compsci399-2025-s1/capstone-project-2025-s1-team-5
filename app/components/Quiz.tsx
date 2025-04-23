import React, { useState, useContext } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { ThemeContext } from '@/contexts/ThemeContext';
import QuestionCard from '@/components/QuestionCard';
import StyledText from '@/components/StyledText';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

const quizQuestions: Question[] = [
  {
    question: 'What is Kahu?',
    options: ['An Owl', 'UoA App', 'A place', 'IDK'],
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
    question: 'What is the best city in New Zealand?',
    options: ['Auckland', 'Tauranga', 'Otago', 'Christchurch'],
    correctAnswer: 'Auckland',
  },
];
  // need to pull questions, options and answers from the database
export default function Quiz() {
  const { theme } = useContext(ThemeContext); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [resetFlag, setResetFlag] = useState(false);

  const handleAnswerChecked = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    setIsAnswerChecked(true);

    setTimeout(() => {
      setResetFlag(true);
      setTimeout(() => {
        moveToNextQuestion();
        setResetFlag(false);
      }, 50);
    }, 2000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
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

  const progress = (currentQuestionIndex + 1) / quizQuestions.length;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {!isQuizFinished ? (
        <>
          <ProgressBar progress={progress} color={theme.primary} style={styles.progressBar} />
          <QuestionCard
            key={currentQuestionIndex}
            questionData={quizQuestions[currentQuestionIndex]}
            onAnswerChecked={handleAnswerChecked}
            resetShowResult={resetFlag}
          />
        </>
      ) : (
        <View style={[styles.resultContainer, { backgroundColor: theme.background }]}>
          <StyledText type="title" style={[styles.resultTitle, { color: theme.primary }]}>Quiz Completed!</StyledText>
          <StyledText type="default" style={[styles.resultText, { color: theme.text }]}>You scored {score} out of {quizQuestions.length}.</StyledText>
          <TouchableOpacity style={[styles.retakeButton, { backgroundColor: theme.primary }]} onPress={restartQuiz}>
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
    borderRadius: 16,
    elevation: 4,
    marginTop: 50,
  },
  resultTitle: {
    fontSize: 24,
    marginBottom: 12,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 20,
  },
  retakeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    width: '60%',
  },
  retakeButtonText: {
    textAlign: 'center',
    color: '#ffffff',
  },
});

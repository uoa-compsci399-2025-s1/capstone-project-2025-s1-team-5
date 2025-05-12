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

type UserAnswer = {
  selectedOption: string | null;
  showResult: boolean;
  isCorrect: boolean | null;
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

export default function Quiz() {
  const { theme } = useContext(ThemeContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(
    quizQuestions.map(() => ({
      selectedOption: null,
      showResult: false,
      isCorrect: null
    }))
  );

  const handleAnswerChecked = (isCorrect: boolean) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = {
        ...newAnswers[currentQuestionIndex],
        showResult: true,
        isCorrect
      };
      return newAnswers;
    });

    if (isCorrect && !userAnswers[currentQuestionIndex].showResult) {
      setScore(prev => prev + 1);
    }
  };

  const handleOptionSelect = (option: string) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = {
        ...newAnswers[currentQuestionIndex],
        selectedOption: option
      };
      return newAnswers;
    });
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

  const moveToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(i => i - 1);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers(
      quizQuestions.map(() => ({
        selectedOption: null,
        showResult: false,
        isCorrect: null
      }))
    );
    setIsQuizFinished(false);
  };

  const progress = (currentQuestionIndex + 1) / quizQuestions.length;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {!isQuizFinished ? (
        <>
          <ProgressBar progress={progress} color={theme.primary} style={styles.progressBar} />

          <QuestionCard
            questionData={quizQuestions[currentQuestionIndex]}
            onAnswerChecked={handleAnswerChecked}
            selectedOption={userAnswers[currentQuestionIndex].selectedOption}
            showResult={userAnswers[currentQuestionIndex].showResult}
            onOptionSelect={handleOptionSelect}
          />

          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: theme.primary, opacity: currentQuestionIndex === 0 ? 0.5 : 1 }]}
              onPress={moveToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <StyledText type="boldLabel" style={styles.navButtonText}>Back</StyledText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, { backgroundColor: theme.primary }]}
              onPress={moveToNextQuestion}
            >
              <StyledText type="boldLabel" style={styles.navButtonText}>
                {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish' : 'Next'}
              </StyledText>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={[styles.resultContainer, { backgroundColor: theme.background }]}>
          <StyledText type="title" style={[styles.resultTitle, { color: theme.primary }]}>Quiz Completed!</StyledText>
          <StyledText type="default" style={[styles.resultText, { color: theme.text }]}>
            You scored {score} out of {quizQuestions.length}.
          </StyledText>
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
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 16,
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
  },
});
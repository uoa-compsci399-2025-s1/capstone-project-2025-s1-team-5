import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import StyledText from '@/components/StyledText';
import { ThemeContext } from '@/contexts/ThemeContext';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type QuestionCardProps = {
  questionData: Question;
  onAnswerChecked: (isCorrect: boolean) => void;
  resetShowResult: boolean; 
};

const QuestionCard: React.FC<QuestionCardProps> = ({ questionData, onAnswerChecked, resetShowResult }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (resetShowResult) {
      setShowResult(false); 
      setSelectedOption(null); 
    }
  }, [resetShowResult]);

  const handleOptionPress = (option: string) => {
    setSelectedOption(option);
    setShowResult(false); 
  };

  const checkAnswer = () => {
    setShowResult(true); 
    onAnswerChecked(selectedOption === questionData.correctAnswer);
  };

  return (
    <View style={styles.card}>
      <StyledText type="title" style={styles.question}>{questionData.question}</StyledText>

      {questionData.options.map((option) => {
        const isSelected = selectedOption === option;
        const isRight = showResult && option === questionData.correctAnswer;
        const isWrong = showResult && isSelected && option !== questionData.correctAnswer;

        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              isSelected && styles.selectedOption,
              isRight && styles.correctOption,
              isWrong && styles.incorrectOption,
            ]}
            onPress={() => handleOptionPress(option)}
            disabled={showResult} 
          >
            <StyledText type="default" style={styles.optionText}>{option}</StyledText>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={[styles.checkButton, !selectedOption && styles.disabledButton]}
        onPress={checkAnswer}
        disabled={!selectedOption}
      >
        <StyledText type="boldLabel" style={styles.checkButtonText}>Check Your Answer</StyledText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  question: {
    marginBottom: 16,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  selectedOption: {
    backgroundColor: '#e0edff',
    borderColor: '#3399ff',
  },
  correctOption: {
    backgroundColor: '#ccffcc',
    borderColor: '#33cc33',
  },
  incorrectOption: {
    backgroundColor: '#ffd6d6',
    borderColor: '#ff4d4d',
  },
  optionText: {
    fontSize: 16,
  },
  checkButton: {
    marginTop: 16,
    backgroundColor: '#00467f',
    paddingVertical: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  checkButtonText: {
    textAlign: 'center',
    color: '#ffffff',
  },
});

export default QuestionCard;

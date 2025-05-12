import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { darkTheme } from '@/theme/theme';
import StyledText from '@/components/StyledText';

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type QuestionCardProps = {
  questionData: Question;
  onAnswerChecked: (isCorrect: boolean) => void;
  selectedOption: string | null;
  showResult: boolean;
  onOptionSelect: (option: string) => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  questionData, 
  onAnswerChecked, 
  selectedOption,
  showResult,
  onOptionSelect
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme.background === darkTheme.background;

  const handleOptionPress = (option: string) => {
    if (!showResult) {
      onOptionSelect(option);
    }
  };

  const checkAnswer = () => {
    if (selectedOption) {
      onAnswerChecked(selectedOption === questionData.correctAnswer);
    }
  };

  const dynamicStyles = StyleSheet.create({
    card: {
      backgroundColor: theme.background,
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
      color: theme.text,
    },
    optionButton: {
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.backgroundTertiary,
      marginBottom: 10,
      backgroundColor: theme.backgroundSecondary,
    },
    optionText: {
      fontSize: 16,
      color: theme.text,
    },
    specialStateText: {
      fontSize: 16,
      color: isDark ? '#212121' : undefined,
    },
    checkButton: {
      marginTop: 16,
      backgroundColor: theme.primary,
      paddingVertical: 12,
      borderRadius: 8,
    },
    disabledButton: {
      backgroundColor: theme.backgroundTertiary,
    },
    checkButtonText: {
      textAlign: 'center',
      color: '#ffffff',
    },
  });

  return (
    <View style={dynamicStyles.card}>
      <StyledText type="title" style={dynamicStyles.question}>{questionData.question}</StyledText>

      {questionData.options.map((option) => {
        const isSelected = selectedOption === option;
        const isRight = showResult && option === questionData.correctAnswer;
        const isWrong = showResult && isSelected && option !== questionData.correctAnswer;
        const isSpecialState = isSelected || isRight || isWrong;

        return (
          <TouchableOpacity
            key={option}
            style={[
              dynamicStyles.optionButton,
              isSelected && styles.selectedOption,
              isRight && styles.correctOption,
              isWrong && styles.incorrectOption,
            ]}
            onPress={() => handleOptionPress(option)}
            disabled={showResult} 
          >
            <StyledText 
              type="default" 
              style={isSpecialState ? dynamicStyles.specialStateText : dynamicStyles.optionText}
            >
              {option}
            </StyledText>
          </TouchableOpacity>
        );
      })}

      {!showResult && (
        <TouchableOpacity
          style={[dynamicStyles.checkButton, !selectedOption && dynamicStyles.disabledButton]}
          onPress={checkAnswer}
          disabled={!selectedOption}
        >
          <StyledText type="boldLabel" style={dynamicStyles.checkButtonText}>Check Your Answer</StyledText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default QuestionCard;
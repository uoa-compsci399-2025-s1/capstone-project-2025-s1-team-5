import React, { useEffect, useState, useContext } from 'react';
import {
  ScrollView,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ProgressBar } from 'react-native-paper';
import { ThemeContext } from '@/contexts/ThemeContext';

import QuestionCard from '@/components/QuestionCard';
import StyledText from '@/components/StyledText';
import SubmitButton from '@/components/SubmitButton';

import api from '@/app/lib/api';

type UserAnswer = {
  selectedOption: string | null;
  showResult:     boolean;
  isCorrect:      boolean | null;
};

export default function QuizViewer() {
  const { moduleId, quizId } = useLocalSearchParams<{ moduleId: string; quizId: string }>();
  const { theme } = useContext(ThemeContext);

  // 顶层 state
  const [quiz,         setQuiz]        = useState<any>(null);
  const [loading,      setLoading]     = useState(true);
  const [currentIndex, setCurrentIndex]= useState(0);
  const [userAnswers,  setUserAnswers] = useState<UserAnswer[]>([]);
  const [score,        setScore]       = useState(0);
  const [finished,     setFinished]    = useState(false);

  const resetQuiz = () => {
    if (!quiz) return;
    setCurrentIndex(0);
    setScore(0);
    setUserAnswers(
      quiz.questions.map(() => ({
        selectedOption: null,
        showResult:     false,
        isCorrect:      null
      }))
    );
    setFinished(false);
  };

  // 合并初始化：抓到数据的同时，一口气把所有 state 都打好
  useEffect(() => {
    if (!moduleId) return;

    setLoading(true);
    api.get<{ quizzes: any[] }>(`/modules/${moduleId}`)
      .then(res => {
        const found = res.data.quizzes.find(q => q.id === quizId) ?? null;
        setQuiz(found);

        if (found) {
          // 这里同时初始化所有和 quiz 相关的 state
          setCurrentIndex(0);
          setScore(0);
          setFinished(false);

          setUserAnswers(
            found.questions.map(() => ({
              selectedOption: null,
              showResult:     false,
              isCorrect:      null
            }))
          );
        } else {
          setUserAnswers([]); // 保底
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [moduleId, quizId]);

  // 渲染 guard：先把 loading、quiz、userAnswers 都过一遍
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }
  if (!quiz) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Quiz not found.</Text>
      </View>
    );
  }

  // 题都准备好了，才渲染答题流程
  if (finished) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.resultContainer}>
          <StyledText type="title" style={[styles.resultTitle, { color: theme.text }]}>
            Quiz Completed!
          </StyledText>
          <StyledText type="title" style={[styles.resultText, { color: theme.text }]}>
            You scored {score} out of {quiz.questions.length}.
          </StyledText>
          <SubmitButton text="Retake Quiz" onPress={resetQuiz}/>
        </View>
      </View>
    );
  }

  // 正常答题渲染
  const progress = (currentIndex + 1) / quiz.questions.length;

  const handleSelect = (opt: string) =>
    setUserAnswers(prev => {
      const copy = [...prev];
      copy[currentIndex].selectedOption = opt;
      return copy;
    });

  const handleCheck = () => {
    const isCorrect =
      userAnswers[currentIndex].selectedOption ===
      quiz.questions[currentIndex].correctAnswer;
    setUserAnswers(prev => {
      const copy = [...prev];
      copy[currentIndex].showResult = true;
      copy[currentIndex].isCorrect   = isCorrect;
      return copy;
    });
    if (isCorrect) setScore(s => s + 1);
  };

  const next = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setFinished(true);
    }
  };
  const back = () => currentIndex > 0 && setCurrentIndex(i => i - 1);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        style={{ flex: 1 }}
      >
        <ProgressBar
          progress={progress}
          color={theme.primary}
          style={{ marginTop: 12, marginBottom: 16, height: 12 }}
        />

        <QuestionCard
          questionData={quiz.questions[currentIndex]}
          selectedOption={userAnswers[currentIndex].selectedOption}
          showResult={userAnswers[currentIndex].showResult}
          onOptionSelect={handleSelect}
          onAnswerChecked={handleCheck}
        />

        <View style={styles.nav}>
          <TouchableOpacity
            disabled={currentIndex === 0}
            onPress={back}
            style={[
              styles.navBtn,
              { backgroundColor: theme.primary, opacity: currentIndex === 0 ? 0.5 : 1 }
            ]}
          >
            <StyledText type="boldLabel" style={styles.navButtonText}>Back</StyledText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={next}
            style={[styles.navBtn, { backgroundColor: theme.primary}]}
          >
            <StyledText type="boldLabel" style={styles.navButtonText}>
              {currentIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
            </StyledText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  nav:    { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  navBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 4},
  button: { padding: 12, borderRadius: 8, marginTop: 24 },
  navButtonText: {
    color: '#fff',
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 16,
    width: '100%',
  },
  resultTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 28, 
  },
  resultText: {
    fontSize: 20, 
    marginBottom: 24,
  },
});

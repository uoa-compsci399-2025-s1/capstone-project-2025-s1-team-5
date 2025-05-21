import React, { useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import StyledText from '@/components/StyledText';
import { moduleSubmodules } from './modulescreen';
import { ThemeContext } from '@/contexts/ThemeContext'; // Adjust if needed

export default function SubmoduleScreen() {
  const { moduleNumber, submoduleNumber } = useLocalSearchParams();
  const moduleIndex = Number(moduleNumber);
  const submoduleIndex = Number(submoduleNumber);
  const submodule = moduleSubmodules[moduleIndex]?.[submoduleIndex];

  const { theme } = useContext(ThemeContext);

  if (!submodule) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        <StyledText type="error">Submodule not found</StyledText>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <StyledText style={{ ...styles.content, color: theme.text }}>
        This is where content for "{submodule.title}" would go.
      </StyledText>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    lineHeight: 24,
  },
});
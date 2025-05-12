import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import StyledText from '@/components/StyledText';
import { moduleSubmodules } from './modulescreen';

export default function SubmoduleScreen() {
  const { moduleNumber, submoduleNumber } = useLocalSearchParams();
  const moduleIndex = Number(moduleNumber);
  const submoduleIndex = Number(submoduleNumber);
  const submodule = moduleSubmodules[moduleIndex]?.[submoduleIndex];

  if (!submodule) {
    return (
      <View style={styles.container}><StyledText type="error">Submodule not found</StyledText></View>
    );
  }

  return (
    <View style={styles.container}>
      <StyledText type="title">Module {moduleIndex}</StyledText>
      <StyledText type="subtitle" style={styles.subtitle}>{submodule.title}</StyledText>
      <StyledText type="default" style={styles.content}>This is where content for "{submodule.title}" would go.</StyledText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  content: {
    lineHeight: 24,
  },
});
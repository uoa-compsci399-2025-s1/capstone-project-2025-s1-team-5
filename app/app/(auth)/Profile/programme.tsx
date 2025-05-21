import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from '@/components/StyledText';

export default function ProgrammeScreen() {
  return (
    <View style={styles.container}>
      <StyledText type="title">Programme Name</StyledText>
      <StyledText type="subtitle" style={styles.subtitle}>Overview</StyledText>
      <StyledText type="default" style={styles.content}>
        This is where programme details and relevant information will be shown. 
      </StyledText>
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

import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from '@/components/StyledText';

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <StyledText type="title">Support</StyledText>
      <StyledText type="subtitle" style={styles.subtitle}>Need Help?</StyledText>
      <StyledText type="default" style={styles.content}>
        TBD
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

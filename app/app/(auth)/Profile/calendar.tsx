import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from '@/components/StyledText';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <StyledText type="subtitle" style={styles.subtitle}>Upcoming Events</StyledText>
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
    marginBottom: 16,
  },
  content: {
    lineHeight: 24,
  },
});

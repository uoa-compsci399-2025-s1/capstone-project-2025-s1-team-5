import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';

export default function CalendarScreen() {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StyledText type="subtitle" style={[styles.subtitle, { color: theme.text }]}>
        Upcoming Events
      </StyledText>
      <StyledText type="default" style={[styles.content, { color: theme.text }]}>
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

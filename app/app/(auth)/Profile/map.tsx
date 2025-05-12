import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from '@/components/StyledText';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <StyledText type="title">Map</StyledText>
      <StyledText type="subtitle" style={styles.subtitle}>Explore the Area</StyledText>
      <StyledText type="default" style={styles.content}>
        Campus Map
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

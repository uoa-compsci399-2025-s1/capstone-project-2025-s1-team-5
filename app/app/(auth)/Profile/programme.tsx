import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext'; 
import StyledText from '@/components/StyledText';
//programme name, header, information etc needs to be dynamic and implemented so it is able to be changed by the CMS
export default function ProgrammeScreen() {
  const { theme } = useContext(ThemeContext); 
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StyledText type="title" style={{ color: theme.text }}>
        Programme Name
      </StyledText>
      <StyledText type="subtitle" style={[styles.subtitle, { color: theme.text}]}>
        Overview
      </StyledText>
      <StyledText type="default" style={[styles.content, { color: theme.text }]}>
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

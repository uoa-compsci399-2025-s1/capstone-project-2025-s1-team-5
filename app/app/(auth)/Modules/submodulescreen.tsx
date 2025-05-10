import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import StyledText from '@/components/StyledText';
import { moduleSubmodules } from './modulescreen';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';

interface Props {
  moduleNumber: number;
  submoduleId: string;
}

const SubmoduleScreen: React.FC<Props> = ({ moduleNumber, submoduleId }) => {
  const { theme } = useContext(ThemeContext); 
  const router = useRouter();
  
  const submodule = moduleSubmodules[moduleNumber]?.find(
    (sub) => sub.id === submoduleId
  );

  if (!submodule) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StyledText type="title">Submodule not found.</StyledText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <StyledText type="title" style={[styles.backText, { color: theme.text }]}>
          ← Back to Module {moduleNumber}
        </StyledText>
      </TouchableOpacity>

      <StyledText type="title" style={styles.moduleTitle}>
        Module {moduleNumber}
      </StyledText>
      <StyledText type="subtitle" style={styles.submoduleTitle}>
        {submodule.title}
      </StyledText>
      
      <View style={styles.content}>
        <StyledText type="default">
          This is where content for "{submodule.title}" would go.
        </StyledText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
  },
  moduleTitle: {
    marginBottom: 8,
  },
  submoduleTitle: {
    marginBottom: 16,
  },
  content: {
    marginTop: 16,
  },
});

export default SubmoduleScreen;
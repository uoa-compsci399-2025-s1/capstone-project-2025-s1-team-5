import React from 'react';
import { View, StyleSheet } from 'react-native';
import StyledText from '@/components/StyledText';
import { moduleSubmodules } from './modulescreen';

interface Props {
  moduleNumber: number;
  submoduleNumber: number;
}

const SubmoduleScreen: React.FC<Props> = ({ moduleNumber, submoduleNumber }) => {
  const submodule = moduleSubmodules[moduleNumber]?.[submoduleNumber];

  if (!submodule) {
    return (
      <View style={styles.container}>
        <StyledText type="default">Submodule not found.</StyledText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StyledText type="title">Module {moduleNumber}</StyledText>
      <StyledText type="subtitle">{submodule.title}</StyledText>
      <StyledText type="default">This is where content for "{submodule.title}" would go.</StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});

export default SubmoduleScreen;

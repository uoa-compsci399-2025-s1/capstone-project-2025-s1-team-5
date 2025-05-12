import React, { useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { moduleSubmodules } from './modulescreen';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import StyledText from '@/components/StyledText';

const SubmoduleScreen: React.FC = () => {
  const { moduleNumber, submoduleNumber } = useLocalSearchParams();
  const navigation = useNavigation();

  const moduleIndex = Number(moduleNumber);
  const submoduleIndex = Number(submoduleNumber);

  const submodule = moduleSubmodules[moduleIndex]?.[submoduleIndex];

  useLayoutEffect(() => {
      if (submodule?.title) {
        navigation.setOptions({ title: submodule.title });
      } else {
        navigation.setOptions({ title: 'Submodule' });
      }
    }, [navigation, submodule]);

  if (!submodule) {
    return (
      <View style={styles.container}>
        <StyledText type="default">Submodule not found.</StyledText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StyledText type="title">Module {moduleIndex}</StyledText>
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
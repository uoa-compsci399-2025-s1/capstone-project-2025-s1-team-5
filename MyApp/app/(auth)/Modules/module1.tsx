import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SubModuleButton from '@/components/SubModuleButton';

export default function Module1Screen() {
  const handleSubmodulePress = (submoduleName: string) => {
    console.log(`Navigating to ${submoduleName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.moduleTitle}>Get Set Up For Success</Text>

      <SubModuleButton 
        title="Navigating your course" 
        onPress={() => handleSubmodulePress('Navigating your course')} 
        iconName="info" 
      />
      <SubModuleButton 
        title="Using Canvas" 
        onPress={() => handleSubmodulePress('Using Canvas')} 
        iconName="info" 
      />
      <SubModuleButton 
        title="Academic integrity" 
        onPress={() => handleSubmodulePress('Academic integrity')} 
        iconName="info" 
      />
      <SubModuleButton 
        title="Netiquette & code of conduct" 
        onPress={() => handleSubmodulePress('Netiquette & code of conduct')} 
        iconName="info" 
      />
      <SubModuleButton 
        title="Prepare for success quiz" 
        onPress={() => handleSubmodulePress('Prepare for success quiz')} 
        iconName="touch-app" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  moduleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20, 
  },
});

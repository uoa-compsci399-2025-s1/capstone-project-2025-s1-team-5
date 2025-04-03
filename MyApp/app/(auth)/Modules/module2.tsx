import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SubModuleButton from '@/components/SubModuleButton';

export default function Module2Screen() {
  const handleSubmodulePress = (submoduleName: string) => {
    console.log(`Navigating to ${submoduleName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.moduleTitle}>Academic preparedness for UoA</Text>

      <SubModuleButton 
        title="Academic skills"
        iconName="touch-app"
        onPress={() => handleSubmodulePress('Academic skills')} 
      />
      <SubModuleButton 
        title="Library & learning services"
        iconName="info"
        onPress={() => handleSubmodulePress('Library & learning services')} 
      />
      <SubModuleButton 
        title="Study tips"
        iconName="info"
        onPress={() => handleSubmodulePress('Study tips')} 
      />
      <SubModuleButton 
        title="Work life balance"
        iconName="info"
        onPress={() => handleSubmodulePress('Work life balance')} 
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

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SubModuleButton from '@/components/SubModuleButton'; 

export default function Module4Screen() {
  const handleSubmodulePress = (submoduleName: string) => {
    console.log(`Navigating to ${submoduleName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.moduleTitle}>Preparing for Departure</Text>

      <SubModuleButton 
        title="Life in Auckland" 
        iconName="info"
        onPress={() => handleSubmodulePress('Life in Auckland')} 
      />
      <SubModuleButton 
        title="Work rights & employment" 
        iconName="info"
        onPress={() => handleSubmodulePress('Work rights & employment')} 
      />
      <SubModuleButton 
        title="Intercultural communication" 
        iconName="info"
        onPress={() => handleSubmodulePress('Intercultural communication')} 
      />
      <SubModuleButton 
        title="Visas & insurance" 
        iconName="info"
        onPress={() => handleSubmodulePress('Visas & insurance')} 
      />
      <SubModuleButton 
        title="Biosecurity" 
        iconName="info"
        onPress={() => handleSubmodulePress('Biosecurity')} 
      />
      <SubModuleButton 
        title="Accommodation" 
        iconName="touch-app"
        onPress={() => handleSubmodulePress('Accommodation')} 
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

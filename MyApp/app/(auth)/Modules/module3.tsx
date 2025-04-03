import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SubModuleButton from '@/components/SubModuleButton'; 

export default function Module3Screen() {
  const handleSubmodulePress = (submoduleName: string) => {
    console.log(`Navigating to ${submoduleName}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.moduleTitle}>Connect to the University & New Zealand</Text>

      <SubModuleButton 
        title="Where to go for help" 
        iconName="info"
        onPress={() => handleSubmodulePress('Where to go for help')} 
      />
      <SubModuleButton 
        title="Meet the academics" 
        iconName="info"
        onPress={() => handleSubmodulePress('Meet the academics')} 
      />
      <SubModuleButton 
        title="Meet your student advisers" 
        iconName="info"
        onPress={() => handleSubmodulePress('Meet your student advisers')} 
      />
      <SubModuleButton 
        title="Introduction to Te Reo Maori" 
        iconName="touch-app"
        onPress={() => handleSubmodulePress('Introduction to Te Reo Maori')} 
      />
      <SubModuleButton 
        title="Forum" 
        iconName="touch-app"
        onPress={() => handleSubmodulePress('Forum')} 
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

import React from 'react';
import { View, StyleSheet } from 'react-native';
import SubModuleButton from '@/components/SubModuleButton';

interface Submodule {
  title: string;
  iconName: 'info' | 'touch-app'; 
}

const submoduleData: Submodule[] = [
  { title: "Navigating your course", iconName: "info" },
  { title: "Using Canvas", iconName: "info" },
  { title: "Academic integrity", iconName: "info" },
  { title: "Netiquette & code of conduct", iconName: "info" },
  { title: "Prepare for success quiz", iconName: "touch-app" },
];

export default function Module1Screen() {
  const handleSubmodulePress = (submoduleName: string) => {
    console.log(`Navigating to ${submoduleName}`);
  };

  return (
    <View style={styles.container}>
      {submoduleData.map((submodule, index) => (
        <SubModuleButton
          key={index}
          title={submodule.title}
          onPress={() => handleSubmodulePress(submodule.title)}
          iconName={submodule.iconName}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
});

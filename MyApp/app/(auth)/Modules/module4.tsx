import React from 'react';
import { View, StyleSheet } from 'react-native';
import SubModuleButton from '@/components/SubModuleButton';

interface Submodule {
  title: string;
  iconName: 'info' | 'touch-app';
}

const submoduleData: Submodule[] = [
  { title: "Life in Auckland", iconName: "info" },
  { title: "Work rights & employment", iconName: "info" },
  { title: "Intercultural communication", iconName: "info" },
  { title: "Visas & insurance", iconName: "info" },
  { title: "Biosecurity", iconName: "info" },
  { title: "Accommodation", iconName: "touch-app" },
];

export default function Module4Screen() {
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

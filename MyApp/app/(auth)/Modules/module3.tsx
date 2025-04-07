import React from 'react';
import { View, StyleSheet } from 'react-native';
import SubModuleButton from '@/components/SubModuleButton';

interface Submodule {
  title: string;
  iconName: 'info' | 'touch-app';
}

const submoduleData: Submodule[] = [
  { title: "Where to go for help", iconName: "info" },
  { title: "Meet the academics", iconName: "info" },
  { title: "Meet your student advisers", iconName: "info" },
  { title: "Introduction to Te Reo Maori", iconName: "touch-app" },
  { title: "Forum", iconName: "touch-app" },
];

export default function Module3Screen() {
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

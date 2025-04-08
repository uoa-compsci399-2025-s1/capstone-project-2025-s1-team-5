import React from 'react';
import { View, StyleSheet } from 'react-native';
import SubModuleButton from '@/components/SubModuleButton';

interface Submodule {
  title: string;
  iconName: 'info' | 'touch-app';
}

const submoduleData: Submodule[] = [
  { title: "Academic skills", iconName: "touch-app" },
  { title: "Library & learning services", iconName: "info" },
  { title: "Study tips", iconName: "info" },
  { title: "Work life balance", iconName: "info" },
];

export default function Module2Screen() {
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

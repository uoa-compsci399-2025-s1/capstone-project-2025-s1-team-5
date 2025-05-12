import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import { moduleTitles } from './modulescreen';
import ModuleButton from '@/components/ModuleButton';

type ModuleIconName = 'star' | 'school' | 'people' | 'flight';

const modules = [
  { moduleNumber: 1, title: moduleTitles[1], iconName: 'star' as ModuleIconName },
  { moduleNumber: 2, title: moduleTitles[2], iconName: 'school' as ModuleIconName },
  { moduleNumber: 3, title: moduleTitles[3], iconName: 'people' as ModuleIconName },
  { moduleNumber: 4, title: moduleTitles[4], iconName: 'flight' as ModuleIconName },
];

const DisplayModulesScreen = () => {
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  const handleModulePress = (moduleNumber: number) => {
    router.push(`/Modules/${moduleNumber}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme?.background || '#fff' }]}>
      {modules.map((module) => (
        <ModuleButton
          key={module.moduleNumber}
          title={module.title}
          onPress={() => handleModulePress(module.moduleNumber)}
          iconName={module.iconName}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

// If you don't need a title for the screen, simply remove or modify the options.
DisplayModulesScreen.options = {
  // You can either omit the title or change it based on your needs
  // title: 'All Modules',
};

export default DisplayModulesScreen;

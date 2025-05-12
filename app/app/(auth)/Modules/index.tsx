import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import ModuleButton from '@/components/ModuleButton';
import ModuleScreen from './modulescreen';
import { moduleTitles } from './modulescreen';

type ModuleIconName = 'star' | 'school' | 'people' | 'flight';

const modules = [
  { moduleNumber: 1, title: moduleTitles[1], iconName: 'star' as ModuleIconName },
  { moduleNumber: 2, title: moduleTitles[2], iconName: 'school' as ModuleIconName },
  { moduleNumber: 3, title: moduleTitles[3], iconName: 'people' as ModuleIconName },
  { moduleNumber: 4, title: moduleTitles[4], iconName: 'flight' as ModuleIconName },
];

const DisplayModulesScreen = () => {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const { theme } = useContext(ThemeContext);

  if (selectedModule !== null) {
    return (
      <ModuleScreen 
        moduleNumber={selectedModule}
        onBack={() => setSelectedModule(null)}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {modules.map((module) => (
        <ModuleButton
          key={module.moduleNumber}
          moduleNumber={module.moduleNumber}
          title={module.title}
          onPress={() => setSelectedModule(module.moduleNumber)}
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

DisplayModulesScreen.options = {
  title: 'All Modules',
};

export default DisplayModulesScreen;
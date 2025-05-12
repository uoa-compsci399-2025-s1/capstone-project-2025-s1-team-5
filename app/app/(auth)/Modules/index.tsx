import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';

import ModuleScreen from './modulescreen'; 
import ModuleButton from '@/components/ModuleButton';

const modules = [
  { moduleNumber: 1, title: "Get Set Up For Success", iconName: "star" as const },
  { moduleNumber: 2, title: "Academic Preparedness for UoA", iconName: "school" as const },
  { moduleNumber: 3, title: "Connect to the University & New Zealand", iconName: "people" as const },
  { moduleNumber: 4, title: "Preparing for Departure", iconName: "flight" as const },
];

const DisplayModulesScreen = () => {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const {theme} = useContext(ThemeContext);
  if (selectedModule !== null) {
    return (
      <ModuleScreen moduleNumber={selectedModule} onBack={() => setSelectedModule(null)}/>
    );
  }

  return (
    <View style={[styles.container,{backgroundColor: theme.background}]}>
      {modules.map((module) => (
        <ModuleButton key={module.moduleNumber} moduleNumber={module.moduleNumber} title={module.title} onPress={() => setSelectedModule(module.moduleNumber)}iconName={module.iconName}/>
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

export default DisplayModulesScreen;
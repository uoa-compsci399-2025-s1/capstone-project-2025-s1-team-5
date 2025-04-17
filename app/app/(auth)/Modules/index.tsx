import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import ModuleButton from '@/components/ModuleButton';
import ModuleScreen from './modulescreen'; 

const modules = [
  { moduleNumber: 1, title: "Get Set Up For Success", iconName: "info" as const },
  { moduleNumber: 2, title: "Academic Preparedness for UoA", iconName: "info" as const },
  { moduleNumber: 3, title: "Connect to the University & New Zealand", iconName: "info" as const },
  { moduleNumber: 4, title: "Preparing for Departure", iconName: "info" as const },
];

const DisplayModulesScreen = () => {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);

  if (selectedModule !== null) {
    return (
      <ModuleScreen moduleNumber={selectedModule} onBack={() => setSelectedModule(null)}/>
    );
  }

  return (
    <View style={styles.container}>
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

export default DisplayModulesScreen;
import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SubModuleButton from '@/components/SubModuleButton';

export interface Submodule {
  title: string;
  iconName: keyof typeof MaterialIcons.glyphMap;  
}

export const moduleTitles: { [key: number]: string } = {
  1: "Get Set Up For Success",
  2: "Academic Preparedness for UoA",
  3: "Connect to the University & New Zealand",
  4: "Preparing for Departure",
};

export const moduleSubmodules: { [key: number]: Submodule[] } = {
  1: [
    { title: "Navigating your course", iconName: "book" },
    { title: "Using Canvas", iconName: "laptop" },
    { title: "Academic integrity", iconName: "security" },
    { title: "Netiquette & code of conduct", iconName: "email" },
    { title: "Prepare for success quiz", iconName: "touch-app" },
  ],
  2: [
    { title: "Academic skills", iconName: "school" },
    { title: "Library & learning services", iconName: "local-library" },
    { title: "Study tips", iconName: "lightbulb" },
    { title: "Work life balance", iconName: "schedule" },
  ],
  3: [
    { title: "Where to go for help", iconName: "help" },
    { title: "Meet the academics", iconName: "group" },
    { title: "Meet your student advisers", iconName: "person" },
    { title: "Introduction to Te Reo Maori", iconName: "language" },
  ],
  4: [
    { title: "Life in Auckland", iconName: "location-city" },
    { title: "Work rights & employment", iconName: "work" },
    { title: "Intercultural communication", iconName: "language" },
    { title: "Visas & insurance", iconName: "account-box" },
    { title: "Biosecurity", iconName: "health-and-safety" },
    { title: "Accommodation", iconName: "home" },
  ],
};


const ModuleScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const moduleNumber = Number(params.moduleNumber) || 1;
  const { theme } = useContext(ThemeContext);

  const submodules = moduleSubmodules[moduleNumber] || [];
  const moduleTitle = moduleTitles[moduleNumber] || 'Module';

  const handleSubmodulePress = (submoduleIndex: number) => {
    router.push({
      pathname: `/Modules/submodulescreen`,
      params: {
        moduleNumber: moduleNumber.toString(),
        submoduleNumber: submoduleIndex.toString(),
        submoduleTitle: submodules[submoduleIndex].title,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.submodulesContainer}
        showsVerticalScrollIndicator={false}  
      >
        {submodules.map((submodule, index) => (
          <SubModuleButton
            key={`${moduleNumber}-${index}`}
            title={submodule.title}
            onPress={() => handleSubmodulePress(index)}
            iconName={submodule.iconName}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  moduleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  submodulesContainer: {
    width: '100%',
    paddingBottom: 20,  
  },
});

export default ModuleScreen;

import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // 🧭 Import router
import { ThemeContext } from '@/contexts/ThemeContext';

import SubModuleButton from '@/components/SubModuleButton';
import StyledText from '@/components/StyledText';

interface Submodule {
  title: string;
  iconName: 'info' | 'touch-app';
}

export const moduleSubmodules: { [key: number]: Submodule[] } = {
  1: [
    { title: "Navigating your course", iconName: "info" },
    { title: "Using Canvas", iconName: "info" },
    { title: "Academic integrity", iconName: "info" },
    { title: "Netiquette & code of conduct", iconName: "info" },
    { title: "Prepare for success quiz", iconName: "touch-app" },
  ],
  2: [
    { title: "Academic skills", iconName: "touch-app" },
    { title: "Library & learning services", iconName: "info" },
    { title: "Study tips", iconName: "info" },
    { title: "Work life balance", iconName: "info" },
  ],
  3: [
    { title: "Where to go for help", iconName: "info" },
    { title: "Meet the academics", iconName: "info" },
    { title: "Meet your student advisers", iconName: "info" },
    { title: "Introduction to Te Reo Maori", iconName: "touch-app" },
    { title: "Forum", iconName: "touch-app" },
  ],
  4: [
    { title: "Life in Auckland", iconName: "info" },
    { title: "Work rights & employment", iconName: "info" },
    { title: "Intercultural communication", iconName: "info" },
    { title: "Visas & insurance", iconName: "info" },
    { title: "Biosecurity", iconName: "info" },
    { title: "Accommodation", iconName: "touch-app" },
  ],
};

interface ModuleScreenProps {
  moduleNumber: number;
  onBack: () => void;
}

const ModuleScreen: React.FC<ModuleScreenProps> = ({ moduleNumber, onBack }) => {
  const router = useRouter();
  const submodules = moduleSubmodules[moduleNumber] || [];
  const { theme } = useContext(ThemeContext);

  const handleSubmodulePress = (submoduleIndex: number) => {
    router.push({
      pathname: `/Modules/submodulescreen`,
      params: {
        moduleNumber: moduleNumber.toString(),
        submoduleNumber: submoduleIndex.toString(),
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <StyledText type="label" style={styles.backText}>← Back to Modules</StyledText>
      </TouchableOpacity>

      <StyledText type="title" style={styles.moduleTitle}>Module {moduleNumber}</StyledText>

      <View style={styles.submodulesContainer}>
        {submodules.map((submodule, title) => (
          <SubModuleButton
            key={title}
            title={submodule.title}
            onPress={() => handleSubmodulePress(title)}
            iconName={submodule.iconName}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  moduleTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  submodulesContainer: {
    width: '100%',
  },
});

export default ModuleScreen;
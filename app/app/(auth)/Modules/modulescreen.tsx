import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 
import { ThemeContext } from '@/contexts/ThemeContext';
import SubModuleButton from '@/components/SubModuleButton';
import StyledText from '@/components/StyledText';

interface Submodule {
  id: string;
  title: string;
  iconName: 'info' | 'touch-app';
}

export const moduleSubmodules: { [key: number]: Submodule[] } = {
  1: [
    { id: 'm1s1', title: "Navigating your course", iconName: "info" },
    { id: 'm1s2', title: "Using Canvas", iconName: "info" },
    { id: 'm1s3', title: "Academic integrity", iconName: "info" },
    { id: 'm1s4', title: "Netiquette & code of conduct", iconName: "info" },
    { id: 'm1s5', title: "Prepare for success quiz", iconName: "touch-app" },
  ],
  2: [
    { id: 'm2s1', title: "Academic skills", iconName: "touch-app" },
    { id: 'm2s2', title: "Library & learning services", iconName: "info" },
    { id: 'm2s3', title: "Study tips", iconName: "info" },
    { id: 'm2s4', title: "Work life balance", iconName: "info" },
  ],
  3: [
    { id: 'm3s1', title: "Where to go for help", iconName: "info" },
    { id: 'm3s2', title: "Meet the academics", iconName: "info" },
    { id: 'm3s3', title: "Meet your student advisers", iconName: "info" },
    { id: 'm3s4', title: "Introduction to Te Reo Maori", iconName: "touch-app" },
    { id: 'm3s5', title: "Forum", iconName: "touch-app" },
  ],
  4: [
    { id: 'm4s1', title: "Life in Auckland", iconName: "info" },
    { id: 'm4s2', title: "Work rights & employment", iconName: "info" },
    { id: 'm4s3', title: "Intercultural communication", iconName: "info" },
    { id: 'm4s4', title: "Visas & insurance", iconName: "info" },
    { id: 'm4s5', title: "Biosecurity", iconName: "info" },
    { id: 'm4s6', title: "Accommodation", iconName: "touch-app" },
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

  const handleSubmodulePress = (submoduleId: string) => {
    router.push({
      pathname: "/(auth)/Modules/[submoduleNumber]" as const,
      params: {
        moduleNumber: moduleNumber.toString(),
        submoduleNumber: submoduleId, 
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
        {submodules.map((submodule) => (
          <SubModuleButton
            key={submodule.id}
            title={submodule.title}
            onPress={() => handleSubmodulePress(submodule.id)}
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
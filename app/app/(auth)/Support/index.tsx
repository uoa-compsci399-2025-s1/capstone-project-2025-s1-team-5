import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext'; 
import { useRouter } from 'expo-router';
import ModuleButton from '@/components/ModuleButton';

export default function SupportScreen() {
  const { theme } = useContext(ThemeContext); 
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <ModuleButton
          title="Contact Form"
          iconName="mail-outline"
          onPress={() => router.push('/Support/contactform')}
        />
        <ModuleButton
          title="Student Forum"
          iconName="forum"
          onPress={() => router.push('/Support/forum')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    padding: 5,
  },
});

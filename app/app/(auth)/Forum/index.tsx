import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext'; 
import QuizComponent from '@/components/Quiz'; 

export default function ForumScreen() {
  const { theme } = useContext(ThemeContext); 

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <QuizComponent />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    padding: 16,
  },
  scrollView: {
    padding: 16,
  },
});

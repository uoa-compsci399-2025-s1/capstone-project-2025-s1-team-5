import React from 'react';
import { Stack } from 'expo-router';
import StyledText from '@/components/StyledText';

export default function ForumLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Support</StyledText>,
        }} 
      />
    </Stack>
  );
}

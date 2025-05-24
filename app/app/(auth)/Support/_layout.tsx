import React from 'react';
import { Stack } from 'expo-router';
import StyledText from '@/components/StyledText';

export default function SupportLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: 'Support',
          headerTintColor: '#ffffff',
        }}
      />
      <Stack.Screen 
        name="contactform" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Contact Form</StyledText>,
          headerTintColor: '#ffffff',
        }} 
      />
      <Stack.Screen 
        name="forum" 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Student Forum</StyledText>,
          headerTintColor: '#ffffff',
        }} 
      />
    </Stack>
  );
}

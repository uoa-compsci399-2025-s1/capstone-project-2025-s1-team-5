import React from 'react';
import { Stack } from 'expo-router';
import StyledText from '@/components/StyledText';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: 'Profile',
          headerTintColor: '#ffffff',
        }}
      />
      <Stack.Screen
        name="changepassword"
        options={{
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Change Password</StyledText>,
          headerTintColor: '#ffffff',
        }}
      />
      <Stack.Screen name="pfpselection" options={{
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Select Profile Picture</StyledText>,
          headerTintColor: '#ffffff',
        }}/>
      <Stack.Screen name="theme" options={{
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Theme Preference</StyledText>,
          headerTintColor: '#ffffff',
        }}/>
      <Stack.Screen name="programme" options={{
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Programme Information</StyledText>,
          headerTintColor: '#ffffff',
        }}/>
      <Stack.Screen name="campusmap" options={{
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Campus Map</StyledText>,
          headerTintColor: '#ffffff',
        }}/>
    </Stack>
  );
}

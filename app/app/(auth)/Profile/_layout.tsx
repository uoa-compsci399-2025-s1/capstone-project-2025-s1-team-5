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
          headerStyle: { backgroundColor: '#0c0c48' }, //Navigation bar
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Profile</StyledText>,
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
      <Stack.Screen name="map" options={{
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Campus Map</StyledText>,
          headerTintColor: '#ffffff',
        }}/>
      <Stack.Screen name="calendar" options={{
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Calendar</StyledText>,
          headerTintColor: '#ffffff',
        }}/>
      <Stack.Screen name="support" options={{
          title: '',
          headerStyle: { backgroundColor: '#0c0c48' },
          headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Support</StyledText>,
          headerTintColor: '#ffffff',
        }}
      />
    </Stack>
  );
}

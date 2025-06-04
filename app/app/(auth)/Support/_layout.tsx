import React from 'react';
import { Stack } from 'expo-router';

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
    </Stack>
  );
}


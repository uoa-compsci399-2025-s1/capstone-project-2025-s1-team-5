import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider }  from '@/contexts/UserContext'
import StyledText from '@/components/StyledText';

const fontMap = {
  'National-Black': require('@assets/global/fonts/National-Black.otf'),
  'National-BlackItalic': require('@assets/global/fonts/National-BlackItalic.otf'),
  'National-Bold': require('@assets/global/fonts/National-Bold.otf'),
  'National-BoldItalic': require('@assets/global/fonts/National-BoldItalic.otf'),
  'National-Book': require('@assets/global/fonts/National-Book.otf'),
  'National-BookItalic': require('@assets/global/fonts/National-BookItalic.otf'),
  'National-ExtraBold': require('@assets/global/fonts/National-Extrabold.otf'),
  'National-ExtraBoldItalic': require('@assets/global/fonts/National-ExtraboldItalic.otf'),
  'National-Light': require('@assets/global/fonts/National-Light.otf'),
  'National-LightItalic': require('@assets/global/fonts/National-LightItalic.otf'),
  'National-Medium': require('@assets/global/fonts/National-Medium.otf'),
  'National-MediumItalic': require('@assets/global/fonts/National-MediumItalic.otf'),
  'National-Regular': require('@assets/global/fonts/National-Regular.otf'),
  'National-RegularItalic': require('@assets/global/fonts/National-RegularItalic.otf'),
  'National-Semibold': require('@assets/global/fonts/National-Semibold.otf'),
  'National-SemiboldItalic': require('@assets/global/fonts/National-SemiboldItalic.otf'),
  'National-Thin': require('@assets/global/fonts/National-Thin.otf'),
  'National-ThinItalic': require('@assets/global/fonts/National-ThinItalic.otf'),
};

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync(fontMap); 
      setFontsLoaded(true); 
    })();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <UserProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ 
              title: '',
              headerStyle: { backgroundColor: '#0c0c48' },
              headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>UoA Your Way</StyledText>,
              headerTintColor: '#ffffff',
              headerBackVisible: false,
            }} 
          />
          <Stack.Screen 
            name="signup" 
            options={{ 
              title: '',
              headerStyle: { backgroundColor: '#0c0c48' },
              headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Sign Up</StyledText>,
              headerTintColor: '#ffffff',
            }} 
          />
          <Stack.Screen 
            name="createprofile" 
            options={{ 
              title: '',
              headerStyle: { backgroundColor: '#0c0c48' },
              headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Create Profile</StyledText>,
              headerTintColor: '#ffffff',
            }} 
          />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="forgotpassword"
            options={{
              title: '',
              headerStyle: { backgroundColor: '#0c0c48' },
              headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Forgot Password</StyledText>,
              headerTintColor: '#ffffff',
            }}
          />
        </Stack>
      </ThemeProvider>
    </UserProvider> 
  );
}

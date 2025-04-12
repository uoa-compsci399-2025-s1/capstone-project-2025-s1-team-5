import * as Font from 'expo-font';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import StyledText from '@/components/StyledText';
import { ThemeProvider } from '@/app/contexts/ThemeContext';

const fontMap = {
  'National-Black': require('@/assets/fonts/National-Black.otf'),
  'National-BlackItalic': require('@/assets/fonts/National-BlackItalic.otf'),
  'National-Bold': require('@/assets/fonts/National-Bold.otf'),
  'National-BoldItalic': require('@/assets/fonts/National-BoldItalic.otf'),
  'National-Book': require('@/assets/fonts/National-Book.otf'),
  'National-BookItalic': require('@/assets/fonts/National-BookItalic.otf'),
  'National-ExtraBold': require('@/assets/fonts/National-Extrabold.otf'),
  'National-ExtraBoldItalic': require('@/assets/fonts/National-ExtraboldItalic.otf'),
  'National-Light': require('@/assets/fonts/National-Light.otf'),
  'National-LightItalic': require('@/assets/fonts/National-LightItalic.otf'),
  'National-Medium': require('@/assets/fonts/National-Medium.otf'),
  'National-MediumItalic': require('@/assets/fonts/National-MediumItalic.otf'),
  'National-Regular': require('@/assets/fonts/National-Regular.otf'),
  'National-RegularItalic': require('@/assets/fonts/National-RegularItalic.otf'),
  'National-Semibold': require('@/assets/fonts/National-Semibold.otf'),
  'National-SemiboldItalic': require('@/assets/fonts/National-SemiboldItalic.otf'),
  'National-Thin': require('@/assets/fonts/National-Thin.otf'),
  'National-ThinItalic': require('@/assets/fonts/National-ThinItalic.otf'),
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
    <ThemeProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: '',
            headerStyle: { backgroundColor: '#00467f' },
            headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>UoA Your Way</StyledText>,
            headerTintColor: '#ffffff',
          }} 
        />
        <Stack.Screen 
          name="signup" 
          options={{ 
            title: '',
            headerStyle: { backgroundColor: '#00467f' },
            headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Sign Up</StyledText>,
            headerTintColor: '#ffffff',
          }} 
        />
        <Stack.Screen 
          name="createprofile" 
          options={{ 
            title: '',
            headerStyle: { backgroundColor: '#00467f' },
            headerTitle: () => <StyledText type="title" style={{ color: '#ffffff' }}>Create Profile</StyledText>,
            headerTintColor: '#ffffff',
          }} 
        />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

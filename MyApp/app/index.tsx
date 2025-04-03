import React, { useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import useTheme from '@/hooks/useTheme';

import SubmitButton from '@/components/SubmitButton'; 
import TextInputBox from '@/components/TextInputBox'; 
import StyledText from '@/components/StyledText'; 
import NavLink from '@/components/NavLink'; 

export default function SignInScreen() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayedError, setDisplayedError] = useState('');
  
  const router = useRouter();

  const handleSignIn = async () => {
    if (email && password) {
      // Simulating form submission and navigating to the next screen
      router.replace('/Home'); // Replace with the actual page you want to navigate to
    } else {
      setDisplayedError('Please enter both email and password');
    }
  };

  const handleForgotPassword = async () => {
    // Mock action for forgotten password (simulated navigation)
    console.log("Navigating to Forgot Password screen...");
    //router.push('/forgot-password'); // Replace with your actual path
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.appLogo}>
        <Image 
          source={require('@/assets/images/DarkBlueLogo.png')} 
          style={styles.logoImage}
        />
      </View>

      <TextInputBox
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        iconName="email"
      />
      <TextInputBox
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        iconName="lock"
      />

      {displayedError !== '' && <StyledText type="error">{displayedError}</StyledText>}
      
      <SubmitButton text="Sign In" onPress={handleSignIn} />

      <View style={styles.navLinksContainer}>
        <NavLink 
          text="Create Account" 
          iconName="double-arrow" 
          onPress={() => router.push('/signup')} 
        />
        <NavLink 
          text="Forgot Password?" 
          onPress={handleForgotPassword} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  appLogo: {
    width: 165,
    height: 165,
    borderRadius: 10,
    marginBottom: 40,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  navLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 16,
  },
});

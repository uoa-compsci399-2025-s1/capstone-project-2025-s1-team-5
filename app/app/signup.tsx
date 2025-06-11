import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';

import api from './lib/api'; 

import SubmitButton from '@/components/SubmitButton';
import TextInputBox from '@/components/TextInputBox';
import StyledText from '@/components/StyledText';

export default function SignUpScreen() {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayedError, setDisplayedError] = useState('');
  const router = useRouter();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; 

  const handleSignUp = async () => {
    setDisplayedError('');
    if (!emailRegex.test(email)) {
      setDisplayedError('Please enter a valid email address');
      return;
    }

    try {
      const res = await api.post<{ exists: boolean }>('/auth/check-email', { email });
      if (res.data.exists) {
        setDisplayedError('This email is already in use');
        return;
      }
    } catch (err) {
      console.error('Email check failed', err);
      setDisplayedError('Unable to verify email, please try again');
      return;
    }

    if (password !== confirmPassword) {
      setDisplayedError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setDisplayedError('Password must be at least 6 characters long.');
      return;
    }

    router.replace({
      pathname: '/createprofile',
      params: { email, password },
    });
  };
  const logoSource = isDarkMode
            ? require('@/assets/logos/VerticalWhiteLogo.png')
            : require('@/assets/logos/VerticalColourLogo.png');
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.appLogo}>
          <Image
            source={
              isDarkMode
                ? require('@/assets/logos/VerticalWhiteLogo.png')
                : require('@/assets/logos/VerticalColourLogo.png')
            }
            style={styles.logoImage}
          />
        </View>
        <TextInputBox placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" iconName="email" />
        <TextInputBox placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry iconName="lock" />
        <TextInputBox placeholder="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry iconName="lock" />

        {displayedError !== '' && <StyledText type="error">{displayedError}</StyledText>}

        <SubmitButton text="Sign Up" onPress={handleSignUp} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  appLogo: {
    width: 200,
    height: 240,
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
});

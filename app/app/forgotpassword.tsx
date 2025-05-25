import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import api from './lib/api';

import SubmitButton from '@/components/SubmitButton';
import TextInputBox from '@/components/TextInputBox';
import StyledText from '@/components/StyledText';

export default function ForgotPasswordScreen() {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayedError, setDisplayedError] = useState('');
  const router = useRouter();

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const handleForgotPassword = async() => {
    setDisplayedError('');
    if (!emailRegex.test(email)) {
      setDisplayedError('Please enter a valid email address');
      return;
    }

    try {
      const res = await api.post<{ exists: boolean }>('/auth/check-email', { email });
      if (!res.data.exists) {
        setDisplayedError('This email is not associated with any account');
        return;
      }
    } catch (err) {
      console.error('Email check failed', err);
      setDisplayedError('Unable to verify email, please try again');
      return;
    }

  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.appLogo}><Image source={require('@/assets/logos/VerticalColourLogo.png')} style={styles.logoImage}/></View>
      <StyledText type="label" style={styles.customTitle}>Forgot Password?</StyledText>
      <StyledText type="label" style={styles.customMessage}>Enter the email address associated with your account.</StyledText>
      <StyledText type="label" style={styles.customMessage}>We will email you with how to reset your password.</StyledText>


      <TextInputBox style = { styles.emailInput } placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" iconName="email"/>

      {displayedError !== '' && <StyledText type="error">{displayedError}</StyledText>}

      <SubmitButton style = { styles.submitButton } text="Submit" onPress={handleForgotPassword} />
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
  emailInput: {
    marginTop: '3%',
  },
  submitButton: {
      marginTop: '3%',
    },
  customTitle: {
    fontSize: 30,
    fontFamily: 'National',
    marginBottom: '5%',
  },
  customMessage: {
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'National',
      marginBottom: '4%',
      color: '#666666',
    }
});

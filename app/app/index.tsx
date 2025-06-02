import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import { UserContext } from '@/contexts/UserContext';
import api from '@/app/lib/api';
import * as SecureStore from 'expo-secure-store';

import SubmitButton from '@/components/SubmitButton';
import TextInputBox from '@/components/TextInputBox';
import StyledText from '@/components/StyledText';
import NavLink from '@/components/NavLink';

export default function SignInScreen() {
  const { theme, isDarkMode } = useContext(ThemeContext);  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayedError, setDisplayedError] = useState('');

  const router = useRouter();
  const userContext = useContext(UserContext);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const handleSignIn = async () => {
    try {
      if (!emailRegex.test(email)) {
        setDisplayedError('Please enter a valid email address');
        return;
      }

      if (email && password) {
        const response = await api.post('/auth/login', { password, email });
        const token = response.data.token;
        await SecureStore.setItemAsync('USER_TOKEN', token);

        const meRes = await api.get('/auth/me');
        userContext.setUser(meRes.data);

        router.replace('/Modules');
      } else {
        setDisplayedError('Please enter both email and password');
      }
    } catch (err: any) {
      if (err.response) {
        const data = err.response.data;
        const msg =
          data.message ??
          data.detail ??
          data.reason ??
          'Login failed';

        setDisplayedError(msg);
      } else if (err.request) {
        setDisplayedError('Cannot reach server. Check your network or try again later.');
      } else {
        setDisplayedError(err.message);
      }
    }
  };

  const handleForgotPassword = async () => {
    router.push('/forgotpassword')
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.appLogo}>
          <Image 
            source={isDarkMode ? require('@/assets/logos/VerticalWhiteLogo.png') : require('@/assets/logos/VerticalColourLogo.png')} 
            style={styles.logoImage}
          />
        </View>

        <TextInputBox placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" iconName="email" />
        <TextInputBox placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry iconName="lock" />

        {displayedError !== '' && <StyledText type="error">{displayedError}</StyledText>}

        <SubmitButton text="Sign In" onPress={handleSignIn} />

        <View style={styles.navLinksContainer}>
          <NavLink text="Create Account" iconName="double-arrow" onPress={() => router.push('/signup')} />
          <NavLink text="Forgot Password?" onPress={handleForgotPassword} />
        </View>
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
  navLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 16,
  },
});

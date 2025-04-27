import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@/contexts/UserContext';

import SubmitButton from '@/components/SubmitButton'; 
import TextInputBox from '@/components/TextInputBox'; 
import StyledText from '@/components/StyledText'; 
import NavLink from '@/components/NavLink'; 

export default function SignInScreen() {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayedError, setDisplayedError] = useState('');
  
  const router = useRouter();
  const userContext = useContext(UserContext);
  
  // async function getMe() {
  //   // token for Authorization header???
  //   const me = await api.get('/api/me'); 
  //   userContext.setUser(me);
  
  //   if (me.themePreference) {
  //     await AsyncStorage.setItem('USER_THEME_PREFERENCE', me.themePreference);
  //   }
  // }
  
  const handleSignIn = async () => {
    // authentication logic needed when database is set up, async needed?
    try {
      if (email && password) {
        // await getme();
        router.replace('/Modules');  
      } else {
        setDisplayedError('Please enter both email and password');
      }
    } catch (error) {
      console.error(error);
      setDisplayedError('An unknown error occurred');
    }
  };
  

  const handleForgotPassword = async () => {
    // forget password logic needed
    console.log("Forgot password clicked");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.appLogo}><Image source={require('@/assets/logos/VerticalColourLogo.png')} style={styles.logoImage}/></View>

      <TextInputBox placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" iconName="email"/>
      <TextInputBox placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry iconName="lock"/>

      {displayedError !== '' && <StyledText type="error">{displayedError}</StyledText>}
      
      <SubmitButton text="Sign In" onPress={handleSignIn} />

      <View style={styles.navLinksContainer}>
        <NavLink text="Create Account" iconName="double-arrow" onPress={() => router.push('/signup')} />
        <NavLink text="Forgot Password?" onPress={handleForgotPassword} />
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

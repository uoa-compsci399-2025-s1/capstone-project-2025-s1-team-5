import { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

import useTheme from '@/hooks/useTheme';

import SubmitButton from '@/components/SubmitButton';
import TextInputBox from '@/components/TextInputBox';
import StyledText from '@/components/StyledText';

export default function SignUpScreen() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayedError, setDisplayedError] = useState('');
  const router = useRouter();

  const handleSignUp = () => {
    //user creation logic needed when database is set up, async needed?
    if (password !== confirmPassword) {
      setDisplayedError('Passwords do not match');
      return;
    }
    // try and catch exception needed, try for the user creation and catch for the error message
    setDisplayedError('');
    console.log('Signing up with:', { email, password });

    router.replace('/createprofile');
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
      <TextInputBox
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        iconName="lock"
      />

      {displayedError !== '' && <StyledText type="error">{displayedError}</StyledText>}

      <SubmitButton text="Sign Up" onPress={handleSignUp} />
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
});

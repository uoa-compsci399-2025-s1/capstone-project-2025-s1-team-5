import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import useTheme from '@/hooks/useTheme';

import SubmitButton from '@/components/SubmitButton';
import TextInputBox from '@/components/TextInputBox';
import StyledText from '@/components/StyledText';

export default function ChangeEmailScreen() {
  const router = useRouter();
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { theme } = useTheme();

  const handleChangeEmail = () => {
    if (newEmail && confirmEmail && password) {
      if (newEmail !== confirmEmail) {
        setErrorMessage('New email and confirm email do not match.');
        return;
      }

      if (!validateEmail(newEmail)) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }

      try {
        // need code to store the new email in the database and update it
        console.log('Updating email to:', newEmail);
        setSuccessMessage('Your email has been successfully changed.');
        setErrorMessage('');
        
        setTimeout(() => {
          router.back(); 
        }, 3000);

      } catch (e) {
        setErrorMessage('An error occurred while changing the email.');
        console.error('Error:', e);
      }
    } else {
      setErrorMessage('Please fill out all fields.');
    }
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInputBox
        placeholder="New Email"
        value={newEmail}
        onChangeText={setNewEmail}
        iconName="email"
      />
      <TextInputBox
        placeholder="Confirm New Email"
        value={confirmEmail}
        onChangeText={setConfirmEmail}
        iconName="email"
      />
      <TextInputBox
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        iconName="lock"
        secureTextEntry={true}
      />

      {errorMessage ? (
        <StyledText type="error">{errorMessage}</StyledText>
      ) : null}
      {successMessage ? (
        <StyledText type="success">{successMessage}</StyledText> 
      ) : null}

      <SubmitButton text="Change Email" onPress={handleChangeEmail} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
});

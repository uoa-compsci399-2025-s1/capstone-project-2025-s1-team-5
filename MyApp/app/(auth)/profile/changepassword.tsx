import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import useTheme from '@/hooks/useTheme';

import SubmitButton from '@/components/SubmitButton';
import TextInputBox from '@/components/TextInputBox';
import StyledText from '@/components/StyledText';  

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const { theme } = useTheme();

  const handleChangePassword = () => {
    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        setErrorMessage('New password and confirm password do not match.');
        return;
      }

      try {
        // need code to store the new password in the database and update it
        console.log('New Password:', newPassword);
        router.back(); 

      } catch (e) {
        setErrorMessage('An error occurred while changing the password.');
        console.error('Error:', e); 
      }
    } else {
      setErrorMessage('Please fill out all fields.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInputBox
        placeholder="Current password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        iconName="lock"
        secureTextEntry={true}
      />
      <TextInputBox
        placeholder="New password"
        value={newPassword}
        onChangeText={setNewPassword}
        iconName="lock"
        secureTextEntry={true}
      />
      <TextInputBox
        placeholder="Confirm new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        iconName="lock"
        secureTextEntry={true}
      />
      {errorMessage ? (
        <StyledText type="error">{errorMessage}</StyledText> 
      ) : null}

      <SubmitButton text="Change Password" onPress={handleChangePassword} />
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

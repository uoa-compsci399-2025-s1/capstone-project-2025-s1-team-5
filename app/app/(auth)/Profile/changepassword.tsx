import { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';

import SubmitButton from '@/components/SubmitButton';
import TextInputBox from '@/components/TextInputBox';
import StyledText from '@/components/StyledText';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { theme } = useContext(ThemeContext);

  const handleChangePassword = () => {
    if (currentPassword && newPassword && confirmPassword) {
      if (newPassword.length < 6) {
        setErrorMessage('New password must be at least 6 characters long.');
        setSuccessMessage('');
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage('New password and confirm password do not match.');
        setSuccessMessage('');
        return;
      }

      try {
        // need code to store the new password in the database and update it
        console.log('New Password:', newPassword);

        setSuccessMessage('Your password has been successfully changed.');
        setErrorMessage('');

        setTimeout(() => {
          router.back();
        }, 3000);

      } catch (e) {
        setErrorMessage('An error occurred while changing the password.');
        setSuccessMessage('');
        console.error('Error:', e);
      }
    } else {
      setErrorMessage('Please fill out all fields.');
      setSuccessMessage('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInputBox placeholder="Current password" value={currentPassword} onChangeText={setCurrentPassword} iconName="lock" secureTextEntry={true}/>
      <TextInputBox placeholder="New password" value={newPassword} onChangeText={setNewPassword} iconName="lock" secureTextEntry={true}/>
      <TextInputBox placeholder="Confirm new password" value={confirmPassword} onChangeText={setConfirmPassword} iconName="lock" secureTextEntry={true}/>

      {errorMessage ? (
        <StyledText type="error">{errorMessage}</StyledText>
      ) : null}

      {successMessage ? (
        <StyledText type="success">{successMessage}</StyledText>
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

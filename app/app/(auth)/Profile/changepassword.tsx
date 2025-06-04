import React, { useContext, useState } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import api from '@/app/lib/api';

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

  const handleChangePassword = async() => {
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

      if (currentPassword === newPassword) {
        setErrorMessage('New password cannot be the same as the old password.');
        setSuccessMessage('');
        return;
      }

      try {
         const res = await api.post<{ message: string }>('/auth/changePassword', {
          oldPassword: currentPassword,
          newPassword,
        })

        setSuccessMessage(res.data.message)
        setErrorMessage('')

        Keyboard.dismiss()

        setTimeout(() => router.back(), 2000)

      } catch (e) {
        setErrorMessage('The current password is incorrect.');
        setSuccessMessage('');
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

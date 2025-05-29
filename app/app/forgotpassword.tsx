// import React, { useContext, useState } from 'react';
// import { View, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
// import { useRouter } from 'expo-router';
// import { ThemeContext } from '@/contexts/ThemeContext';
// import api from './lib/api';
//
// import SubmitButton from '@/components/SubmitButton';
// import TextInputBox from '@/components/TextInputBox';
// import StyledText from '@/components/StyledText';
//
// export default function ForgotPasswordScreen() {
//   const { theme } = useContext(ThemeContext);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [displayedError, setDisplayedError] = useState('');
//   const router = useRouter();
//
//   const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//
//   const handleForgotPassword = async() => {
//     setDisplayedError('');
//     if (!emailRegex.test(email)) {
//       setDisplayedError('Please enter a valid email address');
//       return;
//     }
//
//     try {
//       const res = await api.post<{ exists: boolean }>('/auth/check-email', { email });
//       if (!res.data.exists) {
//         setDisplayedError('This email is not associated with any account');
//         return;
//       }
//     } catch (err) {
//       console.error('Email check failed', err);
//       setDisplayedError('Unable to verify email, please try again');
//       return;
//     }
//
//   };
//
//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <View style={styles.appLogo}><Image source={require('@/assets/logos/VerticalColourLogo.png')} style={styles.logoImage}/></View>
//       <StyledText type="label" style={styles.customTitle}>Forgot Password?</StyledText>
//       <StyledText type="label" style={styles.customMessage}>Enter the email address associated with your account.</StyledText>
//       <StyledText type="label" style={styles.customMessage}>We will email you with how to reset your password.</StyledText>
//
//
//       <TextInputBox style = { styles.emailInput } placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" iconName="email"/>
//
//       {displayedError !== '' && <StyledText type="error">{displayedError}</StyledText>}
//
//       <SubmitButton style = { styles.submitButton } text="Submit" onPress={handleForgotPassword} />
//     </View>
//     </TouchableWithoutFeedback>
//   );
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     padding: 20,
//   },
//   appLogo: {
//     width: 200,
//     height: 240,
//     borderRadius: 10,
//     marginBottom: 40,
//     marginTop: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 10,
//   },
//
//   submitButton: {
//       marginTop: '3%',
//     },
//   customTitle: {
//     fontSize: 30,
//     fontFamily: 'National',
//     marginBottom: '5%',
//   },
//   customMessage: {
//       fontSize: 16,
//       textAlign: 'center',
//       fontFamily: 'National',
//       marginBottom: '4%',
//       color: '#666666',
//     }
// });

import React, { useState, useContext } from 'react';
import { Alert, ScrollView } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { View, StyleSheet, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';

import StyledText from '@/components/StyledText';
import TextInputBox from '@/components/TextInputBox';
import SubmitButton from '@/components/SubmitButton';

export default function ContactFormScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const { theme, isDarkMode } = useContext(ThemeContext);
  //link to cms/let the form be sent to Programme Consultant’s queue?
  //do we need to add a text input box for the user to write their problem?
  const GETFORM_ENDPOINT = 'https://getform.io/f/bpjpjpvb';

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !contact) {
      Alert.alert('Missing Info', 'Please fill in all the fields.');
      return;
    }

    const data = {
      first_name: firstName,
      last_name: lastName,
      preferred_email: email,
      contact_number: contact,
    };
    const formBody = new URLSearchParams(data).toString();

    try {
      const response = await fetch(GETFORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody,
      });

      if (response.ok) {
        Alert.alert('Success', 'Your enquiry has been sent.');

        setFirstName('');
        setLastName('');
        setEmail('');
        setContact('');
      } else {
        const errText = await response.text();
        console.error('Form submission failed:', errText);
        Alert.alert('Error', 'Failed to send enquiry.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Network error while sending enquiry.');
    }
  };

  const logoSource = isDarkMode
    ? require('@/assets/logos/VerticalWhiteLogo.png')
    : require('@/assets/logos/VerticalColourLogo.png');

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>

    <View style={styles.appLogo}><Image source={logoSource} style={styles.logoImage}/></View>
    <StyledText type="label" style={styles.customTitle}>Forgot Password?</StyledText>
    <StyledText type="label" style={styles.customMessage}>Enter the details associated with your account.</StyledText>
    <StyledText type="label" style={styles.customMessage}>We will email you with how to reset your password.</StyledText>

      <TextInputBox
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        iconName="person"
      />
      <TextInputBox
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        iconName="person"
      />
      <TextInputBox
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        iconName="email"
      />
      <TextInputBox
        placeholder="Contact Number"
        value={contact}
        onChangeText={setContact}
        keyboardType="phone-pad"
        iconName="phone"
      />

      <SubmitButton text="Submit Details" onPress={handleSubmit} style={styles.button} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  introText: {
    marginBottom: 20,
    lineHeight: 24,
  },
  button: {
    marginTop: 20,
  },
  appLogo: {
    width: 200,
    height: 240,
    borderRadius: 10,
    marginBottom: 40,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
customTitle: {
    fontSize: 20,
    fontFamily: 'National',
    marginBottom: '5%',
    alignSelf: 'center',
  },
  customMessage: {
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'National',
      marginBottom: '4%',
      color: '#666666',
    }
});

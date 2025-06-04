import React, { useState, useContext } from 'react';
import { Alert, ScrollView } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import { View, StyleSheet, Image } from 'react-native';

import StyledText from '@/components/StyledText';
import TextInputBox from '@/components/TextInputBox';
import SubmitButton from '@/components/SubmitButton';

export default function ContactFormScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const { theme, isDarkMode } = useContext(ThemeContext);

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
    <StyledText type="label" style={[{ color: theme.text }, styles.customMessage]}>Enter your contact information below. Our team will follow up shortly to help you reset your password.</StyledText>

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

      <SubmitButton text="Submit Details" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  appLogo: {
    width: 200,
    height: 240,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 7,
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
    marginBottom: 8,
    alignSelf: 'center',
  },
  customMessage: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: '4%',
    },
});

import React, { useState, useContext } from 'react';
import { Alert, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';

import StyledText from '@/components/StyledText';
import TextInputBox from '@/components/TextInputBox';
import SubmitButton from '@/components/SubmitButton';

export default function SupportScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const { theme } = useContext(ThemeContext);
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

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <StyledText type="subtitle" style={[styles.subtitle, { color: theme.text }]}>
        Need Help?
      </StyledText>

      <StyledText type="default" style={[styles.introText, { color: theme.text }]}>
        Please submit your contact details below and a Programme Consultant will be in touch.
      </StyledText>
      
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
        placeholder="Preferred Email"
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
});

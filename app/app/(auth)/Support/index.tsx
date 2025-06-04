import React, { useState, useContext } from 'react';
import { Alert, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';

import StyledText from '@/components/StyledText';
import TextInputBox from '@/components/TextInputBox';
import SubmitButton from '@/components/SubmitButton';
import api from '@/app/lib/api';

export default function SupportScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [enquiry, setEnquiry] = useState('');

  const { theme } = useContext(ThemeContext);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !contact || !enquiry) {
      Alert.alert('Missing Info', 'Please fill in all the fields including your inquiry.');
      return;
    }

    const data = {
      first_name: firstName,
      last_name: lastName,
      preferred_email: email,
      contact_number: contact,
      enquiry_message: `Enquiry message: ${enquiry}`,
      title: 'UoA Your Way Support Request'
    };

    try {
      const response = await api.post(
      '/support',
      data,                         
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      );

      if (response.status === 204) {
        Alert.alert('Success', 'Your enquiry has been sent.');
        setFirstName('');
        setLastName('');
        setEmail('');
        setContact('');
        setEnquiry('');
      } else {
          console.warn('Unexpected status code:', response.status);
          Alert.alert('Error', 'Failed to send enquiry.');
        }
    } catch (error: any) {
      console.error('Submit error:', error.response?.data || error.message);
      const msg =
        error.response?.data?.message ||
        'Network error while sending enquiry.';
      Alert.alert('Error', msg);
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <StyledText type="subtitle" style={[styles.subtitle, { color: theme.text }]}>
        Have a Question or Issue?
      </StyledText>

      <StyledText type="default" style={[styles.introText, { color: theme.text }]}>
        Please submit your contact details and enquiry, and a Programme Consultant will get back to you as soon as possible.
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
      <TextInputBox
        placeholder="Type your enquiry here..."
        value={enquiry}
        onChangeText={setEnquiry}
        multiline
        numberOfLines={8}
        iconName="message"
        style={styles.enquiryBox}
      />

      <SubmitButton text="Submit Details" onPress={handleSubmit} style={styles.button} />
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
    marginBottom: 16,
    fontSize: 20,
  },
  introText: {
    marginBottom: 8,
    lineHeight: 24,
  },
  enquiryBox: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 6,
  },
});
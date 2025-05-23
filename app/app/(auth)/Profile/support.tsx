import React, { useState, useContext } from 'react';
import { Alert, StyleSheet, ScrollView } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';

import StyledText from '@/components/StyledText';
import TextInputBox from '@/components/TextInputBox';
import SubmitButton from '@/components/SubmitButton';

const SERVICE_ID = 'service_cfsiigh';      
const TEMPLATE_ID = 'template_renrx8p';    
const PUBLIC_KEY = '7_hkd-tDAgRDQsDiA';      

export default function SupportScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const { theme } = useContext(ThemeContext);

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !contact) {
      Alert.alert('Missing Info', 'Please fill in all the fields.');
      return;
    }

    const data = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: {
        first_name: firstName,
        last_name: lastName,
        preferred_email: email,
        contact_number: contact,
      }
    };

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        Alert.alert('Success', 'Your enquiry has been sent.');

        // Reset form fields
        setFirstName('');
        setLastName('');
        setEmail('');
        setContact('');
      } else {
        const errText = await response.text();
        console.error('Email send failed:', errText);
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

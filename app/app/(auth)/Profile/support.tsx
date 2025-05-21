import React, { useState, useContext } from 'react';
import { Alert, StyleSheet, ScrollView } from 'react-native';
import StyledText from '@/components/StyledText';
import TextInputBox from '@/components/TextInputBox';
import SubmitButton from '@/components/SubmitButton';
import { ThemeContext } from '@/contexts/ThemeContext';

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
    //need to link to cms?
    
    try {
      // Uncomment for real integration
      /*
      await emailjs.send(
        'your_service_id',
        'your_template_id',
        {
          first_name: firstName,
          last_name: lastName,
          email,
          contact,
        },
        'your_public_key'
      );
      */

      Alert.alert('Success', 'Your enquiry has been sent.');

      // Clear all fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setContact('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send enquiry.');
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

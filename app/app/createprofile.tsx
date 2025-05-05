import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import countries from 'world-countries';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

import SubmitButton from '@/components/SubmitButton';
import TextInputBox from '@/components/TextInputBox';
import StyledText from '@/components/StyledText';
import DropDownMenu from '@/components/DropDownMenu';

export default function CreateProfileScreen() {
  // async and/or const navigation = useNavigation(); needed?
  const { theme } = useContext(ThemeContext);
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedProgramme, setselectedProgramme] = useState('');
  const [displayedError, setDisplayedError] = useState('');

  const { email, password } = useLocalSearchParams();

  const filteredCountries = countries.filter(
    (country) => country.cca3 !== 'TWN' 
  );

  const countryList = filteredCountries.map((c) => c.name.common).sort();

  const Programme = [
    'Master of Engineering Project Management',
    'Master of Civil Engineering',
  ];

  const handleCreateProfile = async () => {
    if (!firstName || !lastName || !selectedCountry || !selectedProgramme) {
      setDisplayedError('Please fill in all fields');
      return;
    }
  
    try {
      await axios.post('http://localhost:3000/users', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        country: selectedCountry,
        programme: selectedProgramme,
      });
  
      router.replace('/Modules'); // or wherever your app goes next
    } catch (error) {
      console.error(error);
      setDisplayedError('Failed to create user profile');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.appLogo}><Image source={require('@/assets/logos/VerticalColourLogo1.png')} style={styles.logoImage}/></View>

      <TextInputBox placeholder="First Name" value={firstName} onChangeText={setFirstName} iconName="person"/>
      <TextInputBox placeholder="Last Name" value={lastName} onChangeText={setLastName} iconName="person"/>
      <DropDownMenu selectedValue={selectedCountry} onValueChange={setSelectedCountry} items={countryList} placeholder="Select your country" iconName="public"/>
      <DropDownMenu selectedValue={selectedProgramme} onValueChange={setselectedProgramme} items={Programme} placeholder="Select your programme" iconName="library-books"/>

      {displayedError !== '' && <StyledText type="error">{displayedError}</StyledText>}

      <SubmitButton text="Create Profile" onPress={handleCreateProfile} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  appLogo: {
    width: 200,
    height: 240,
    borderRadius: 10,
    marginBottom: 40,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

import * as SecureStore from 'expo-secure-store';
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import { UserContext } from '@/contexts/UserContext';
import countries from 'world-countries';
import api from './lib/api';

import SubmitButton from '@/components/SubmitButton';
import TextInputBox from '@/components/TextInputBox';
import StyledText from '@/components/StyledText';
import DropDownMenu from '@/components/DropDownMenu';

export default function CreateProfileScreen() {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [displayedError, setDisplayedError] = useState('');
  const { email, password } = useLocalSearchParams();
  const systemScheme = useColorScheme();
  const userContext = useContext(UserContext);

  const filteredCountries = countries.filter((c) => c.cca3 !== 'TWN');
  const countryList = filteredCountries.map((c) => c.name.common).sort();

  const [programmeList, setProgrammeList] = useState<string[]>([]);    
  const [programmeFetchError, setProgrammeFetchError] = useState<string>('');

  const handleCreateProfile = async () => {
    if (!firstName || !lastName || !selectedCountry || !selectedProgramme) {
      setDisplayedError('Please fill in all fields');
      return;
    }
    try {
      await api.post('/users', {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        country: selectedCountry,
        programme: selectedProgramme,
        colorPref: systemScheme === 'dark' ? 'dark' : 'light',
      });

      const loginRes = await api.post<{ token: string }>('/auth/login', {
        email,
        password,
      });
      await SecureStore.setItemAsync('USER_TOKEN', loginRes.data.token);

      const meRes = await api.get('/auth/me');
      userContext.setUser(meRes.data);

      router.replace({
        pathname: '/Profile/pfpselection',
        params: { isFirstTime: 'true' }
      });
    } catch (error) {
      console.error(error);
      setDisplayedError('Failed to create user profile');
    }
  };

  useEffect(() => {
    const fetchProgrammes = async () => {
      setProgrammeFetchError('');
      try {
        const response = await api.get<{ _id: string; name: string; description?: string; link?: string }[]>('/programmes/');
        const names = response.data.map(item => item.name);
        setProgrammeList(names);
      } catch (err) {
        console.error('Failed to fetch programme list', err);
        setProgrammeFetchError('Failed to fetch programme list, please try again');
      }
    };

    fetchProgrammes();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.appLogo}>
          <Image
            source={
              isDarkMode
                ? require('@/assets/logos/VerticalWhiteLogo.png')
                : require('@/assets/logos/VerticalColourLogo.png')
            }
            style={styles.logoImage}
          />
        </View>

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

        <DropDownMenu
          selectedValue={selectedCountry}
          onValueChange={setSelectedCountry}
          items={countryList}
          placeholder="Select your country"
          iconName="public"
        />
        <DropDownMenu
          selectedValue={selectedProgramme}
          onValueChange={setSelectedProgramme}
          items={programmeList}
          placeholder="Select your programme"
          iconName="library-books"
        />

        {programmeFetchError !== '' && (
          <StyledText type="error">{programmeFetchError}</StyledText>
        )}
        {displayedError !== '' && (
          <StyledText type="error">{displayedError}</StyledText>
        )}

        <SubmitButton text="Create Profile" onPress={handleCreateProfile} />
      </ScrollView>
    </TouchableWithoutFeedback>
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
import * as SecureStore from 'expo-secure-store'
import React, { useState, useContext } from 'react'
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import { useRouter } from 'expo-router'
import { ThemeContext } from '@/contexts/ThemeContext'
import countries from 'world-countries'
import { useLocalSearchParams } from 'expo-router'
import api from './lib/api'

import SubmitButton from '@/components/SubmitButton'
import TextInputBox from '@/components/TextInputBox'
import StyledText from '@/components/StyledText'
import DropDownMenu from '@/components/DropDownMenu'

export default function CreateProfileScreen() {
  const { theme } = useContext(ThemeContext)
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedProgramme, setSelectedProgramme] = useState('')
  const [displayedError, setDisplayedError] = useState('')
  const { email, password } = useLocalSearchParams()

  const filteredCountries = countries.filter((c) => c.cca3 !== 'TWN')
  const countryList = filteredCountries.map((c) => c.name.common).sort()

  const Programme = [
    'Master of Engineering Project Management',
    'Master of Civil Engineering',
  ]

  const handleCreateProfile = async () => {
    if (!firstName || !lastName || !selectedCountry || !selectedProgramme) {
      setDisplayedError('Please fill in all fields')
      return
    }

    try {
      await api.post('/users', {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        country: selectedCountry,
        programme: selectedProgramme,
      })

      const loginRes = await api.post<{ token: string }>('/auth/login', {
        email,
        password,
      })

      await SecureStore.setItemAsync('USER_TOKEN', loginRes.data.token)
      
      //update userContext....
      
      router.replace('/Modules')
    } catch (error) {
      console.error(error)
      setDisplayedError('Failed to create user profile')
    }
  }

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
            source={require('@/assets/logos/VerticalColourLogo.png')}
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
          items={Programme}
          placeholder="Select your programme"
          iconName="library-books"
        />

        {displayedError !== '' && (
          <StyledText type="error">{displayedError}</StyledText>
        )}

        <SubmitButton text="Create Profile" onPress={handleCreateProfile} />
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  appLogo: {
    width: 165,
    height: 165,
    borderRadius: 10,
    marginBottom: 30,
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
})

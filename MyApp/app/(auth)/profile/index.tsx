import React, { useContext } from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, Alert, Switch,} from 'react-native';

import { ThemeContext } from '../../contexts/ThemeContext';
import { darkTheme } from '@/app/theme/_theme';
import { useRouter } from 'expo-router';
import { UserContext } from '@/app/contexts/UserContext';
import profileAvatars from '@/constants/profileAvatars';

import SettingItem from '@/components/SettingItem';
import SettingsButton from '@/components/SettingsButton';

const ProfileScreen: React.FC = () => {
  const { theme, setCustomTheme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const router = useRouter();

  const textStyle = { color: theme.text };
  const bgStyle = { backgroundColor: theme.background };

  const features = ['My Courses', 'Accommodation', 'Events', 'Language', 'Support', 'Map'];

  const CountryTag = () => (
    <View style={styles.countryContainer}>
      <TouchableOpacity>
        <Image source={{ uri: 'https://flagcdn.com/w20/cn.png' }} style={styles.countryFlag} />
      </TouchableOpacity>
      <Text style={[styles.countryText, textStyle]}>China</Text>
    </View>
  );

  return (
    <View style={[styles.container, bgStyle]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('./Profile/picSelection')}>
          <Image
            source={profileAvatars[user.avatar] || profileAvatars.default}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={[styles.name, textStyle]}>Jack Zhen</Text>
          <Text style={[styles.email, textStyle]}>jackz123@aucklanduni.ac.nz</Text>
          <CountryTag />
        </View>
      </View>

      <View style={styles.buttonGrid}>
        {features.map((feature) => (
          <SettingsButton
            key={feature}
            title={feature}
            onPress={() => Alert.alert(`Navigating to ${feature}`)}
          />
        ))}
      </View>

      <Text style={[styles.sectionHeader, textStyle]}>Settings</Text>
      <SettingItem label="Change Password" onPress={() => console.log('Change password')} showDivider />
      <SettingItem label="Change Email" onPress={() => console.log('Change email')} showDivider />
      <SettingItem label="Language Preference" onPress={() => console.log('Language preference')} showDivider />

      <Text style={[styles.sectionHeader, textStyle]}>Dark Mode Setting</Text>
      <View style={[styles.row, bgStyle]}>
        <Text style={[styles.label, textStyle]}>Enable Dark Mode:</Text>
        <Switch value={theme === darkTheme} onValueChange={(val) => setCustomTheme?.(val)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  countryFlag: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  countryText: {
    fontSize: 14,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
  },
});

export default ProfileScreen;

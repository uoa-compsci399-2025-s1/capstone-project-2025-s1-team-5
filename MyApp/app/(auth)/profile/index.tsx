import React, { useEffect, useState , useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  Switch,
} from 'react-native';
import SettingItem from '@/components/SettingItem';
import { ThemeContext } from '../../contexts/ThemeContext';
import { darkTheme } from '@/app/theme/theme';
// Define the type for the component's props if needed (here we use an empty object)
interface ProfileScreenProps {}

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  // Replace these dummy handlers with your actual navigation functions
  const handlePress = (feature: string) => {
    // For now, we'll just show an alert
    Alert.alert(`Navigating to ${feature}`);
  };

  const { theme, setCustomTheme } = useContext(ThemeContext);

  
  return (
    <View style={[styles.container, {backgroundColor:theme.background}]}>
      {/* Header with profile image and info */}
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/profile/default.jpg')}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={[styles.name, {color : theme.text}]}>Jack Zhen</Text>
          <Text style={[styles.email,{color : theme.text}]}>jackz123@aucklanduni.ac.nz</Text>
          <View style={styles.countryContainer}>
            <Image
              source={{ uri: 'https://flagcdn.com/w20/cn.png' }} // China flag image example
              style={styles.countryFlag}
            />
            <Text style={[styles.countryText,{color : theme.text}]}>China</Text>
          </View>
        </View>
      </View>

      {/* Button grid */}
      <View style={styles.buttonGrid}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('My Courses')}
        >
          <Text style={styles.buttonText}>My Courses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('Accommodation')}
        >
          <Text style={styles.buttonText}>Accommodation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('Events')}
        >
          <Text style={styles.buttonText}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('Language')}
        >
          <Text style={styles.buttonText}>Language</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('Support')}
        >
          <Text style={styles.buttonText}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress('Map')}
        >
          <Text style={styles.buttonText}>Map</Text>
        </TouchableOpacity>
      </View>

      <View>
      <Text style={[{color : theme.text}]}>
        Settings
      </Text>
      <SettingItem label="Change Password" onPress={() => console.log('Change password')} showDivider/>
      <SettingItem label="Language Preference" onPress={() => console.log('Change password')} showDivider/>
    </View>
    <Text style={[styles.header,{color : theme.text}]}>Dark Mode Setting</Text>
      
      {/* 开关选择是否使用自定义主题 */}
      <View style={[styles.row, {backgroundColor: theme.background}]}>
        <Text style={[styles.label,{ color: theme.text }]}>Enable Dark Mode:</Text>
        <Switch
          value={theme === darkTheme}
          onValueChange={(val) => {
            if (setCustomTheme) setCustomTheme(val);
          }}
        />
      </View>
    </View>

  );
};

// Define the styling for the page
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
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
    color: '#333',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    width: '30%', // adjust the width for a two- or three-column layout
    backgroundColor: '#F9DCC4', // warm, soft color
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  info: {
    fontSize: 16,
    marginTop: 10,
    color: '#555',
    textAlign: 'center',
  },
});

export default ProfileScreen;

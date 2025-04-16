import React, { useContext } from 'react';
import { View, Alert, Switch, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; 

import { ThemeContext } from '@/contexts/ThemeContext';
import { UserContext } from '@/contexts/UserContext';
import { darkTheme } from '@/theme/theme';

import StyledText from '@/components/StyledText';
import ProfileOptionButton from '@/components/ProfileOptionButton';
import ProfileSettingButton from '@/components/ProfileSettingButton';
import ProfileSettingBox from '@/components/ProfileSettingBox';
import ProfileUserCard from '@/components/ProfileUserCard';

const ProfileScreen: React.FC = () => {
  const { theme, setCustomTheme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const router = useRouter(); 

  const features = ['My Courses', 'Housing', 'Events', 'Calendar', 'Support', 'Map'];

  const handleLogout = () => {
    console.log('Logging out...');
    // needs code to clear the user's session etc
    router.replace('/'); 
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ProfileUserCard
        avatar={user.avatar}
        name="Jack Zhen" // replace with user.name
        email="jackz123@aucklanduni.ac.nz" // replace with user.email
      />

      <View style={styles.bodyContent}>
        <View style={styles.buttonGrid}>
          {features.map((feature) => (
            <ProfileOptionButton
              key={feature}
              title={feature}
              onPress={() => Alert.alert(`Navigating to ${feature}`)}
            />
          ))}
        </View>

        <StyledText type="subtitle">Settings</StyledText>
        <ProfileSettingBox>
          <ProfileSettingButton
            label="Change Password"
            iconName="vpn-key"
            onPress={() => router.push('/Profile/changepassword')} 
            style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
          />
          <ProfileSettingButton
            label="Change Email"
            iconName="edit"
            onPress={() => router.push('/Profile/changeemail')} 
          />
          <ProfileSettingButton
            label="Language Preference"
            iconName="language"
            onPress={() => console.log('Language preference')}
          />
          <ProfileSettingButton
            label="Log Out"
            iconName="exit-to-app"
            onPress={handleLogout} 
            style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
          />
        </ProfileSettingBox>

        <StyledText type="subtitle">Dark Mode Setting</StyledText>
        <View style={styles.row}>
          <StyledText type="label">Enable Dark Mode:</StyledText>
          <Switch value={theme === darkTheme} onValueChange={(val) => setCustomTheme?.(val)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  bodyContent: {
    flex: 1,
    width: '100%',
    marginTop: 20,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default ProfileScreen;

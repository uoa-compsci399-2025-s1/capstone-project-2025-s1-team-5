import React, { useContext } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; 

import { ThemeContext } from '@/contexts/ThemeContext';
import { UserContext } from '@/contexts/UserContext';

import StyledText from '@/components/StyledText';
import ProfileOptionButton from '@/components/ProfileOptionButton';
import ProfileSettingButton from '@/components/ProfileSettingButton';
import ProfileSettingBox from '@/components/ProfileSettingBox';
import ProfileUserCard from '@/components/ProfileUserCard';

const ProfileScreen: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const router = useRouter(); 

  const features = ['Calendar', 'Support', 'Map'];

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
            label="Theme"
            iconName="palette"
            onPress={() => router.push('/Profile/theme')} 
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
    marginTop: 10,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default ProfileScreen;

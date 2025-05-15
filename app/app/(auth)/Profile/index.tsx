import React, { useContext, useMemo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { ThemeContext } from '@/contexts/ThemeContext';
import { UserContext } from '@/contexts/UserContext';

import ProfileOptionButton from '@/components/ProfileOptionButton';
import ProfileSettingButton from '@/components/ProfileSettingButton';
import ProfileSettingBox from '@/components/ProfileSettingBox';
import ProfileUserCard from '@/components/ProfileUserCard';
import StyledText from '@/components/StyledText';

const FEATURES = ['Programme', 'Support', 'Calendar', 'Map'] as const;

type ExtractRouteParams<T> = T extends `${infer Start}?${infer Rest}` ? Start : T;
type ValidRoutes = ExtractRouteParams<Parameters<ReturnType<typeof useRouter>['push']>[0]>;

const ProfileScreen: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    console.log('Logging out...');
    await SecureStore.deleteItemAsync('USER_TOKEN');
    await SecureStore.deleteItemAsync('USER_THEME_PREFERENCE');
    router.replace('/');
  }, [router]);

  const featureRoutes = useMemo(
    () =>
      FEATURES.map((feature) => {
        const path = feature.toLowerCase().replace(/\s+/g, '-');
        return {
          title: feature,
          route: `/Profile/${path}` as ValidRoutes,
        };
      }),
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.profileCardOuter}>
          <View style={styles.profileCardInner}>
            <ProfileUserCard
              avatar={user.avatar}
              name={user.first_name}
              email={user.email}
              country={user.country}
            />
          </View>
        </View>
      {/* This is the buttons for programme, support, calendar, and map */}
      <View style={styles.bodyContent}> 
        <View style={styles.buttonGrid}>
          {featureRoutes.map(({ title, route }, index) => {
            const isLeftmost = index % 2 === 0;
            const isRightmost = index % 2 === 1;

            return (
                <View key={title} style={styles.buttonOuter}>
                  <View style={styles.buttonInner}>
                    <ProfileOptionButton
                      title={title}
                      onPress={() => router.push(route)}
                      isLeftmost={isLeftmost}
                      isRightmost={isRightmost}
                    />
                  </View>
                </View>
            );
          })}
        </View>

        <ProfileSettingBox> {/* This is the settings box */}
           <ProfileSettingButton
             label="Change Profile Picture"
             iconName="tag-faces"
             onPress={() => router.push('/Profile/pfpselection' as ValidRoutes)}
             style={styles.topButton}
           />
          <ProfileSettingButton
            label="Change Password"
            iconName="vpn-key"
            onPress={() => router.push('/Profile/changepassword' as ValidRoutes)}
          />
          <ProfileSettingButton
            label="Theme Preference"
            iconName="palette"
            onPress={() => router.push('/Profile/theme' as ValidRoutes)}
          />
          <ProfileSettingButton
            label="Log Out"
            iconName="exit-to-app"
            onPress={handleLogout}
            style={styles.bottomButton}
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
    marginBottom: 10,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: "25%", //ok this might need to change as well
  },
  topButton: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomButton: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  profileCardOuter: {
    padding: 2, // inner border thickness
    borderRadius: 16,
    backgroundColor: '#0c0c48', // outer edge if needed
    alignItems: 'center',
    marginBottom: "3%",
  },
  profileCardInner: {
    backgroundColor: '#0c0c48',
    borderRadius: 14,
    width: '100%',
    padding: 16,
    borderWidth: 2,
    borderColor: '#0c0c48',
  },
  buttonOuter: {
    width: '48%',
    aspectRatio: 1.8, // maintain square-ish buttons
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#0c0c48', // outer border color
    padding: 5, // border thickness
  },
  buttonInner: {
    flex: 1,                       // Fills vertical space
    width: '100%',                // Fills horizontal space
    padding: 1,
    backgroundColor: '#0c0c48',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default ProfileScreen;

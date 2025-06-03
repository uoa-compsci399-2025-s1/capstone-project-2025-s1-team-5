import React, { useContext, useMemo, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { ThemeContext } from '@/contexts/ThemeContext';
import { UserContext } from '@/contexts/UserContext';

import ProfileOptionButton from '@/components/ProfileOptionButton';
import ProfileSettingButton from '@/components/ProfileSettingButton';
import ProfileSettingBox from '@/components/ProfileSettingBox';
import ProfileUserCard from '@/components/ProfileUserCard';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

const FEATURES = ['Programme', 'Campus Map'] as const;
const ICONS = ['insights', 'location-on'] as const;

type ExtractRouteParams<T> = T extends `${infer Start}?${infer Rest}`
  ? Start
  : T;
type ValidRoutes = ExtractRouteParams<
  Parameters<ReturnType<typeof useRouter>['push']>[0]
>;

const ProfileScreen: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await SecureStore.deleteItemAsync('USER_TOKEN');
    await SecureStore.deleteItemAsync('USER_THEME_PREFERENCE');
    router.replace('/');
  }, [router]);

  const featureRoutes = useMemo(
    () =>
      FEATURES.map((feature, index) => {
        const path = feature.toLowerCase().replace(/\s+/g, '');
        return {
          title: feature,
          route: `/Profile/${path}` as ValidRoutes,
          iconName: ICONS[index],
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

      <View style={styles.bodyContent}>
        <View style={styles.buttonGrid}>
          {featureRoutes.map(({ title, route, iconName }, index) => {
            const isLeftmost = index % 2 === 0;
            const isRightmost = index % 2 === 1;

            return (
              <View key={title} style={styles.buttonOuter}>
                <View style={styles.buttonInner}>
                  <ProfileOptionButton
                    title={title}
                    onPress={() => router.push(route)}
                    iconName={iconName}
                    isLeftmost={isLeftmost}
                    isRightmost={isRightmost}
                  />
                </View>
              </View>
            );
          })}
        </View>

        <ProfileSettingBox>
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
    marginBottom: 16,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 5,
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
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#0c0c48',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: '1.5%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
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
    aspectRatio: 1.0,
    marginBottom: 9,
    marginTop: 7,
    borderRadius: 12,
    backgroundColor: '#0c0c48',
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  buttonInner: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0c0c48',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexDirection: 'column',
    paddingVertical: 25,
    gap: 6,
  },
});

export default ProfileScreen;

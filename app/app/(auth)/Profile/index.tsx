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

const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

const FEATURES = ['Programme', 'Map'] as const;
const ICONS = ['insights', 'location-on'] as const;

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
      FEATURES.map((feature, index) => {
        const path = feature.toLowerCase().replace(/\s+/g, '-');
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
    paddingHorizontal: moderateScale(24),
    paddingTop: verticalScale(28),
    paddingBottom: verticalScale(8),
  },
  bodyContent: {
    flex: 1,
    width: '100%',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(16),
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: verticalScale(5),
  },
  topButton: {
    borderTopLeftRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10),
  },
  bottomButton: {
    borderBottomLeftRadius: moderateScale(10),
    borderBottomRightRadius: moderateScale(10),
  },
  profileCardOuter: {
    padding: moderateScale(4),
    borderRadius: moderateScale(12),
    backgroundColor: '#0c0c48',
    alignItems: 'center',
    marginBottom: verticalScale(5),
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
    borderRadius: moderateScale(14),
    width: '100%',
    padding: moderateScale(16),
    borderWidth: moderateScale(2),
    borderColor: '#0c0c48',
  },
  buttonOuter: {
    width: '48%',
    aspectRatio: 1.0,
    marginBottom: verticalScale(21),
    marginTop: verticalScale(7),
    borderRadius: moderateScale(12),
    backgroundColor: '#0c0c48',
    padding: moderateScale(4),
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
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexDirection: 'column',
    paddingVertical: verticalScale(25),
    gap: verticalScale(6),
  },
});

export default ProfileScreen;

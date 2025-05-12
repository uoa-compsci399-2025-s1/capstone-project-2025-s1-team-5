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

const FEATURES = ['Calendar', 'Support', 'Map', 'Programme'] as const;

type ExtractRouteParams<T> = T extends `${infer Start}?${infer Rest}` ? Start : T;
type ValidRoutes = ExtractRouteParams<Parameters<ReturnType<typeof useRouter>['push']>[0]>;

const ProfileScreen: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    console.log('Logging out...');
    await SecureStore.deleteItemAsync('USER_TOKEN');
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
      <ProfileUserCard
        avatar={user.avatar}
        name={user.first_name}
        email={user.email}
      />

      <View style={styles.bodyContent}>
        <View style={styles.buttonGrid}>
          {featureRoutes.map(({ title, route }) => (
            <ProfileOptionButton
              key={title}
              title={title}
              onPress={() => router.push(route)}
            />
          ))}
        </View>

        <ProfileSettingBox>
          <ProfileSettingButton
            label="Change Password"
            iconName="vpn-key"
            onPress={() => router.push('/Profile/changepassword' as ValidRoutes)}
            style={styles.topButton}
          />
          <ProfileSettingButton
            label="Theme"
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
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  topButton: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomButton: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default ProfileScreen;
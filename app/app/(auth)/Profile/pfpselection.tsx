import React, { useContext, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { UserContext } from '@/contexts/UserContext';
import { ThemeContext } from '@/contexts/ThemeContext';
import profileAvatars from '@/constants/profileAvatars';
import SubmitButton from '@/components/SubmitButton';
import api from '@/app/lib/api';

const { width, height } = Dimensions.get('window');

const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

const ProfilePicSelectionScreen: React.FC = () => {
  const { user, setUser } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(user.avatar);
  const router = useRouter();
  const params = useLocalSearchParams();
  const isFirstTime = params.isFirstTime === 'true';

  const handleSelection = (avatarKey: string) => {
    setSelectedAvatar(avatarKey);
  };

  const handleConfirmUpdate = async () => {
    try {
      const res = await api.patch<{ message: string }>('/users/me/avatar', {
        avatar: selectedAvatar,
      });
      setUser({ ...user, avatar: selectedAvatar });

      if (isFirstTime) {
        router.replace('/Profile');
      } else {
        router.back();
      }
    } catch (e) {
      console.error('Avatar update failed', e);
    }
  };

  const avatarKeys = Object.keys(profileAvatars);
  const avatarImages = avatarKeys.map((key) => ({
    key,
    source: profileAvatars[key],
  }));

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View style={styles.currentAvatarContainer}>
        <Image
          source={profileAvatars[selectedAvatar]}
          style={[
            styles.currentAvatar,
            { borderColor: theme.primary }, 
          ]}
        />
      </View>

      <FlatList
        data={avatarImages}
        numColumns={3}
        contentContainerStyle={styles.flatListContent}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.avatarItem}
            onPress={() => handleSelection(item.key)}
          >
            <Image
              source={item.source}
              style={[
                styles.presetImage,
                selectedAvatar === item.key && {
                  borderColor: theme.primary,
                  borderWidth: moderateScale(3),
                },
              ]}
            />
          </TouchableOpacity>
        )}
      />

      <View style={styles.confirmButtonContainer}>
        <SubmitButton text="Update Profile Picture" onPress={handleConfirmUpdate} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
  },
  currentAvatarContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
    marginTop: verticalScale(20),
  },
  currentAvatar: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    borderWidth: moderateScale(3),
  },
  flatListContent: {
    justifyContent: 'center',
    paddingBottom: verticalScale(16),
  },
  avatarItem: {
    flex: 1,
    alignItems: 'center',
    margin: moderateScale(16),
    maxWidth: width / 3 - moderateScale(16),
  },
  presetImage: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
  },
  confirmButtonContainer: {
    marginBottom: verticalScale(20),
    paddingHorizontal: moderateScale(16),
  },
});

export default ProfilePicSelectionScreen;
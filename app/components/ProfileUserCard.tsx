import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import StyledText from '@/components/StyledText';
import profileAvatars from '@/constants/profileAvatars';

interface ProfileUserCardProps {
  avatar: string;
  name: string;
  email: string;
}

const CountryTag = () => (
  <View style={styles.countryContainer}>
    <Image source={{ uri: 'https://flagcdn.com/w20/cn.png' }} style={styles.countryFlag} />
    <StyledText type="label">China</StyledText>
  </View>
);

const ProfileUserCard: React.FC<ProfileUserCardProps> = ({ avatar, name, email }) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('./Profile/pfpselection')}>
        <Image
          source={profileAvatars[avatar] || profileAvatars.default}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <View style={styles.profileInfo}>
        <StyledText type="title">{name}</StyledText>
        <StyledText type="subtitle">{email}</StyledText>
        <CountryTag />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  profileInfo: {
    marginLeft: 16,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  countryFlag: {
    width: 30,
    height: 20,
    marginRight: 8,
  },
});

export default ProfileUserCard;

import React, { useContext } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';
import profileAvatars from '@/constants/profileAvatars';

interface ProfileUserCardProps {
  avatar: string;
  name: string;
  email: string;
}


const CountryTag: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={styles.countryContainer}>
      <Image source={{ uri: 'https://flagcdn.com/w20/cn.png' }} style={styles.countryFlag} />
      <StyledText type="label" style={{ color: theme.subtextOne }}>China</StyledText>
    </View>
  )
};

const ProfileUserCard: React.FC<ProfileUserCardProps> = ({ avatar, name, email }) => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('./Profile/pfpselection')}>
        <Image
          source={profileAvatars[avatar] || profileAvatars.default}
          style={[styles.profileImage,{ borderColor: theme.primary }]}
        />
      </TouchableOpacity>
      <View style={styles.profileInfo}>
        <StyledText type="title" style={{ color: theme.text }}>{name}</StyledText>
        <StyledText type="subtitle" style={{ color: theme.subtextOne }}>{email}</StyledText>
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

import React, { useContext } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';
import profileAvatars from '@/constants/profileAvatars';
import countries from 'world-countries';

const { width } = Dimensions.get('window');

interface ProfileUserCardProps {
  avatar: string;
  name: string;
  email: string;
  country: string;
}

const CountryTag: React.FC<{ country: string }> = ({ country }) => {
  const { theme } = useContext(ThemeContext);
  const countryObj = countries.find(c => c.name.common === country);
  const code = countryObj?.cca2.toLowerCase();
  const uri = `https://flagcdn.com/256x192/${code}.png`;

  return (
    <View style={styles.countryContainer}>
      <Image source={{ uri }} style={styles.countryFlag} />
      <View style={styles.countryTextWrapper}>
        <StyledText
          type="label"
          style={styles.countryText}
        >
          {country}
        </StyledText>
      </View>
    </View>
  );
};

const ProfileUserCard: React.FC<ProfileUserCardProps> = ({ avatar, name, email, country }) => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('./Profile/pfpselection')}>
        <Image
          source={profileAvatars[avatar] || profileAvatars.default}
          style={[styles.profileImage, { borderColor: theme.primary }]}
        />
      </TouchableOpacity>
      <View style={styles.profileInfo}>
        <StyledText type="title" style={[styles.name, { color: '#ffffff' }]}>{name}</StyledText>
        <StyledText type="subtitle" style={[styles.email, { color: '#ffffff' }]}>{email}</StyledText>
        <View style={styles.countryWrapper}>
          <CountryTag country={country} />
        </View>
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
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    borderWidth: 2,
  },
  profileInfo: {
    marginLeft: '6%',
    flex: 1,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  countryFlag: {
    width: 24,
    height: 16,
    marginRight: 8,
    resizeMode: 'contain',
  },
  countryTextWrapper: {
    flexShrink: 1,
    maxWidth: '80%',
  },
  countryText: {
    color: '#ffffff',
    flexWrap: 'wrap',
  },
  name: {
    marginBottom: '2%',
  },
  email: {
    marginBottom: '2%',
  },
  countryWrapper: {
    marginTop: '2%',
  },
});

export default ProfileUserCard;

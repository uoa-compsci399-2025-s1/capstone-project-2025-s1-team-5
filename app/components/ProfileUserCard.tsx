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
      <StyledText
        type="label"
        style={styles.countryText}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {country}
      </StyledText>
    </View>
  );
};

const ProfileUserCard: React.FC<ProfileUserCardProps> = ({ avatar, name, email, country }) => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.header, { minHeight: width * 0.35 }]}>
      <TouchableOpacity onPress={() => router.push('./Profile/pfpselection')}>
        <Image
          source={profileAvatars[avatar] || profileAvatars.default}
          style={[styles.profileImage, { borderColor: theme.primary }]}
        />
      </TouchableOpacity>
      <View style={styles.profileInfo}>
        <StyledText
          type="title"
          style={styles.name}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {name}
        </StyledText>
        <StyledText
          type="subtitle"
          style={styles.email}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {email}
        </StyledText>
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
    minHeight: 120,
    paddingVertical: 10,
  },
  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: (width * 0.3) / 2,
    borderWidth: 2,
  },
  profileInfo: {
    marginLeft: width * 0.06,
    flex: 1,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: width * 0.6,
  },
  countryFlag: {
    width: width * 0.10,
    height: width * 0.06,
    marginRight: width * 0.03,
    borderRadius: 2,
  },
  countryText: {
    color: '#ffffff',
    flexShrink: 1,
    flex: 1,
  },
  name: {
    marginBottom: width * 0.01,
    color: '#ffffff',
    flexShrink: 1,
    flexWrap: 'nowrap',
    maxWidth: width * 0.5,
  },
  email: {
    marginBottom: width * 0.01,
    color: '#ffffff',
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: 20,
    maxWidth: width * 0.5,
  },
  countryWrapper: {
    marginTop: width * 0.01,
  },
});

export default ProfileUserCard;

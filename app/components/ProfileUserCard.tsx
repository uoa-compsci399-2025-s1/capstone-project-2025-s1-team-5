import React, { useContext } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';
import profileAvatars from '@/constants/profileAvatars';
import countries from 'world-countries';

interface ProfileUserCardProps {
  avatar: string;
  name: string;
  email: string;
  country: string;
}


const CountryTag: React.FC<{ country: string }> = ({ country }) => {
  const { theme } = useContext(ThemeContext);
  const countryObj = countries.find(c => c.name.common === country)
  const code =countryObj?.cca2.toLowerCase();
  const uri = `https://flagcdn.com/256x192/${code}.png`
  return (
    <View style={styles.countryContainer}>
      <Image source={{ uri }} style={styles.countryFlag} />
      <StyledText type="label" style={{ color: '#ffffff' }}>{country}</StyledText>
    </View>
  )
};

const ProfileUserCard: React.FC<ProfileUserCardProps> = ({ avatar, name, email, country}) => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('./Profile/pfpselection')}>
        <Image source={profileAvatars[avatar] || profileAvatars.default} style={[styles.profileImage,{ borderColor: theme.primary }]}/>
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
  profileImage: { //The pfp avatar
    width: 120,
    height: 120,
    borderRadius: 100,
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
    marginTop: "4%",
    marginRight: 8,
  },
  name: {
      marginBottom: "12%",
    },
    email: {
      marginBottom: "4%",
    },
    countryWrapper: {
      marginTop: "4%",
    },
});

export default ProfileUserCard;

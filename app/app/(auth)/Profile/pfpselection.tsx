import React, {useContext, useState} from 'react';
import { View, Image, TouchableOpacity, FlatList, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '@/contexts/UserContext';
import profileAvatars from '@/constants/profileAvatars';
import SubmitButton from '@/components/SubmitButton';
import api from '@/app/lib/api';

const ProfilePicSelectionScreen: React.FC = () => {
    const { user, setUser } = useContext(UserContext);
    const [selectedAvatar, setSelectedAvatar] = useState<string>(user.avatar);
    const navigation = useNavigation();

    const handleSelection = (avatarKey: string) => {
        setSelectedAvatar(avatarKey);
    };

    const handleConfirmUpdate = async () => {
      try {
        console.log(`Updating avatar to: ${selectedAvatar}`);
        const res = await api.patch<{ message: string }>('/users/me/avatar', {
          avatar: selectedAvatar,
        });
          console.log(res.data.message);
          setUser({ ...user, avatar: selectedAvatar });
          navigation.goBack();
        } catch (e) {
          console.error('Avatar update failed', e);
        }
      }
          
    const avatarKeys = Object.keys(profileAvatars);
    const avatarImages = avatarKeys.map(key => ({ key, source: profileAvatars[key] }));

    return (
    <View style={styles.container}>
        <View style={styles.currentAvatarContainer}>
        <Image source={profileAvatars[selectedAvatar]} style={styles.currentAvatar} />
        </View>

        <FlatList
        data={avatarImages}
        numColumns={3} 
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
            <TouchableOpacity style={styles.avatarItem} onPress={() => handleSelection(item.key)}>
            <Image source={item.source} style={[styles.presetImage, selectedAvatar === item.key && styles.selectedImage,]}/>
            </TouchableOpacity>
        )}
        />

        <View style={styles.confirmButtonContainer}>
        <SubmitButton text="Update Profile Picture" onPress={handleConfirmUpdate}/>
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: "4%",
      backgroundColor: '#ffffff',
    },
    currentAvatarContainer: {
      alignItems: 'center',
      marginBottom: "6%",
      marginTop: "4.5%",
    },
    currentAvatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: '#0c0c48',
    },
    avatarItem: {
      flex: 1,
      alignItems: 'center',
      margin: "3.25%",
    },
    presetImage: {
      width: 90,
      height: 90,
      borderRadius: 100,
    },
    selectedImage: {
      borderWidth: 3,
      borderColor: '#0c0c48',
    },
    confirmButtonContainer: {
      marginBottom: "1%",
    },
  });
export default ProfilePicSelectionScreen;

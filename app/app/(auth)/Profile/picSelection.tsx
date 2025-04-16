import React, {useContext, useState} from 'react';
import { View, Image, TouchableOpacity, FlatList, StyleSheet, Alert, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '@/contexts/UserContext';
import profileAvatars from '@/constants/profileAvatars';

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
          // await updateAvatarAPI({ userId: user.id, avatar: selectedAvatar });
    
          setUser({ ...user, avatar: selectedAvatar });
          navigation.goBack();
        } catch (error) {
          Alert.alert('error', 'Please try again!');
        }
      };

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
            <Image
                source={item.source}
                style={[
                styles.presetImage,
                selectedAvatar === item.key && styles.selectedImage,
                ]}
            />
            </TouchableOpacity>
        )}
        />

        <View style={styles.confirmButtonContainer}>
        <Button title="Update Profile Picture" onPress={handleConfirmUpdate} />
        </View>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    currentAvatarContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    currentAvatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: '#00467f',
    },
    avatarItem: {
      flex: 1,
      alignItems: 'center',
      margin: 8,
    },
    presetImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    selectedImage: {
      borderWidth: 3,
      borderColor: '#00467f',
    },
    confirmButtonContainer: {
      marginTop: 20,
    },
  });
export default ProfilePicSelectionScreen;

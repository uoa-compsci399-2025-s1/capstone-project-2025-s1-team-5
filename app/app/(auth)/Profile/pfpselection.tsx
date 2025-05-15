import React, { useContext, useState } from 'react';
import { View, Image, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '@/contexts/UserContext';
import profileAvatars from '@/constants/profileAvatars';
import SubmitButton from '@/components/SubmitButton';
import api from '@/app/lib/api';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => (width / 375) * size; // 375 is base width (iPhone 6/7/8)
const verticalScale = (size: number) => (height / 812) * size; // 812 is base height (iPhone X)
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

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
                <Image 
                    source={profileAvatars[selectedAvatar]} 
                    style={styles.currentAvatar} 
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
                                selectedAvatar === item.key && styles.selectedImage
                            ]}
                        />
                    </TouchableOpacity>
                )}
            />

            <View style={styles.confirmButtonContainer}>
                <SubmitButton 
                    text="Update Profile Picture" 
                    onPress={handleConfirmUpdate}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(16),
        backgroundColor: '#ffffff',
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
        borderColor: '#0c0c48',
    },
    flatListContent: {
        justifyContent: 'center',
        paddingBottom: verticalScale(16),
    },
    avatarItem: {
        flex: 1,
        alignItems: 'center',
        margin: moderateScale(16),
        maxWidth: width / 3 - moderateScale(16), // Ensure 3 items fit across
    },
    presetImage: {
        width: moderateScale(90),
        height: moderateScale(90),
        borderRadius: moderateScale(45),
    },
    selectedImage: {
        borderWidth: moderateScale(3),
        borderColor: '#0c0c48',
    },
    confirmButtonContainer: {
        marginBottom: verticalScale(20),
        paddingHorizontal: moderateScale(16),
    },
});

export default ProfilePicSelectionScreen;
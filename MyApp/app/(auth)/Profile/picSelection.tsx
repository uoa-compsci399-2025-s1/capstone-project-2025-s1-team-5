// app/profile/ProfilePicSelectionScreen.tsx
import React from 'react';
import { View, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// 定义一个预设头像数组（这些图片需要预先放在项目的 assets 文件夹中）
const presetImages = [
    require('@/assets/images/profile/cat.png'),
    require('@/assets/images/profile/deer.png'),
    require('@/assets/images/profile/default.jpg'),
    require('@/assets/images/profile/dog.png'),
    require('@/assets/images/profile/fox.png'),
    require('@/assets/images/profile/koala.png'),
    require('@/assets/images/profile/lion.png'),
    require('@/assets/images/profile/panda.png'),
    require('@/assets/images/profile/penguin.png'),
    require('@/assets/images/profile/rabbit.png'),
  // 根据需要添加更多头像
];

const ProfilePicSelectionScreen: React.FC = () => {
  const navigation = useNavigation();

  // 模拟选中头像后的处理逻辑
  const handleSelection = (selectedImage: any) => {
    // TODO：这里需要更新用户头像，例如通过 Context 更新全局状态，
    // 也可以调用回调函数传回 Profile 页面，将新头像保存到用户数据中
    console.log('Selected image: ', selectedImage);

    // 更新头像后返回上一级页面
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={presetImages}
        numColumns={3} // 三列显示
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelection(item)}>
            <Image source={item} style={styles.presetImage} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  presetImage: {
    width: 100,
    height: 100,
    margin: 8,
    borderRadius: 50, // 如果希望头像为圆形
  },
});

export default ProfilePicSelectionScreen;

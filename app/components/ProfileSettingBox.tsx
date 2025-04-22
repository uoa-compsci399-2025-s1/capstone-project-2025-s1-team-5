import React, {useContext} from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';

type ProfileSettingBoxProps = {
  children: React.ReactNode;
};

export default function ProfileSettingBox({ children }: ProfileSettingBoxProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

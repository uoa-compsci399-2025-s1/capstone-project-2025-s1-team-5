import React from 'react';
import { View, StyleSheet } from 'react-native';
import useTheme from '@/hooks/useTheme';

type ProfileSettingBoxProps = {
  children: React.ReactNode;
};

export default function ProfileSettingBox({ children }: ProfileSettingBoxProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderColor: theme.background }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

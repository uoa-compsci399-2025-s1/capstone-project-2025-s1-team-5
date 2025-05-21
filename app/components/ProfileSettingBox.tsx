import React from 'react';
import { View, StyleSheet } from 'react-native';

type ProfileSettingBoxProps = {
  children: React.ReactNode;
};

export default function ProfileSettingBox({ children }: ProfileSettingBoxProps) {
  return (
    <View style={styles.container}>{children}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: "10%",
  },
});

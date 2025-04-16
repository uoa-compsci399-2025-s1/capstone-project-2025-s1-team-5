import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useTheme from '@/hooks/useTheme';

type DropDownMenuProps = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: string[];
  placeholder: string;
  iconName?: 'public' | 'library-books'; 
  iconSize?: number; 
};

export default function DropDownMenu({
  selectedValue,
  onValueChange,
  items,
  placeholder,
  iconName,
  iconSize = 20,
}: DropDownMenuProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      {!selectedValue && (
        <View style={styles.placeholderOverlay}>
          {iconName && (
            <MaterialIcons
              name={iconName}
              size={iconSize}
              style={styles.icon}
              color= '#000000'
            />
          )}
          <Text style={[styles.placeholderText, { color: theme.subtextOne }]}>{placeholder}</Text>
        </View>
      )}

      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={[
          styles.picker, 
          { 
            color: selectedValue ? theme.text : 'transparent',
            paddingLeft: iconName ? 40 : 20, 
          }
        ]}
        dropdownIconColor={theme.text}
      >
        <Picker.Item label={placeholder} value="" enabled={false} />
        {items.map((item, index) => (
          <Picker.Item key={index} label={item} value={item} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 50,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  placeholderOverlay: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: 10, 
    top: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  icon: {
    marginRight: 10, 
  },
  placeholderText: {
    fontSize: 16,
  },
  picker: {
    width: '100%',
    height: '100%',
    paddingRight: 20,
    fontSize: 16,
  },
});
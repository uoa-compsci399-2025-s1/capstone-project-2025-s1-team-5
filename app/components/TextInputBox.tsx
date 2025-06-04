import React, { useState, useContext } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  TextStyle,
} from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type TextInputBoxProps = {
  placeholder: string;
  value: string;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  secureTextEntry?: boolean;
  iconName?: 'email' | 'lock' | 'person' | 'edit' | 'group' | 'phone' | 'message';
  iconSize?: number;
  style?: StyleProp<TextStyle>;
  multiline?: boolean;
  numberOfLines?: number;
};

export default function TextInputBox({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry = false,
  iconName,
  iconSize = 20,
  style,
  multiline = false,
  numberOfLines,
}: TextInputBoxProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        placeholderTextColor={theme.subtextOne}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundSecondary,
            color: theme.text,
            height: multiline ? (numberOfLines ? numberOfLines * 24 : 120) : 50,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          iconName && { paddingLeft: 40 },
          style,
        ]}
      />
      {iconName && (
        <MaterialIcons name={iconName} size={iconSize} color={theme.text} style={styles.icon} />
      )}
      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.eyeIcon}
        >
          <MaterialIcons
            name={isPasswordVisible ? 'visibility' : 'visibility-off'}
            size={iconSize}
            color={theme.text}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  icon: {
    position: 'absolute',
    left: 10,
  },
  input: {
    width: '100%',
    paddingHorizontal: 20,
    borderRadius: 10,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
});

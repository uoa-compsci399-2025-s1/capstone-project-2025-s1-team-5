import React, { useContext, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
  Keyboard,
  Text,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ThemeContext } from '@/contexts/ThemeContext';

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
  const { theme } = useContext(ThemeContext);
  const [visible, setVisible] = useState(false);

  const close = () => {
    Keyboard.dismiss();
    setVisible(false);
  };

  const displayText = selectedValue || placeholder;
  const displayColor = selectedValue ? theme.text : theme.subtextOne;

  return (
    <>
      <View style={styles.container}>
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={iconSize}
            color={theme.text}
            style={styles.icon}
          />
        )}
        <TouchableOpacity
          style={[
            styles.input,
            { 
              backgroundColor: theme.backgroundSecondary,
              height: 50,
              paddingLeft: iconName ? 40 : 20, 
            }
          ]}
          activeOpacity={0.7}
          onPress={() => setVisible(true)}
        >
          <Text
            style={[
              styles.label,
              {
                color: displayColor,
                lineHeight: 20, 
              },
            ]}
          >
            {displayText}
          </Text>
          <MaterialIcons 
            name="keyboard-arrow-down" 
            size={24} 
            color={theme.text} 
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>
      </View>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={close} />
        <View style={[styles.modal, { backgroundColor: theme.background }]}>
          <FlatList
            data={items}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onValueChange(item);
                  close();
                }}
              >
                <Text style={[styles.itemText, { color: theme.text }]}>{item}</Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <TouchableOpacity style={styles.cancel} onPress={close}>
                <Text style={[styles.cancelText, { color: theme.text }]}>Cancel</Text>
              </TouchableOpacity>
            }
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    paddingRight: 20, 
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: 15,
    zIndex: 1,
  },
  label: {
    fontSize: 16,
    includeFontPadding: false,
    textAlignVertical: 'center',
    paddingVertical: 15, 
  },
  dropdownIcon: {
    position: 'absolute',
    right: 10,
    top: 13,
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  modal: {
    maxHeight: Platform.OS === 'ios' ? '50%' : '60%',
    marginHorizontal: 20,
    marginVertical: 'auto',
    borderRadius: 10,
    overflow: 'hidden',
  },
  item: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    fontSize: 16,
  },
  cancel: {
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
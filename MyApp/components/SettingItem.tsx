import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SettingItemProps {
    label: string;
    onPress: () => void;
    showDivider?: boolean;
  }

const SettingItem: React.FC<SettingItemProps> = ({ label, onPress, showDivider}) => {
    return (
        <View style = {{backgroundColor: '#dbdad5'}}>
            <TouchableOpacity style={styles.button} onPress={onPress}>
                <Text style={styles.text}>{label}</Text>
                <Text style={styles.text}>{'>'}</Text>
            </TouchableOpacity>
            {showDivider && <View style={styles.divider} />}
        </View>
      
    );
  };
  const styles = StyleSheet.create({
    button: {
        backgroundColor: '#dbdad5',
        padding: 10,
        fontSize: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#fff',
        width: '95%',
        alignSelf: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
  })

  export default SettingItem;
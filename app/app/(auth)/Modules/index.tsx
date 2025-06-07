import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useIsFocused } from '@react-navigation/native';
import ModuleButton from '@/components/ModuleButton'; 

import api from '@/app/lib/api';

interface ModuleItem {
  id: string;
  title: string;
  iconKey?: string;
}

export default function ModuleScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { theme } = useContext(ThemeContext);  
  const [modules, setModules] = useState<ModuleItem[]>([]);

  useEffect(() => {
    if (!isFocused) return;
    api
      .get<{ modules: ModuleItem[]; total: number }>('/modules')
      .then(res => {
        setModules(res.data.modules);
      })
      .catch(err => {
        console.error('Fetching Modules List Error', err);
      });
  }, [isFocused]);

  const handleModulePress = (module: ModuleItem) => {
    router.push({
      pathname: '/Modules/[moduleId]',
      params: {
        moduleId: module.id,
        title: module.title,
        iconKey: module.iconKey,
      }
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {modules.map(m => (
        <ModuleButton
          key={m.id}
          title={m.title}
          iconKey={m.iconKey}  
          onPress={() => handleModulePress(m)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    padding: 5,
  },
});

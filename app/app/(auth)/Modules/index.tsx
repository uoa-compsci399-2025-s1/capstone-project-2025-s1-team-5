import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import SubModuleButton from '@/components/SubModuleButton';
import { useIsFocused } from '@react-navigation/native';

import api from '@/app/lib/api';

interface ModuleItem {
  id: string;
  title: string;
}

export default function ModuleScreen(){
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {modules.map(m => (
        <SubModuleButton
          key={m.id}
          title={m.title}
          onPress={() => router.push({
              pathname: `/Modules/${m.id}`,
              params: {
                  moduleId: m.id,
                  title: m.title,
                  }})
              }
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

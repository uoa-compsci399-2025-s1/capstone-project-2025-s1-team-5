import React, { useContext } from 'react';
import { Tabs } from 'expo-router';
import { ThemeContext } from '@/contexts/ThemeContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function Layout() {
  return (
    <LayoutInner />
  );
}

function LayoutInner() {
  const { theme, isDarkMode } = useContext(ThemeContext);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          const iconColor = isDarkMode
            ? (focused ? '#ffffff' : theme.subtextOne)
            : color;

          if (route.name === 'Modules') {
            return <MaterialIcons name="menu-book" size={size} color={iconColor} />;
          } else if (route.name === 'Support') {
            return <MaterialIcons name="attribution" size={size} color={iconColor} />;
          } else if (route.name === 'Profile') {
            return (
              <MaterialIcons
                name={focused ? 'person' : 'person-outline'}
                size={size}
                color={iconColor}
              />
            );
          }
          return null;
        },
        tabBarActiveTintColor: isDarkMode ? '#ffffff' : '#ffffff',
        tabBarInactiveTintColor: isDarkMode ? theme.subtextOne : theme.subtextOne,
        tabBarStyle: {
          backgroundColor: isDarkMode ? theme.primary : "#0c0c48",
          borderTopWidth: isDarkMode ? 0 : 1, 
          borderTopColor: isDarkMode ? 'transparent' : theme.primary, 
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarIconStyle: {
          marginTop: 3,
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="Modules" />
      <Tabs.Screen name="Support" />
      <Tabs.Screen name="Profile" />
    </Tabs>
  );
}

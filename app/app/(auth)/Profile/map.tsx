import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image, Animated, PanResponder } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';

export default function MapScreen() {
  const { theme } = useContext(ThemeContext);
  const [scale, setScale] = useState(new Animated.Value(1));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [null, { dy: scale }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {},
  });
  //neeed to link to cms so admin can update the map
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StyledText type="subtitle" style={[styles.subtitle, { color: theme.text }]}>
        Explore the Campus
      </StyledText>
      <StyledText type="default" style={[styles.content, { color: theme.text }]}>
        Get to know the vibrant heart of our city campus and uncover key locations and landmarks.
      </StyledText>

      <Animated.View
        style={[styles.zoomContainer, { transform: [{ scale }] }]}
        {...panResponder.panHandlers}
      >
        <Image
          source={require('@/assets/logos/CampusMap.png')}
          style={styles.mapImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  subtitle: {
    marginBottom: 16,
  },
  content: {
    lineHeight: 24,
  },
  zoomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    height: '60%',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
});

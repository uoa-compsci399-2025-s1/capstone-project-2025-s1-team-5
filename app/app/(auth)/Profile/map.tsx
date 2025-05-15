import React, { useState } from 'react';
import { View, StyleSheet, Image, Animated, PanResponder } from 'react-native';
import StyledText from '@/components/StyledText';

export default function MapScreen() {
  const [scale, setScale] = useState(new Animated.Value(1)); 
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove: Animated.event(
      [
        null, 
        { dy: scale }, 
      ],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {},
  });
  
  //link to cms/backend?

  return (
    <View style={styles.container}>
      <StyledText type="subtitle" style={styles.subtitle}>Explore the Campus</StyledText>
      <StyledText type="default" style={styles.content}>
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

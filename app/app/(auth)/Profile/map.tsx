import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export default function MapScreen() {
  const { theme } = useContext(ThemeContext);

  // Shared values for animation
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offset = useSharedValue({ x: 0, y: 0 });

  // Pinch to zoom gesture
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      // Limit scale between 1 and 3 (no zoom out beyond original size)
      if (scale.value < 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
      } else if (scale.value > 3) {
        scale.value = withTiming(3);
        savedScale.value = 3;
      }
    });

  // Pan gesture
  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      offset.value = {
        x: translateX.value,
        y: translateY.value,
      };
    })
    .onUpdate((e) => {
      // Only allow panning when zoomed in
      if (savedScale.value > 1) {
        translateX.value = offset.value.x + e.translationX;
        translateY.value = offset.value.y + e.translationY;
      }
    });

  // Double tap gesture
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .onStart((e) => {
      if (savedScale.value > 1) {
        // Zoom out to original size (scale = 1)
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedScale.value = 1;
        offset.value = { x: 0, y: 0 };
      } else {
        // Zoom in
        scale.value = withTiming(2);
        savedScale.value = 2;
        // Center on tap location
        translateX.value = withTiming(-e.absoluteX * 1 + 100);
        translateY.value = withTiming(-e.absoluteY * 1 + 100);
        offset.value = {
          x: -e.absoluteX * 1 + 100,
          y: -e.absoluteY * 1 + 100,
        };
      }
    });

  // Combine gestures (pinch + pan + double tap)
  const composedGestures = Gesture.Simultaneous(
    pinchGesture,
    Gesture.Race(doubleTapGesture, panGesture)
  );

  // Animated style for the image
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StyledText type="subtitle" style={[styles.subtitle, { color: theme.text }]}>
          Explore the Campus
        </StyledText>
        <StyledText type="default" style={[styles.content, { color: theme.text }]}>
          Get to know the vibrant heart of our city campus and uncover key locations and landmarks.
        </StyledText>

        <View style={styles.mapContainer}>
          <GestureDetector gesture={composedGestures}>
            <Animated.View style={styles.zoomContainer}>
              <Animated.Image
                source={require('@/assets/logos/CampusMap.png')}
                style={[styles.mapImage, imageAnimatedStyle]}
                resizeMode="contain"
              />
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </GestureHandlerRootView>
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
    marginBottom: 20,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  zoomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
});

import React, { useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function MapScreen() {
  const { theme } = useContext(ThemeContext);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offset = useSharedValue({ x: 0, y: 0 });

  const [imageRatio, setImageRatio] = React.useState(1);
  const containerWidth = screenWidth;
  const containerHeight = screenHeight * 0.61;

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      const minScale = Math.min(
        containerWidth / (containerWidth * imageRatio),
        containerHeight / (containerHeight * imageRatio)
      );
      if (scale.value < minScale) {
        scale.value = withTiming(minScale);
        savedScale.value = minScale;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        offset.value = { x: 0, y: 0 };
      } else if (scale.value > 3) {
        scale.value = withTiming(3);
        savedScale.value = 3;
      }
    });

  const panGesture = Gesture.Pan()
    .minDistance(10)
    .onStart(() => {
      offset.value = {
        x: translateX.value,
        y: translateY.value,
      };
    })
    .onUpdate((e) => {
      if (savedScale.value > 1) {
        const scaledWidth = containerWidth * savedScale.value;
        const scaledHeight = containerHeight * savedScale.value;
        const maxX = (scaledWidth - containerWidth) / 2;
        const maxY = (scaledHeight - containerHeight) / 2;
        translateX.value = Math.max(
          Math.min(offset.value.x + e.translationX, maxX),
          -maxX
        );
        translateY.value = Math.max(
          Math.min(offset.value.y + e.translationY, maxY),
          -maxY
        );
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .onStart((e) => {
      const minScale = Math.min(
        containerWidth / (containerWidth * imageRatio),
        containerHeight / (containerHeight * imageRatio)
      );
      if (savedScale.value > minScale) {
        scale.value = withTiming(minScale);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedScale.value = minScale;
        offset.value = { x: 0, y: 0 };
      } else {
        scale.value = withTiming(2);
        savedScale.value = 2;
        const tapX = e.absoluteX - screenWidth / 2;
        const tapY = e.absoluteY - (screenHeight * 0.325);
        const maxX = (containerWidth * (2 - 1)) / 2;
        const maxY = (containerHeight * (2 - 1)) / 2;
        translateX.value = withTiming(Math.max(Math.min(-tapX, maxX), -maxX));
        translateY.value = withTiming(Math.max(Math.min(-tapY, maxY), -maxY));
        offset.value = {
          x: Math.max(Math.min(-tapX, maxX), -maxX),
          y: Math.max(Math.min(-tapY, maxY), -maxY),
        };
      }
    });

  const composedGestures = Gesture.Simultaneous(
    pinchGesture,
    Gesture.Race(doubleTapGesture, panGesture)
  );

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: containerWidth,
      height: containerHeight,
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

        <View style={[styles.mapContainer, { height: containerHeight }]}>
          <GestureDetector gesture={composedGestures}>
            <Animated.View style={styles.zoomContainer}>
              <Animated.Image
                source={require('@/assets/logos/CampusMap.png')}
                style={[styles.mapImage, imageAnimatedStyle]}
                resizeMode="contain"
                onLoad={(event) => {
                  const { width, height } = event.nativeEvent.source;
                  setImageRatio(width / height);
                }}
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
    padding: 20,
  },
  subtitle: {
    marginBottom: 16,
  },
  content: {
    lineHeight: 24,
    marginBottom: 16,
  },
  mapContainer: {
    width: '100%',
    overflow: 'hidden',
    marginBottom: 20,
  },
  zoomContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
});

import React, { useContext, useRef, useEffect } from 'react';
import { View, StyleSheet, Image, Animated, PanResponder } from 'react-native';
import { ThemeContext } from '@/contexts/ThemeContext';
import StyledText from '@/components/StyledText';

//link to cms so admin can update the map
export default function MapScreen() {
  const { theme } = useContext(ThemeContext);
  const scale = useRef(new Animated.Value(1)).current;
  const baseScale = useRef(1);
  const lastDistance = useRef<number | null>(null);
  const currentScale = useRef(1);

  useEffect(() => {
    const id = scale.addListener(({ value }) => {
      currentScale.current = value;
    });
    return () => {
      scale.removeListener(id);
    };
  }, [scale]);

  const getDistance = (touches: any[]) => {
    const [a, b] = touches;
    return Math.sqrt(
      Math.pow(a.pageX - b.pageX, 2) + 
      Math.pow(a.pageY - b.pageY, 2)
    );
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    
    onPanResponderGrant: () => {
      lastDistance.current = null;
    },
    
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.numberActiveTouches === 2) {
        const touches = evt.nativeEvent.touches;
        const distance = getDistance(touches);
        
        if (lastDistance.current !== null) {
          const newScale = (distance / lastDistance.current) * baseScale.current;
          scale.setValue(Math.min(Math.max(newScale, 0.5), 3));
        }
        lastDistance.current = distance;
      }
    },
    
    onPanResponderRelease: () => {
      Animated.timing(scale, {
        toValue: currentScale.current,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        baseScale.current = currentScale.current;
      });
    }
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StyledText type="subtitle" style={[styles.subtitle, { color: theme.text }]}>
        Explore the Campus
      </StyledText>
      <StyledText type="default" style={[styles.content, { color: theme.text }]}>
        Get to know the vibrant heart of our city campus and uncover key locations and landmarks.
      </StyledText>

      <Animated.View
        style={[styles.zoomContainer, { 
          transform: [{ scale }] 
        }]}
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

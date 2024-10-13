import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface ProgressBarProps {
  progress: number; // progress percentage, between 0 and 100
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 300, // sliding animation 300 ms
      useNativeDriver: false,
    }).start();
  }, [progress]); // runs when the progress changes

  return (
    <View className="w-full bg-white rounded-lg overflow-hidden">
      <Animated.View
        className="h-1 bg-gray-600"
        style={{
          width: animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
        }}
      />
    </View>
  );
};

export default ProgressBar;

import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import usePulsingAnimation from '../../../../../utils/skeleton';

const BadgeSkeleton = () => {
    const opacity = usePulsingAnimation();

  return (
    <View className="flex flex-row w-full justify-between p-5 bg-gray-200 rounded-xl">
      {Array.from({ length: 3 }).map((_, index) => (
        <Animated.View
          key={index}
          className="flex flex-col items-center justify-center"
          style={{ flex: 1, opacity }} // Apply animated opacity
        >
          <Animated.View className="bg-gray-300 rounded-full w-16 h-16 mb-2" />
          <Animated.View className="bg-gray-300 h-4 w-24 rounded" />
        </Animated.View>
      ))}
    </View>
  );
};

export default BadgeSkeleton;

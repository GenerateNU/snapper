import React from 'react';
import { Animated } from 'react-native';
import usePulsingAnimation from '../utils/skeleton';

const FollowSkeleton = () => {
  const opacity = usePulsingAnimation();

  return (
    <Animated.View
      style={{ opacity }}
      className="flex justify-between w-full flex-row items-center h-[8vh] bg-white shadow-sm rounded-lg px-2"
    >
      <Animated.View className="flex flex-row items-center">
        <Animated.View
          style={{ opacity }}
          className="w-12 h-12 bg-gray-300 rounded-full"
        />
        <Animated.View className="flex flex-col pl-2">
          <Animated.View
            style={{ opacity }}
            className="w-24 h-4 bg-gray-300 rounded"
          />
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={{ opacity }}
        className="w-24 h-8 bg-gray-300 rounded-lg"
      />
    </Animated.View>
  );
};

export default FollowSkeleton;

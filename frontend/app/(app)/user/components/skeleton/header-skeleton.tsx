import React from 'react';
import { View, Animated } from 'react-native';
import usePulsingAnimation from '../../../../../utils/skeleton';

const HeaderSkeleton = () => {
  const opacity = usePulsingAnimation();

  return (
    <View className="flex flex-col w-full">
      <View className="flex flex-row w-full">
        <Animated.View style={{ opacity }}>
          <View className="w-16 h-16 bg-slate-300 rounded-full" />
        </Animated.View>
        <View className="flex flex-row ml-[5%] justify-around w-3/4">
          <Animated.View
            style={{ opacity }}
            className="flex-col justify-center items-center flex-1"
          >
            <View className="w-16 h-6 bg-slate-300 rounded" />
            <View className="w-20 h-4 bg-slate-300 rounded mt-1" />
          </Animated.View>
          <Animated.View
            style={{ opacity }}
            className="flex-col justify-center items-center flex-1"
          >
            <View className="w-16 h-6 bg-slate-300 rounded" />
            <View className="w-20 h-4 bg-slate-300 rounded mt-1" />
          </Animated.View>
        </View>
      </View>
      <View className="flex flex-row justify-between py-[5%]">
        <View>
          <Animated.View style={{ opacity }}>
            <View className="w-32 h-6 bg-slate-300 rounded" />
            <View className="w-24 h-4 bg-slate-300 rounded mt-1" />
          </Animated.View>
        </View>
        <Animated.View
          style={{ opacity }}
          className="flex-1 justify-center items-center"
        >
          <View className="bg-slate-300 rounded px-4 py-2 w-24" />
        </Animated.View>
      </View>
    </View>
  );
};

export default HeaderSkeleton;

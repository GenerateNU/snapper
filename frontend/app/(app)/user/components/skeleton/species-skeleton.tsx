import React from 'react';
import { View, Animated } from 'react-native';
import usePulsingAnimation from '../../../../../utils/skeleton';

const SpeciesSkeleton = () => {
    const opacity = usePulsingAnimation();

  return (
    <Animated.View
      style={{ opacity }}
      className="bg-slate-100 rounded-md mb-3 flex flex-col w-[32%] justify-center items-center pt-[5%] pb-[5%]"
    >
      <View className="w-24 h-24 bg-slate-200 rounded-full mb-2" />
      <View className="h-4 w-3/4 bg-slate-200 rounded" />
    </Animated.View>
  );
};

export default SpeciesSkeleton;

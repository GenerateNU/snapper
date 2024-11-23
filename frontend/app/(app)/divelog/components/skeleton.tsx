import { Animated, View } from 'react-native';
import usePulsingAnimation from '../../../../utils/skeleton';

const DiveLogSkeleton = () => {
  const opacity = usePulsingAnimation();

  return (
    <Animated.View style={[{ opacity }]} className="w-full flex-col px-[8%]">
      <View className="flex-row items-center gap-2">
        <Animated.View className="bg-gray-300 rounded-full w-12 h-12" />
        <View className="flex-col gap-2">
          <Animated.View className="bg-gray-300 rounded-lg w-20 h-5" />
          <Animated.View className="bg-gray-300 rounded-lg w-20 h-3" />
        </View>
      </View>

      <Animated.View
        style={{ aspectRatio: 1 }}
        className="bg-gray-300 rounded-lg mt-4 w-full"
      />

      <View className="flex-row flex-wrap gap-4 mt-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Animated.View
            key={index}
            className="bg-gray-300 rounded-md w-16 h-5"
          />
        ))}
      </View>

      <View className="mt-4">
        <Animated.View className="bg-gray-300 rounded-md h-5 w-full" />
        <Animated.View className="bg-gray-300 rounded-md h-5 w-full mt-2" />
      </View>

      <View className="mt-4">
        <Animated.View className="bg-gray-300 rounded-lg w-20 h-8" />
      </View>
    </Animated.View>
  );
};

export default DiveLogSkeleton;

import { Animated, View } from 'react-native';
import usePulsingAnimation from '../../../../../utils/skeleton';

const DiveLogSkeleton = () => {
  const opacity = usePulsingAnimation();

  return (
    <Animated.View
      style={{ opacity }}
      className="w-full p-4 bg-white rounded-lg mb-2 shadow-md"
    >
      <View className="flex flex-row items-center mb-2">
        <View className="w-10 h-10 rounded-full bg-gray-300 mr-2" />
        <View className="w-1/2 h-4 bg-gray-300 rounded" />
      </View>
      <View className="h-24 bg-gray-300 rounded-lg mb-2" />
      <View className="h-4 w-3/4 bg-gray-300 rounded mb-1" />
      <View className="h-4 w-1/3 bg-gray-300 rounded" />
    </Animated.View>
  );
};

export default DiveLogSkeleton;

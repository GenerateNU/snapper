import { Animated, View, Text } from 'react-native';
import usePulsingAnimation from '../../utils/skeleton';

const NotificationSkeleton = () => {
  const opacity = usePulsingAnimation();

  return (
    <View
      style={{ gap: 12 }}
      className="flex flex-row w-full justify-between items-center p-4 bg-slate-100 rounded-xl mb-4"
    >
      <Animated.View className="bg-slate-200 rounded-full w-16 h-16" />

      <View className="flex flex-col flex-1">
        <Animated.View
          style={{ opacity }}
          className="bg-slate-200 h-4 w-24 mb-2 rounded"
        />
        <Animated.View
          style={{ opacity }}
          className="bg-slate-200 h-4 w-32 mb-2 rounded"
        />
        <Animated.View
          style={{ opacity }}
          className="bg-slate-200 h-4 w-28 rounded"
        />
      </View>

      <Animated.View
        style={{ opacity }}
        className="bg-slate-200 w-16 h-16 rounded-xl"
      />
    </View>
  );
};

export default NotificationSkeleton;

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const MenuTab = <T extends string>({
  isSelected,
  label,
  onPress,
}: {
  isSelected: boolean;
  label: T;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 justify-center items-center py-2"
    >
      <Text className={isSelected ? 'text-white' : 'text-gray-500'}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const HomeMenu = <T extends string>({
  categories,
  selected,
  setSelected,
}: {
  categories: T[];
  selected: T;
  setSelected: (category: T) => void;
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const translateX = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(
            categories.indexOf(selected) === 0 ? 0 : containerWidth / 2,
            {
              duration: 300,
              easing: Easing.inOut(Easing.ease),
            },
          ),
        },
      ],
    };
  }, [selected, categories]);

  return (
    <View
      onLayout={handleLayout}
      className="flex-row w-full overflow-hidden flex-row items-center border-[1px] py-1 border-gray-400 rounded-full"
    >
      <Animated.View
        className="bg-deep absolute top-0 bottom-0 rounded-full w-1/2"
        style={[translateX]}
      />

      {categories.map((category) => (
        <MenuTab
          key={category}
          isSelected={selected === category}
          label={category}
          onPress={() => setSelected(category)}
        />
      ))}
    </View>
  );
};

export default HomeMenu;

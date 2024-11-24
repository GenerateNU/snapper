import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Category } from '../../consts/home-menu';

const MenuTab = React.memo(
  ({
    isSelected,
    label,
    onPress,
  }: {
    isSelected: boolean;
    label: Category;
    onPress: () => void;
  }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: isSelected ? 'white' : 'gray' }}>{label}</Text>
      </TouchableOpacity>
    );
  },
);

interface HomeMenuProps {
  selected: Category;
  setSelected: (category: Category) => void;
}

const HomeMenu: React.FC<HomeMenuProps> = ({ selected, setSelected }) => {
  const translateX = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(selected === Category.FOLLOWING ? 0 : 200, {
            duration: 300,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    };
  }, [selected]);

  return (
    <View className="w-full overflow-hidden flex-row items-center border-[1px] py-1 border-gray-400 rounded-full">
      <Animated.View
        className="bg-deep"
        style={[
          {
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '50%',
            borderRadius: 50,
          },
          translateX,
        ]}
      />

      <MenuTab
        isSelected={selected === Category.FOLLOWING}
        label={Category.FOLLOWING}
        onPress={() => setSelected(Category.FOLLOWING)}
      />
      <MenuTab
        isSelected={selected === Category.NEARBY}
        label={Category.NEARBY}
        onPress={() => setSelected(Category.NEARBY)}
      />
    </View>
  );
};

export default HomeMenu;

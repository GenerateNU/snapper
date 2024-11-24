import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Category } from '../../consts/home-menu';

interface HomeMenuProps {
  selected: Category;
  setSelected: (category: Category) => void;
}

const HomeMenu: React.FC<HomeMenuProps> = ({ selected, setSelected }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: selected === Category.FOLLOWING ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selected]);

  const MenuTab = ({
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
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View className="w-full overflow-hidden flex-row items-center border-[1px] py-1 border-gray-400 rounded-full">
      <Animated.View
        className="bg-deep"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '50%',
          transform: [{ translateX }],
          borderRadius: 50,
        }}
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

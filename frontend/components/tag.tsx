import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

interface TagProps {
  fish?: string;
  onPress?: () => void;
}
const Tag: React.FC<TagProps> = ({ fish, onPress }) => {
  return (
    <View className="flex h-[3vh] flex-row border rounded-[5px] border-[#7c8a9e] items-center justify-ceter py-1 px-2">
      <Text className="font-medium text-[#7c8a9e]"> {fish} </Text>
      <TouchableOpacity onPress={onPress}>
        <Image className="h-2.5 w-2.5" source={require('../assets/x.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default Tag;

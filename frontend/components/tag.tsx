import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface TagProps {
  fish?: String;
  onPress?: () => void;
}
const Tag: React.FC<TagProps> = ({ fish, onPress }) => {
  return (
    <View className="flex h-[4vh] bg-gray-200 flex-row rounded-[5px] items-center justify-ceter py-1 px-2">
      <Text className="text-[14px] text-black"> {fish} </Text>
      <TouchableOpacity onPress={onPress}>
        <Image className="h-2.5 w-2.5" source={require('../assets/x.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default Tag;

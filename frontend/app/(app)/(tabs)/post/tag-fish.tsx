import React from 'react';
import { View, Text, Pressable, Keyboard } from 'react-native';
import FishSearch from './components/fish-search';

export default function TagFish() {
  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <View className="w-full px-10 bg-white h-full pt-[5vh]">
        <View className="flex flex-col justify-items items-center pt-[5vh] mb-[3vh]">
          <Text className="font-bold text-[24px] leading-[29.05px] pb-[1vh]">
            {' '}
            Tag Fish{' '}
          </Text>
          <Text className="font-normal text-center text-[14px] leading-[18px]">
            {' '}
            Select the fish you saw on your dive
          </Text>
        </View>

        <FishSearch />
      </View>
    </Pressable>
  );
}

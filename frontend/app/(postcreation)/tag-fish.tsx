import React from 'react';
import { View, Text, Image, TextInput } from 'react-native';
import { useFormContext } from 'react-hook-form';
import Tag from '../../components/tag';
import FishSearch from './components/fish-search';

type Location = {
  type: string;
  location: number[];
};

type FormFields = {
  tags: string[];
  image: string;
  date: Date;
  location: Location;
  description: string;
  user: string;
};

export default function TagFish() {
  const { setValue, watch } = useFormContext<FormFields>();
  const tags: string[] = watch('tags') || [];

  const removeFish = (index: number) => {
    const newFish = [...tags];

    newFish.splice(index, 1);

    setValue('tags', newFish);
  };
  return (
    <View className="w-full px-10 bg-white h-full">
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

      <View className="flex flex-row border border-[#d2d9e2] rounded-md items-center pl-2 w-full min-h-[5vh] mb-5">
        <Image
          className="h-[2.5vh] w-[2.5vh]"
          source={require('../../assets/search.png')}
        />
        <View className="flex h-full w-full flex-row items-center flex-wrap items-center gap-2 p-2">
          {tags.map((item, index) => {
            return (
              <View key={index}>
                <Tag fish={item} onPress={() => removeFish(index)} />
              </View>
            );
          })}
          <TextInput
            placeholder="Default "
            className="pl-3 font-medium text-[14px] h-[4vh]"
          />
        </View>
      </View>
      <FishSearch />
    </View>
  );
}

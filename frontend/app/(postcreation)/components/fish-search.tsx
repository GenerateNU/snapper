import React from 'react';
import { TextInput, View, Image, Text, TouchableOpacity } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';

type TagOption = {
  name: string;
  isEnabled: boolean;
};

export default function FishSearch() {
  const initialFish: TagOption[] = [
    { name: 'Anemone', isEnabled: true },
    { name: 'Angelfish', isEnabled: false },
    { name: 'Barnacle', isEnabled: false },
    { name: 'Clown Fish', isEnabled: false },
  ];

  const [possibleFish, setPossibleFish] = useState<TagOption[]>(initialFish);
  const { setValue, watch } = useFormContext();
  const tags = watch('tags', []);

  useEffect(() => {
    // Create a new array with updated isEnabled values
    const updatedFish = possibleFish.map((fish) => ({
      ...fish, // Create a new object to avoid mutation
      isEnabled: tags.includes(fish.name),
    }));

    //-------------------------------------------
    //REMOVE THE COMMENT ON THE LINE BELOW FOR IT TO WORK ONCE THE APP HAS LOADED
    //-------------------------------------------
    // setPossibleFish(updatedFish);
  }, [tags]);

  const addRemoveTags = (index: number, shouldAdd: boolean) => {
    if (shouldAdd) {
      if (tags.includes(possibleFish[index].name)) {
        // Return early if tag already exists
        return;
      }
      console.log('Adding...');
      setValue('tags', [possibleFish[index].name, ...tags]);
    } else {
      setValue(
        'tags',
        tags.filter((tag: string) => tag !== possibleFish[index].name)
      );
    }
  };

  return (
    <View className="h-[22vh] w-full">
      <View className="flex flex-row border border-[#d2d9e2] rounded-t-[12px] basis-1/5 items-center pl-2">
        <Image
          className="h-[2.5vh] w-[2.5vh]"
          source={require('../../../assets/search.png')}
        />
        <TextInput
          placeholder="Search"
          className="pl-3 font-medium text-[14px]"
        />
      </View>
      {possibleFish.map((item, index) => {
        return (
          <View
            key={index}
            className="flex flex-row border border-[#d2d9e2] basis-1/5 items-center pl-4"
          >
            <Text className="text-[#7C8B9D] font-medium"> {item.name} </Text>
            <TouchableOpacity
              className={
                item.isEnabled
                  ? 'justify-self-end w-[2vh] h-[2vh] rounded-[3px] bg-[#d2d9e2] absolute right-5'
                  : 'justify-self-end w-[2vh] h-[2vh] rounded-[3px] border border-[3px] border-[#d2d9e2] absolute right-5'
              }
              onPress={() => addRemoveTags(index, !item.isEnabled)}
            />
          </View>
        );
      })}
    </View>
  );
}

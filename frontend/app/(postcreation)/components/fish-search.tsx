import React from 'react';
import { TextInput, View, Image, Text, TouchableOpacity } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';


export default function FishSearch() {
  let data: string[] = ['Anemone', 'Angelfish', 'Barnacle', 'Clown Fish'];
  const [visibility, setVisibility] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  const { setValue, watch} = useFormContext();
  const tags = watch('tags') || [];

  
  const updateBoolAtIndex = (index: number, value: boolean) => {
    const newVisibility = [...visibility];
    newVisibility[index] = value;
    if(value){
        setValue('tags', [data[index], ...tags]);
    } else {
        setValue('tags', tags.filter((tag: string) => tag !== data[index]))
    }
    setVisibility(newVisibility);
  };

  useEffect(()=> {
    const checkTags = () => {
      let hasChanged = false;
      const newVisibility = [...visibility];
      for (let i: number = 0; i < 4; i++) {
        if(!tags.includes(data[i]) && visibility[i]){
          newVisibility[i] = false;
          hasChanged = true
        } else if(tags.includes(data[i]) && !visibility[i]){
          newVisibility[i] = true;
          hasChanged = true
        }
      }
      if(hasChanged){
        setVisibility(newVisibility);
      }
    }
    checkTags()
},[tags])

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
      {data.map((item, index) => {
        return (
          <View
            key={index}
            className="flex flex-row border border-[#d2d9e2] basis-1/5 items-center pl-4"
          >
            <Text className="text-[#7C8B9D] font-medium"> {item} </Text>
            {visibility[index] ? (
              <TouchableOpacity
                className="justify-self-end w-[2vh] h-[2vh] rounded-[3px] bg-[#d2d9e2] absolute right-5"
                onPress={() => updateBoolAtIndex(index, false)}
              />
            ) : (
              <TouchableOpacity
                className="justify-self-end w-[2vh] h-[2vh] rounded-[3px] border border-[3px] border-[#d2d9e2] absolute right-5"
                onPress={() => updateBoolAtIndex(index, true)}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

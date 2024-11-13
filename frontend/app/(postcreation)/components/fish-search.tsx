import React from 'react';
import { TextInput, View, Image, Text, TouchableOpacity } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';

type FishData = {
  name: string;
  visibility: Boolean;
};
export default function FishSearch() {
  const [data, setData] = useState<FishData[]>([
    { name: 'Anemone', visibility: false },
    { name: 'Angelfish', visibility: false },
    { name: 'Barnacle', visibility: false },
    { name: 'Betta', visibility: false },
    { name: 'Bitterling', visibility: false },
    { name: 'Carp', visibility: false },
    { name: 'Catfish', visibility: false },
    { name: 'Clownfish', visibility: false },
    { name: 'Crawfish', visibility: false },
    { name: 'Dab', visibility: false },
    { name: 'Dace', visibility: false },
  ]);

  const { setValue, watch } = useFormContext();
  const tags = watch('tags') || [];

  const updateBoolAtIndex = (index: number, value: boolean) => {
    const newData = [...data];
    if (value && !tags.includes(data[index].name)) {
      setValue('tags', [data[index].name, ...tags]);
    } else {
      setValue(
        'tags',
        tags.filter((tag: string) => tag !== data[index].name),
      );
    }
    newData[index].visibility = !newData[index].visibility;
    setData(newData);
  };

  useEffect(() => {
    const checkTags = () => {
      let hasChanged = false;
      const newData = [...data];
      for (let i: number = 0; i < data.length; i++) {
        if (!tags.includes(newData[i].name) && newData[i].visibility) {
          newData[i].visibility = false;
          hasChanged = true;
        } 
        if (tags.includes(newData[i].name) && !newData[i].visibility) {
          newData[i].visibility = true;
          hasChanged = true;
        }
      }
      if (hasChanged) {
        setData(newData);
      }
    };
    checkTags();
  }, [tags]);

  return (
    <View className="h-[22vh] w-full flex flex-row flex-wrap">
      {data.map((item, index) => {
        return (
          <View
            key={index}
            className="flex flex-col basis-1/4 items-center space-y-2"
          >
            <TouchableOpacity
              className={`border h-[7.5vh] w-[7.5vh] rounded-lg ${
                item.visibility
                  ? 'border-blue-400 bg-blue-300'
                  : 'border-gray-400'
              }`}
              onPress={() => updateBoolAtIndex(index, !item.visibility)}
            />

            <Text className="text-[14px] mb-[2vh]"> {item.name} </Text>
          </View>
        );
      })}
    </View>
  );
}

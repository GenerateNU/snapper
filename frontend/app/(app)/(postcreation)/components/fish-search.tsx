import React from 'react';
import { TextInput, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Tag from '../../../../components/tag';
import { apiConfig } from '../../../../api/apiContext';
import { SpeciesContent } from '../../../../types/species';


export default function FishSearch() {
  const API_BASE_URL = apiConfig;
  const { setValue, watch } = useFormContext();
  const [data, setData] = useState<SpeciesContent[]>([]);
  const tags: string[] = watch('tags') || [];
  const [search, setSearch] = useState("");

  const removeFish = (index: number) => {
    const newFish = [...tags];
    newFish.splice(index, 1);
    setValue('tags', newFish);
  };

  const updateBoolAtIndex = (index: number, value: boolean) => {
    const newData = [...data];
    if (value && !tags.includes(data[index].commonNames[0])) {
      setValue('tags', [data[index].commonNames[0], ...tags]);
    } else {
      setValue(
        'tags',
        tags.filter((tag: string) => tag !== data[index].commonNames[0]),
      );
    }
    newData[index].visibility = !newData[index].visibility;
    setData(newData);
  };

  useEffect(() => {
    const checkTags = () => {
      let hasChanged: boolean = false;
      const newData: SpeciesContent[] = [...data];
      for (let i: number = 0; i < data.length; i++) {
        if (!tags.includes(newData[i].commonNames[0]) && newData[i].visibility) {
          newData[i].visibility = false;
          hasChanged = true;
        }
        if (tags.includes(newData[i].commonNames[0]) && !newData[i].visibility) {
          newData[i].visibility = true;
          hasChanged = true;
        }
      }
      if (hasChanged) {
        setData(newData);
      }
    };
    checkTags();
  }, [tags, data]);

  useEffect(()=> {
    const searchForFish = async (searchQuery:string) => {
      if(searchQuery == ""){
        searchQuery = "*";
      }
      try{
        console.log(searchQuery)
        const response = await fetch(`${API_BASE_URL}/species/search/${searchQuery}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const responseBody = await response.json()
        setData(responseBody);
      } catch(error:any) {
      }
    }
    searchForFish(search);
  }, [search])

  return (
    <View className = "flex-1"> 
      <View className="flex flex-row border border-[#d2d9e2] rounded-md items-center px-2 w-full min-h-[5vh] mb-5">
          <Image
            className="h-[2.5vh] w-[2.5vh]"
            source={require('../../../../assets/search.png')}
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
              placeholder="Default"
              className="pl-3 font-medium text-[14px] h-[4vh]"
              value = {search}
              onChangeText={(newText:string) => setSearch(newText)}
            />
          </View>
      </View>
      <ScrollView>
      <View className="w-full flex flex-row flex-wrap flex-1">
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

              <Text className="text-[10px] text-center mb-[2vh]"> {item.commonNames[0]} </Text>
            </View>
          );
        })}
      </View>
      </ScrollView>
    </View>
  );
}

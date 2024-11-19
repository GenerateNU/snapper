import React from 'react';
import { TextInput, View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Tag from '../../../../components/tag';
import { apiConfig } from '../../../../api/apiContext';
import { SpeciesContent } from '../../../../types/species';
import { TagData } from '../../../../types/divelog';
import { searchSpecies } from '../../../../api/species';

export default function FishSearch() {
  const { setValue, watch } = useFormContext();
  const [data, setData] = useState<SpeciesContent[]>([]);
  const tagData: TagData[] = watch('tagData') || [];
  const [search, setSearch] = useState("");

  const removeFish = (index: number) => {
    const newFish = [...tagData];
    newFish.splice(index, 1);
    setValue('tagData', newFish);
  };

  const tagIncludes = (name: string, id: string):boolean => {
    for(let i: number = 0; i < tagData.length; i ++){
      if(tagData[i].name == name && tagData[i].id == id){
        return true;
      }
    }
    return false;
  }

  const updateBoolAtIndex = (index: number, value: boolean) => {
    const newData = [...data];
    if (value && !tagIncludes(data[index].commonNames[0], data[index]._id)) {
      setValue('tagData', [{name: data[index].commonNames[0], id: data[index]._id}, ...tagData]);
    } else {
      setValue(
        'tagData',
        tagData.filter((tag: TagData) => tag.name !== data[index].commonNames[0]),
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
        if (!tagIncludes(data[i].commonNames[0], data[i]._id) && newData[i].visibility) {
          newData[i].visibility = false;
          hasChanged = true;
        }
        if (tagIncludes(data[i].commonNames[0], data[i]._id) && !newData[i].visibility) {
          newData[i].visibility = true;
          hasChanged = true;
        }
      }
      if (hasChanged) {
        setData(newData);
      }
    };
    checkTags();
  }, [tagData, data]);

  useEffect(()=> {
    const searchForFish = async (searchQuery:string) => {
      try{
        const response = await searchSpecies(searchQuery);
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
            {tagData.map((item, index) => {
              return (
                <View key={index}>
                  <Tag fish={item.name} onPress={() => removeFish(index)} />
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
      <ScrollView showsVerticalScrollIndicator = {false}>
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

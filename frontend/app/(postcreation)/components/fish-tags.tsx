import React from "react";
import { ScrollView,View, Text} from "react-native";
import Tag from "../../../components/tag";
import { useFormContext } from 'react-hook-form';


export default function FishTags() {
    const {setValue, watch} = useFormContext();
    const tags: string[] = watch('tags') || [];

    const removeFish = (index: number) => {
        const newFish = [...tags];

        newFish.splice(index, 1);

        setValue('tags', newFish)
      };

    
    return (
        <View className = "h-[5vh] max-w-full">
            <ScrollView className = "h-full max-w-full border border-[#d2d9e2] rounded-[12px]" horizontal>
                <View className = "flex flex-row items-center space-x-2 mx-2">
                {tags.map((item, index) => {
                    return (
                        <View key = {index}> 
                            <Tag fish={item} onPress = {() => removeFish(index)}/>
                        </View>
                    )
                })}
                </View>
            </ScrollView>
        </View>
    )
}
import React from "react";
import { View, Text } from "react-native";
import { useFormContext, Controller } from "react-hook-form"
import ImagePicker from "../../../components/image-picker";
import BigText from "../../../components/bigtext"
import Input from '../../../components/input';
import Button from "../../../components/button";
import PageButton from "./page-button";
import { router } from 'expo-router';
import Tag from "../../../components/tag";
import { apiConfig } from "../../../api/apiContext";
import { useAuthStore } from '../../../auth/authStore';
import Map from "../../../components/map";
type FormFields = {
    tags: string[],
    image: string,
    date: Date,
    location: string,
    description: string,
    user: string,
}


export default function PostCreationForm() {

    const { setValue, watch, reset } = useFormContext<FormFields>();
    const tags: string[] = watch('tags') || [];

    const removeFish = (index: number) => {
        const newFish = [...tags];

        newFish.splice(index, 1);

        setValue('tags', newFish)
    };

    const { control, trigger, register, handleSubmit } = useFormContext<FormFields>();

    const submitPost = async (postData: FormFields) => {
        const mongoDBId = useAuthStore.getState().mongoDBId
        //console.log(mongoDBId);
        if(mongoDBId){
           postData.user = mongoDBId;
       }
        try {
             const response = await fetch(
             'http://localhost:3000/divelog', {
                 method: 'POST', 
                 headers: {
                 'Content-Type': 'application/json'}, 
                 body: JSON.stringify(postData)})
         } catch (error) {
             console.error(error);
         }
         //console.log(postData);
         reset();
     };


    return (
        <View className="space-y-2">
            <ImagePicker />
            <Text className="text-[16px] pt-[2vh]">Caption</Text>
            <View className="mb-4">
                <Controller
                    control={control}
                    name="description"
                    render={({ field: {
                        onChange, value } }) => (
                        <BigText
                            placeholder="Your description..."
                            onChangeText={(text: string) => {
                                onChange(text);
                                trigger('description');
                            }}
                            value={value}
                        />
                    )}
                />
            </View>
            <Text className="text-[16px]"> Location </Text>
            <View>
                <Controller
                    control={control}
                    name="location"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            placeholder="Enter Location"
                            onChangeText={(text: string) => {
                                onChange(text);
                                trigger('location');
                            }}
                            border = "gray-400"
                            value={value}
                        />
                    )}
                />
            </View>
            <Text className="text-[16px] ">Tag Fish</Text>
            <View className="w-full mb-[4vh]">
                {tags.length == 0 ?
                    <PageButton outline='gray-400' text="Choose Fish" backgroundColor="white" onPress={() => router.push('/tag-fish')} /> :
                    <View className="flex flex-row border border-[#d2d9e2] rounded-md items-center pl-2 w-full min-h-[5vh] mb-5">
                        <View className="flex h-full w-full flex-row items-center flex-wrap items-center gap-2 p-2">
                            {tags.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <Tag fish={item} onPress={() => removeFish(index)} />
                                    </View>
                                )
                            })}
                            <View>
                                <Button backgroundColor="white" color="ocean" text="+ Add More Fish" onPress={() => router.push('/tag-fish')}></Button>
                            </View>
                        </View>
                    </View>
                }
            </View>
            <View className = "h-[50vh] w-[50vh]"> 
                <Map/>
            </View>
            <View className="pb-10">
                <Button text="Post" onPress={handleSubmit(submitPost)} />
            </View>
        </View>
    )
}

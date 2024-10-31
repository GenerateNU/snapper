import React from "react";
import {View, Text} from "react-native";
import {useFormContext, Controller} from "react-hook-form"
import ImagePicker from "../../../components/image-picker";
import BigText from "../../../components/bigtext"
import Input from '../../../components/input';
import Button from "../../../components/button";
import PageButton from "./page-button";
import { router } from 'expo-router';
import Tag from "../../../components/tag";


type FormFields = {
    tags: string[],
    image: string,
    date: Date,
    location: string,
    description: string,
}

export default function PostCreationForm() {

    const {setValue, watch} = useFormContext<FormFields>();
    const tags: string[] = watch('tags') || [];

    const removeFish = (index: number) => {
        const newFish = [...tags];

        newFish.splice(index, 1);

        setValue('tags', newFish)
    };

    const {control, register, handleSubmit, } = useFormContext<FormFields>();

    const submitPost = async (postData: FormFields) => {
        console.log(postData)
    }

    return (
        <View className = "space-y-1">
            <View className = "h-[10vh] bg-gray-200 w-full">
                <Text> Insert image picker here</Text>
            </View>
            <Text className="text-[16px] pt-[2vh]">Caption</Text>
            <View className = "mb-4">
                <Controller
                    control = {control}
                    name = "description"
                    render = {({field: {onChange, value}}) => (
                    <BigText 
                        placeholder="Your description..." 
                        onChangeText={onChange}
                        value = {value}
                    />
                    )}
                /> 
            </View>
            <Text className="text-[16px]"> Location </Text>
            <Input placeholder="Enter Location" />

            <Text className = "text-[16px] ">Tag Fish</Text>
            <View className="w-full mb-[4vh]">
                {tags.length == 0 ?
                <PageButton outline = 'gray-300' text = "Choose Fish" backgroundColor= "white" onPress = {() => router.push('/tag-fish')} /> :
                <View className="flex flex-row border border-[#d2d9e2] rounded-md items-center pl-2 w-full min-h-[5vh] mb-5">
                    <View className = "flex h-full w-full flex-row items-center flex-wrap items-center gap-2 p-2"> 
                        {tags.map((item, index) => {
                        return (
                            <View key = {index}> 
                                <Tag fish={item} onPress = {() => removeFish(index)}/>
                            </View>
                        )
                        })}
                        <View>
                            <Button backgroundColor = "white" color = "ocean" text= "+ Add More Fish" onPress = {() => router.push('/tag-fish')}></Button>     
                        </View>
                    </View>
                 </View>
                }
            </View>
            <Button text = "Post" onPress = {handleSubmit(submitPost)} />
            
        </View>
    )
}

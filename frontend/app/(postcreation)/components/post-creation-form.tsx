import React from "react";
import { View, Text, ScrollView } from "react-native";
import FishTags from "./fish-tags";
import FishSearch from "./fish-search";
import { useForm, FormProvider, useFormContext, Form, Controller } from "react-hook-form"
import ImagePicker from "../../../components/image-picker";
import BigText from "../../../components/bigtext"
import Input from '../../../components/input';
import Button from "../../../components/button";
import PageButton from "./page-button";
import { router } from 'expo-router';


type FormFields = {
    tags: string[],
    image: string,
    date: Date,
    location: string,
    description: string,
}

export default function PostCreationForm() {

    //const methods = useForm<FormFields>();
    //const {control, register, handleSubmit} = methods;
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
                <PageButton outline = 'gray-300' text = "Choose Fish" backgroundColor="white" onPress = {() => router.push('/tag-fish')} />
            </View>
            <Button text = "Post" onPress = {handleSubmit(submitPost)} />
            
        </View>
    )
}

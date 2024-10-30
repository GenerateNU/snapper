import React from "react";
import { View, Text, ScrollView } from "react-native";
import FishTags from "./fish-tags";
import FishSearch from "./fish-search";
import { useForm, FormProvider, useFormContext, Form, Controller } from "react-hook-form"
import ImagePicker from "../../../components/image-picker";
import BigText from "../../../components/bigtext"
import Input from '../../../components/input';
import Button from "../../../components/button";
import PageButton from "../../../components/page-button";


type FormFields = {
    tags: string[],
    image: string,
    date: Date,
    location: string,
    description: string,
}

export default function PostCreation() {

    const methods = useForm<FormFields>();
    const {control, register, handleSubmit} = methods;


    const submitPost = async (postData: FormFields) => {
        console.log(postData)
    }

    return (
        <FormProvider {...methods}>
            <ScrollView className="flex flex-col space-y-2 w-[90vw] bg-white">
                <View className="flex flex-col justify-items items-center pt-[10vh] mb-[3vh]">
                    <Text className="font-bold text-[24px] leading-[29.05px] pb-[1vh]"> Log A Dive </Text>
                    <Text className="font-normal text-center text-[14px] leading-[18px]"> Ready to capture your underwater adventure?</Text>
                    <Text className="font-normal text-center w-[70vw] text-[14px] leading-[18px]"> Fill out the details below to log your dive experience!</Text>
                </View>
                <View className="w-full mb-[2vh]">
                    <PageButton outline = 'gray-300' text = "Enter Location" backgroundColor="white" />
                </View>

                <ImagePicker />
                <Text className="font-semibold text-[14px]">Tag Fishes</Text>
                <View className="w-full">
                    <FishTags />
                </View>
                <View>
                    <FishSearch />
                </View>
                <Text className="font-semibold text-[14px] pt-[2vh]">Dive Description</Text>
                <Text className="font-normal text-[12px] leading-[18px]">Highlight memorable moments or explorations</Text>
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
                <Button text = "Post" onPress = {handleSubmit(submitPost)} />
            </ScrollView>
        </FormProvider>
    )
}

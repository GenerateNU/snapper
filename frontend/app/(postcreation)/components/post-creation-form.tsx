import React from "react";
import { View, Text, ScrollView } from "react-native";
import FishTags from "./fish-tags";
import FishSearch from "./fish-search";
import { useForm, FormProvider, useFormContext, Form } from "react-hook-form"
import ImagePicker from "../../../components/image-picker";
import BigText from "../../../components/bigtext";
import DatePicker from "./date-picker";
import Input from '../../../components/input';


type FormFields = {
    tags: string[],
    image: string,
}

export default function PostCreation() {
    const methods = useForm<FormFields>();
    return (
        <FormProvider {...methods}>
            <ScrollView className="flex flex-col space-y-2 w-[90vw]">
                <View className="flex flex-col justify-items items-center pt-[10vh]">
                    <Text className="font-bold text-[24px] leading-[29.05px] pb-[1vh]"> Log A Dive </Text>
                    <Text className="font-normal text-[12px] leading-[18px]"> Ready to capture your underwater adventure?</Text>
                    <Text className="font-normal text-[12px] leading-[18px]"> Fill out the details below to log your dive experience!</Text>
                </View>
                <View className="h-fit w-full flex flex-row justify-between items-center mb-4">
                    <DatePicker />
                    <View className="w-fit">
                        <Input
                            title={"Dive Location"}
                            placeholder={"42 Wallaby Way"}
                        />
                    </View>
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
                    <BigText placeholder="Your description..." />
                </View>
            </ScrollView>
        </FormProvider>
    )
}
import React from "react";
import { View } from "react-native";
import FishTags from "./fish-tags";
import FishSearch from "./fish-search";
import { useForm, FormProvider, useFormContext, Form } from "react-hook-form"


type FormFields = {
    tags: string[],
}

export default function PostCreation(){
    const methods = useForm<FormFields>();
    return (
        <FormProvider {...methods}>
            <View className = "w-[75vw] flex flex-col space-y-2">
                <View> 
                    <FishTags/>
                </View>

                <View> 
                    <FishSearch/>
                </View>
            </View>
        </FormProvider>
    )

}
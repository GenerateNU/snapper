import React, { useEffect, useState } from "react";
import { View, Text, Modal, TouchableOpacity} from "react-native";
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
import IconButton from '../../../components/icon-button';
import {
    faAngleLeft
} from '@fortawesome/free-solid-svg-icons';
import { number } from "zod";


type Location = {
    type: string,
    coordinates: number[]
}

type FormFields = {
    tags: string[],
    images: File[],
    date: Date,
    location: Location,
    description: string,
    user: string,
}


export default function PostCreationForm() {
    const [modalVisible, setModalVisible] = useState(false);
    const [coordinate, setCoordinate] = useState([37.33, -122]);
    const { setValue, watch, reset } = useFormContext<FormFields>();
    const tags: string[] = watch('tags') || [];
    const location: Location = watch('location') || {type: "Point", location: []};
    const removeFish = (index: number) => {
        const newFish = [...tags];

        newFish.splice(index, 1);

        setValue('tags', newFish)
    };

    const { control, trigger, handleSubmit } = useFormContext<FormFields>();

    const getLocation  = () => {
        setValue('location', {type:"Point", coordinates: coordinate.reverse()})
        setCoordinate([37.33, -122]);
        setModalVisible(false);
    }
    const submitPost = async (postData: FormFields) => {
        const mongoDBId = useAuthStore.getState().mongoDBId
        //console.log(mongoDBId);
        if(mongoDBId){
           postData.user = mongoDBId;
       }
       console.log(postData)
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
            <Text className="text-[16px]">Location</Text>
            <View className="mb-4">
                <PageButton outline='gray-400' text= "Choose Location" backgroundColor="white" onPress={() => setModalVisible(true)} />
            </View>
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                 <View className = "flex-1 justify-center items-center"> 
                    <View className = "h-full w-full items-center">
                        <View className = "absolute left-5 top-[7vh]"> 
                            <IconButton icon={faAngleLeft} onPress={() => setModalVisible(false)}/>
                        </View>
                        <Text className="font-bold text-black text-[24px] leading-[29.05px] pt-[10vh]"> Choose a Location </Text>
                        <View className ="h-[70vh] w-[90vw] pt-[2vh] rounded-md">
                            <Map coordinate={coordinate} setCoordinate={setCoordinate}/>
                        </View>
                        <View className = "w-[90vw] mt-[5vh]"> 
                            <Button text="Submit Location" onPress = {getLocation}/>
                        </View>
                    </View>
                </View>
            </Modal>
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
            <View className="pb-10">
                <Button text="Post" onPress={handleSubmit(submitPost)} />
            </View>
        </View>
    )
}

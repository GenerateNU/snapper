import { View, Text, Image, ScrollView, Button, LayoutAnimation, Animated, Easing, Dimensions, Pressable } from "react-native"
import { useInfoPopup } from "../contexts/info-popup-context";
import { useEffect, useRef } from "react";

const InfoPopup = () => {
    const { speciesContent, isOpen, setClose } = useInfoPopup();

    const screenHeight = Dimensions.get('window').height;
    const translateY = useRef(new Animated.Value(screenHeight)).current;

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: isOpen ? 0 : screenHeight,
            duration: 400, // Adjust the duration as needed
            easing: Easing.inOut(Easing.ease), // Ease-in-out effect
            useNativeDriver: true,
        }).start();
    }, [isOpen]);

    return <Animated.View
        className="absolute flex flex-col justify-end h-full"
        style={{
            transform: [{ translateY }],
        }}
    >
        <View className={" w-screen h-2/3"}>
            <View className=" h-7 rounded-t-2xl bg-white flex flex-row justify-end items-center">
                <Pressable onPress={setClose}>
                    <Text className=" px-4">X</Text>
                </Pressable>
            </View>
            <View className=" bg-primary-blue pt-12 pb-12 px-8 flex flex-row justify-between">
                <View className=" flex flex-col gap-1">
                    <Text className=" text-sm">
                        📍 Western Atlantic Ocean
                    </Text>
                    <Text className=" text-2xl font-semibold">
                        {speciesContent.commonName}
                    </Text>
                    <Text className=" text-sm italic">
                        {speciesContent.scientificName}
                    </Text>
                </View>
                <Image className=" h-16 w-32" source={{ uri: "https://www.fisheries.noaa.gov/s3/2022-09/640x427-Snapper-Red-NOAAFisheries.png" }} />
            </View>
            <ScrollView className=" bg-white px-8 py-8 gap-y-2">
                <View className="">
                    <View className=" flex flex-row justify-between pb-2">
                        <Text className=" text-xs font-bold">Photos:</Text>
                        <Text className=" text-xs">View all photos</Text>
                    </View>
                    {speciesContent.images.length > 0 ? <ScrollView horizontal className="flex flex-row gap-2">
                        {speciesContent.images.map((url, i) => (
                            <Image style={{ overlayColor: "white" }} key={i} className=" w-20 h-20 rounded-xl overlay" source={{ uri: url }}></Image>
                        ))}
                    </ScrollView> :
                        <View>
                            <Text>No Images Available</Text>
                        </View>}
                </View>
                <View
                    className=" border-background border-b-2"
                />
                <View className="flex flex-col gap-y-2 h-full">
                    <Text className=" text-xs font-bold">Description:</Text>
                    <Text className=" text-xs">
                        {speciesContent.introduction}
                    </Text>
                </View>
                <View className=" flex flex-col gap-y-2">
                    <Text className=" text-xs font-bold">More Facts:</Text>
                </View>
                <View className="py-8"></View>
            </ScrollView>
        </View >
    </Animated.View >
}

export default InfoPopup
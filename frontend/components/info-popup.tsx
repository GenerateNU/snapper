import { View, Text, Image, ScrollView, Button, LayoutAnimation, Animated, Easing, Dimensions } from "react-native"
import { useInfoPopup } from "../contexts/info-popup-context";
import { useEffect, useRef } from "react";

const images = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Red_Snapper.jpg/2560px-Red_Snapper.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/7/79/Lutjanus_campechanus.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/3/30/Lucam_u0.gif",
    "https://upload.wikimedia.org/wikipedia/commons/8/8b/Lutjanus_campechanus.png",
]

const InfoPopup = () => {
    const { isOpen, setClose } = useInfoPopup();

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
        <View className={"bg-white w-screen h-2/3"}>
            <Button title="X" onPress={setClose} />
            <View className=" bg-primary-blue pt-12 pb-12 px-8 flex flex-row justify-between">
                <View className=" flex flex-col gap-1">
                    <Text className=" text-sm">
                        📍 Western Atlantic Ocean
                    </Text>
                    <Text className=" text-2xl font-semibold">
                        Red Snapper
                    </Text>
                    <Text className=" text-sm italic">
                        Latin name
                    </Text>
                </View>
                <Image className=" h-16 w-32" source={{ uri: "https://www.fisheries.noaa.gov/s3/2022-09/640x427-Snapper-Red-NOAAFisheries.png" }} />
            </View>
            <View className=" bg-white px-8 py-8 gap-y-2">
                <View className="">
                    <View className=" flex flex-row justify-between pb-2">
                        <Text className=" text-xs font-bold">Photos:</Text>
                        <Text className=" text-xs">View all photos</Text>
                    </View>
                    <ScrollView horizontal className="flex flex-row gap-2">
                        {images.map((url, i) => (
                            <Image style={{ overlayColor: "white" }} key={i} className=" w-20 h-20 rounded-xl overlay" source={{ uri: url }}></Image>
                        ))}
                    </ScrollView>
                </View>
                <View
                    className=" border-background border-b-2"
                />
                <View className="flex flex-col gap-y-2">
                    <Text className=" text-xs font-bold">Description:</Text>
                    <Text className=" text-xs">
                        Red snapper is like the rock star of the underwater world! With its vibrant, ruby-red skin and striking profile, it turns heads wherever it swims.
                    </Text>
                    <Text className=" text-xs">
                        These fish are known for their playful nature and curious personalities, often approaching divers with a friendly swagger.
                    </Text>
                </View>
                <View className=" flex flex-col gap-y-2">
                    <Text className=" text-xs font-bold">More Facts:</Text>
                </View>
            </View>
        </View >
    </Animated.View>
}

export default InfoPopup
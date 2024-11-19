import { Modal } from "react-native";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { NewPFP } from "./newPFP";
import { UpdateProfileFields } from '../../../../types/userProfile'
import { useForm, FormProvider } from "react-hook-form";
import Button from "../../../../components/button";
import { useAuthStore } from "../../../../auth/authStore";


interface PFPProps {
    visible: boolean,
    onClose: React.Dispatch<React.SetStateAction<boolean>>
}

export function ChangePFP({ visible, onClose }: PFPProps) {
    const methods = useForm<UpdateProfileFields>()
    const onSubmit = (data: string) => console.log(data);
    const currentUser = useAuthStore();

    console.log(currentUser.supabaseId);
    return (
        <FormProvider {...methods}>
            <Modal visible={visible} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-lg p-6 w-4/5">
                        <View className={"flex flex-row justify-between"}>
                        <Text className="text-lg font-medium mb-4">Edit Profile</Text>
                        <TouchableOpacity 
                        onPress={() => onClose(false)}
                        className="aspect-square h-[30px] h-[30px] rounded-full">
                            {/* X.png is fucked, off by like 1 px*/}
                            <Image
                            className="w-full h-full rounded-full object-cover"
                                source={require("../../../../assets/x.png")}
                            />
                        </TouchableOpacity>
                        </View>

                        <NewPFP id={""} />
                        <Button
                            onPress={() => { onClose(false); onSubmit(methods.getValues().profilePhoto) }}
                            text="Update" />
                    </View>
                </View>
            </Modal>
        </FormProvider >
    );
}
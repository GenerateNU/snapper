import { Modal } from "react-native";
import { View, Text, TouchableHighlight } from "react-native";
import { useAuthStore } from "../../../../auth/authStore";
import { NewPFP } from "./newPFP";
import { UpdateProfileFields } from '../../../../types/userProfile'
import { useFormContext, useForm, FormProvider } from "react-hook-form";
import Button from "../../../../components/button";



export function ChangePFP({ visible, onClose }) {
    const methods = useForm<UpdateProfileFields>()
    const onSubmit = (data: string) => console.log(data);
    const currentUser = useAuthStore();

    return (
        <FormProvider {...methods}>
            <Modal visible={visible} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-lg p-6 w-4/5">
                        <Text className="text-lg font-medium mb-4">Edit Profile</Text>
                        {/*Opening this screen causes the app to shit its self, not sure why. Will look at later */}
                        <NewPFP id={""} />
                        <Button
                            onPress={() => { onClose(); onSubmit(methods.getValues().profilePhoto) }}
                            text="Close" />
                    </View>
                </View>
            </Modal>
        </FormProvider >
    );
}
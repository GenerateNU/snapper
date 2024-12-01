import React from 'react';
import { View, Text, Pressable, Keyboard, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../../../auth/authStore';
import Profile from '../../../../components/profile';
import { PROFILE_PHOTO } from '../../../../consts/profile';
import { useUserById } from '../../../../hooks/user';
import Input from '../../../../components/input';
import Button from '../../../../components/button';
import Pencil from '../../../../assets/edit-pencil.svg'

export default function EditCurrentUser() {
    const { mongoDBId } = useAuthStore();

    if (!mongoDBId) {
        //TODO: Make a skeleton for this
    }

    const { data, isError, isLoading } = useUserById(mongoDBId!);

    if (isError) {
        //TODO: Make a mock for this
    }

    if (isLoading) {
        //TODO: Make a skeleton for this
    }


    return (
        <Pressable onPress={() => Keyboard.dismiss()}>
            <View className={"flex h-full items-center mt-3"}>

                <Text className='font-bold text-[25px] text-darkblue'>Edit Profile</Text>
                <View className='p-2'>
                    <TouchableOpacity className='w-fit h-fit rounded-full border border-darkblue border-2'>
                        <Profile image={data?.user.profilePicture ? data?.user.profilePicture : PROFILE_PHOTO}
                            outline size="xl" />
                        <View className="absolute bottom-0 right-0 bg-darkblue w-[33px] h-[33px] rounded-full justify-center items-center">
                            <Pencil width={20} height={20} />
                        </View>
                    </TouchableOpacity>
                </View>
                <Text className='font-bold text-[20px] text-darkblue'>{data?.user.firstName + " " + data?.user.lastName}</Text>
                <Text className='font-light text-[13px] text-darkblue'>{"@" + data?.user.username}</Text>
                <View className='p-8 pb-7 pt-4 w-full'>
                    <View className='flex w-full items-start'>
                        <Text className='text-[14px] font-semibold text-darkblue p-2 pl-0'>First Name</Text>
                        <Input value={data?.user.firstName} />
                    </View>
                    <View className='flex w-full items-start'>
                        <Text className='text-[14px] font-semibold text-darkblue p-2 pl-0'>Last Name</Text>
                        <Input value={data?.user.lastName} />
                    </View>
                    <View className='flex w-full items-start'>
                        <Text className='text-[14px] font-semibold text-darkblue p-2 pl-0'>Username</Text>
                        <Input value={data?.user.username} />
                    </View>
                    <View className='flex w-full items-start'>
                        <Text className='text-[14px] font-semibold text-darkblue p-2 pl-0'>Email</Text>
                        <Input value={data?.user.email} />
                    </View>

                </View>
                <View className='pl-8 pr-8 pb-2 w-full'>
                    <Button text="Save Changes" />
                </View>
                <View className='p-2 pl-8 pr-8 w-full'>
                    {/*Most of the colors here do not work, not sure why*/}
                    <Button backgroundColor='blue-300' color='darkblue' text="Discard Changes" />
                </View>
            </View>
        </Pressable>
    );
}
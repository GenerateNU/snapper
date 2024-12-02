import React, { useState } from 'react';
import { View, Text, Pressable, Keyboard, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../../../auth/authStore';
import Profile from '../../../../components/profile';
import { PROFILE_PHOTO } from '../../../../consts/profile';
import { useUserById } from '../../../../hooks/user';
import Input from '../../../../components/input';
import Button from '../../../../components/button';
import Pencil from '../../../../assets/edit-pencil.svg';
import * as ExpoImagePicker from 'expo-image-picker';
import { Photo } from '../../../../types/divelog';
import { SetStateAction } from 'react';
import { Dispatch } from 'react';
import { router } from 'expo-router';
import { UpdateUser } from '../../../../types/userProfile';
import { apiConfig } from '../../../../api/apiContext';


export default function EditCurrentUser() {
    const { mongoDBId } = useAuthStore();

    const [firstName, setFirstName] = useState<string | undefined>(undefined);
    const [lastName, setLastName] = useState<string>('');
    const [username, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<Photo>();


    if (!mongoDBId) {
        // TODO: Make a skeleton for this
    }

    const { data, isError, isLoading } = useUserById(mongoDBId!);

    if (isError) {
        // TODO: Handle error state
    }

    if (isLoading) {
        // TODO: Make a skeleton for this
    }


    if (!isError && !isLoading && firstName == undefined) {
        setFirstName(data.user.firstName);
        setLastName(data.user.lastName);
        setUserName(data.user.username);
        setEmail(data.user.email);
        setProfilePicture(data.user.profilePicture);
    }

    const onSubmit = async () => {
        const out: UpdateUser = {
            profilePicture: profilePicture!,
            firstName: firstName!,
            lastName: lastName,
            email: email,
            username: username
        };

        const response = await fetch(`${apiConfig}/user/actions/edit`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(out),
        });
    };

    return (
        <Pressable onPress={() => Keyboard.dismiss()}>
            <View className={'flex h-full items-center mt-3'}>
                <Text className='font-bold text-[20px] text-darkblue p-1'>Edit Profile</Text>
                <View className='p-2'>
                    <TouchableOpacity
                        onPress={() => pickImage(setProfilePicture)}
                        className='w-fit h-fit rounded-full border border-darkblue border-2'>
                        <Profile image={data?.user.profilePicture ? data?.user.profilePicture : PROFILE_PHOTO} outline size='xl' />
                        <View className='absolute bottom-0 right-0 bg-darkblue w-[33px] h-[33px] rounded-full justify-center items-center'>
                            <Pencil width={20} height={20} />
                        </View>
                    </TouchableOpacity>
                </View>
                <Text className='font-bold text-[18px] text-darkblue'>{data?.user.firstName + ' ' + data?.user.lastName}</Text>
                <Text className='font-light text-[13px] text-darkblue'>{'@' + data?.user.username}</Text>
                <View className='p-8 pb-5 pt-4 w-full'>
                    <View className='flex w-full items-start'>
                        <Text className='text-[14px] font-semibold text-darkblue p-2 pl-0'>First Name</Text>
                        <Input value={firstName}
                            onChangeText={(value: string) => {
                                setFirstName(value)
                            }} />
                    </View>
                    <View className='flex w-full items-start'>
                        <Text className='text-[14px] font-semibold text-darkblue p-2 pl-0'>Last Name</Text>
                        <Input
                            onChangeText={(value) => setLastName(value)}
                            value={lastName} />
                    </View>
                    <View className='flex w-full items-start'>
                        <Text className='text-[14px] font-semibold text-darkblue p-2 pl-0'>Username</Text>
                        <Input onChangeText={(value) => setUserName(value)}
                            value={username} />
                    </View>
                    <View className='flex w-full items-start'>
                        <Text className='text-[14px] font-semibold text-darkblue p-2 pl-0'>Email</Text>
                        <Input onChangeText={(value) => setEmail(value)}
                            value={email} />
                    </View>
                </View>
                <View className='pl-8 pr-8 pb-2 w-full'>
                    <Button text='Save Changes'
                        onPress={() => {
                            onSubmit();
                        }} />
                </View>
                <View className='p-2 pl-8 pr-8 w-full'>
                    <Button backgroundColor='blue-300' color='darkblue' text='Discard Changes'
                        onPress={() => {
                            router.push('/(tabs)/profile');
                        }} />
                </View>
            </View>
        </Pressable>
    );
}

async function pickImage(setValue: Dispatch<SetStateAction<Photo | undefined>>) {
    let result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
    });

    if (!result.canceled) {
        //Pretty messy, lets but for now its okay.
        const fetchImageFromURI = async (uri: string): Promise<Photo> => {
            const res = await fetch(uri);
            const blob = await res.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onloadend = () => {
                    if (reader.result) {
                        const result = reader.result as string;
                        const photo: Photo = {
                            base64: result,
                            name: uri,
                            fileType: 'image/jpeg',
                        };
                        resolve(photo);
                    } else {
                        reject(new Error('Failed to convert blob to base64.'));
                    }
                };

                reader.onerror = () => {
                    reject(new Error('Error reading the file.'));
                };

                reader.readAsDataURL(blob);
            });
        };

        const fs = fetchImageFromURI(result.assets[0].uri);

        const base64s = await Promise.all([fs]);

        setValue(base64s[0]);
        return result.assets[0].uri;
    }
}
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import {
  useForm,
  FormProvider,
  useFormContext,
  Form,
  Controller,
} from 'react-hook-form';
import PostCreationForm from './components/post-creation-form';

export default function PostCreation() {
  return (
    <View className="flex items-center w-full bg-white h-full">
      <ScrollView className="flex flex-col w-[90vw] bg-white">
        <View className="flex flex-col justify-items items-center pt-[5vh] mb-[3vh]">
          <Text className="font-bold text-[24px] leading-[29.05px] pb-[1vh]">
            {' '}
            Log A Dive{' '}
          </Text>
          <Text className="font-normal text-center text-[14px] leading-[18px]">
            {' '}
            Ready to capture your underwater adventure?
          </Text>
          <Text className="font-normal text-center w-[70vw] text-[14px] leading-[18px]">
            {' '}
            Fill out the details below to log your dive experience!
          </Text>
        </View>
        <PostCreationForm />
      </ScrollView>
    </View>
  );
}

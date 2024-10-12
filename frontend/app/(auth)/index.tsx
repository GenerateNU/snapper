import React from 'react';
import { View, Text } from 'react-native';
import Button from '../../components/button';
import { router } from 'expo-router';

const Welcome = () => {
  return (
    <View className="flex-1 flex-col justify-center items-center bg-[#f0f0f0] px-[8%]">
      <View className="w-full items-center pb-[8%] flex-gap">
        <Text className="text-2xl font-bold">Let's dive in!</Text>
        <Text className="text-center text-base">
          Explore our database and{'\n'}tag species from your dives
        </Text>
      </View>
      <View className="w-full" style={{ gap: 20, flexDirection: 'column' }}>
        <Button
          color="black"
          backgroundColor="white"
          text="Sign Up"
          onPress={() => router.push('/register')}
        />
        <Button text="Sign In" onPress={() => router.push('/login')} />
      </View>
    </View>
  );
};

export default Welcome;

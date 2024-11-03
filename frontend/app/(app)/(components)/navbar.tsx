import { View, Pressable } from 'react-native';
import Home from '../../../assets/house.svg';
import Explore from '../../../assets/explore.svg';
import Star from '../../../assets/Star.svg';
import Plus from '../../../assets/plus.svg';
import Profile from '../../../assets/profile.svg';
import { router } from 'expo-router';

const height = 30;
const width = 30;

export const NavBar = () => {
  return (
    <View className="h-16 flex justify-center items-center flex flex-row gap-x-8 p-4">
      <Pressable onPress={() => router.push('/(app)')}>
        <Home height={height} width={width} />
      </Pressable>

      <Pressable onPress={() => {}}>
        <Explore height={height} width={width} />
      </Pressable>

      <Pressable
        onPress={() => {
          router.push('/(postcreation)');
        }}
      >
        <Plus height={height} width={width} />
      </Pressable>

      <Pressable onPress={() => {}}>
        <Star height={40} width={40} />
      </Pressable>

      <Pressable onPress={() => {}}>
        <Profile height={height} width={width} />
      </Pressable>
    </View>
  );
};

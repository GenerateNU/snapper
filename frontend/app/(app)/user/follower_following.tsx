import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useUserById } from '../../../hooks/user';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { UserType } from '../../../types/userProfile';
import ProfileTags from '../../../components/profile_tag';

const FollowerFollowing = () => {
  const { width } = Dimensions.get('window');
  const { id, option } = useLocalSearchParams<{ id: string; option: string }>();
  const { data, isError, isLoading } = useUserById(id);
  const [category, setCategory] =
    option == 'followers' ? useState('Followers') : useState('Following');
  const [userData, setUserData] = useState<string[]>([]);

  useEffect(() => {
    const findData = () => {
      if (category == 'Followers') {
        setUserData(data?.user.followers);
      } else {
        setUserData(data?.user.following);
      }
    };
    findData();
  }, [category]);

  const renderUser = ({ item }: { item: any }) => (
    <View className="mb-2 w-[80vw]">
      <ProfileTags id={item} />
    </View>
  );

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(category === 'Followers' ? 0 : width / 2, {
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
      ],
    };
  }, [category]);

  return (
    <LinearGradient
      colors={['#549ac7', '#ffffff', '#ffffff', '#ffffff']}
      style={{ flex: 1 }}
    >
      <View className="flex flex-col items-center mt-[10vh] ">
        <Text className="font-bold text-darkblue text-xl">
          {category === 'Followers' ? 'Followers' : 'Following'}
        </Text>
        <Text className="font-bold text-darkblue text-md mt-[2vh]">
          @{data?.user.username}
        </Text>

        <View className="flex w-100 flex-row pb-[5%] pt-[2vh]">
          <Animated.View
            className="bg-[#3788BE] absolute h-[1px] w-2/5 mx-5"
            style={[
              {
                bottom: '30%',
              },
              indicatorStyle,
            ]}
          />
          <TouchableOpacity
            className="py-2 w-[50%] justify-center items-center"
            onPress={() => setCategory('Followers')}
          >
            <Text
              className={`font-bold text-base text-sm ${
                category === 'Followers' ? 'text-[#3788BE]' : 'text-gray-400'
              }`}
            >
              {data.user.followers.length} Followers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-[3%] w-[50%] justify-center items-center"
            onPress={() => setCategory('Following')}
          >
            <Text
              className={`font-bold text-base text-sm  ${
                category === 'Following' ? 'text-[#3788BE]' : 'text-gray-400'
              }`}
            >
              {data.user.following.length} Following
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList data={userData} renderItem={renderUser}></FlatList>
      </View>
    </LinearGradient>
  );
};

export default FollowerFollowing;

import { View, Image, Text, TouchableOpacity } from 'react-native';
import Profile from '../../../../components/profile';
import Button from '../../../../components/button';
import Divider from '../../../../components/divider';
import { useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../../../auth/authStore';
import { useUserData } from '../../../../hooks/user';
import HeaderSkeleton from './skeleton/header-skeleton';
import { PROFILE_PHOTO } from '../../../../consts/profile';
import { formatNumber } from '../../../../utils/profile';

const Header = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mongoDBId, user } = useAuthStore();
  const { data, isError, isLoading } = useUserData();

  if (isLoading) {
    return <HeaderSkeleton />;
  }

  if (isError) {
    return (
      <View className="flex flex-col w-full p-4">
        <Text className="text-red-500">Failed to load user data.</Text>
      </View>
    );
  }

  const profilePhoto = user.profilePicture ? user.profilePicture : PROFILE_PHOTO;

  return (
    <View className="flex flex-col w-full">
      <View className="flex flex-row w-full">
        <Profile image={profilePhoto} />
        <View className="flex flex-row ml-[5%] justify-around w-3/4">
          <TouchableOpacity className="flex-col justify-center items-center flex-1">
            <Text className="font-bold text-darkblue">
              {formatNumber(data?.user.followers.length)}
            </Text>
            <Text className="text-darkblue">Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-col justify-center items-center flex-1">
            <Text className="font-bold text-darkblue">
            {formatNumber(data?.user.following.length)}
            </Text>
            <Text className="text-darkblue">Following</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-row justify-between py-[5%]">
        <View>
          <Text className="font-bold text-xl text-darkblue">First Last</Text>
          <Text className="text-ocean">{`@${data?.user.username}`}</Text>
        </View>
        {id !== mongoDBId && <Button text="Follow" small />}
      </View>
      <Divider />
    </View>
  );
};

export default Header;

import { View, Text, TouchableOpacity } from 'react-native';
import Profile from '../../../../components/profile';
import Button from '../../../../components/button';
import Divider from '../../../../components/divider';
import { useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../../../auth/authStore';
import { useFollowUser, useUserById, useUserData } from '../../../../hooks/user';
import HeaderSkeleton from './skeleton/header-skeleton';
import { PROFILE_PHOTO } from '../../../../consts/profile';
import { formatNumber } from '../../../../utils/profile';
import { useCallback, useEffect, useState } from 'react';

const Header = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { supabaseId, mongoDBId } = useAuthStore();

  const { data, isError, isLoading } = supabaseId !== id ? useUserById(id) : useUserData();
  const followMutation = useFollowUser();

  const follow: boolean = data?.user.followers.some(
    (follower: string) => follower === mongoDBId
  );
  console.log(follow);

  const [isFollowing, setIsFollowing] = useState(follow);

  const handleFollowToggle = useCallback(async () => {
    try {
      await followMutation.mutateAsync(id);
      setIsFollowing(prevState => !prevState);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  }, [followMutation, id]);

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

  return (
    <View className="flex flex-col w-full">
      <View className="flex flex-row w-full">
        <Profile image={data?.user.profilePicture || PROFILE_PHOTO} />
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
        {id !== supabaseId && (
          <Button 
            onPress={handleFollowToggle}
            text={followMutation.isPending ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
            small
            disabled={followMutation.isPending}
          />
        )}
      </View>
      <Divider />
    </View>
  );
};

export default Header;

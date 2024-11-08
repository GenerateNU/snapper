import { View, Text, TouchableOpacity } from 'react-native';
import Profile from '../../../../components/profile';
import Button from '../../../../components/button';
import Divider from '../../../../components/divider';
import { useAuthStore } from '../../../../auth/authStore';
import { useFollowUser, useUserById } from '../../../../hooks/user';
import HeaderSkeleton from './skeleton/header-skeleton';
import { PROFILE_PHOTO } from '../../../../consts/profile';
import { formatNumber } from '../../../../utils/profile';
import { useCallback, useEffect, useState } from 'react';

const Header = ({ id }: { id: string }) => {
  const { supabaseId, mongoDBId } = useAuthStore();
  const { data, isError, isLoading } = useUserById(id);

  const followMutation = useFollowUser();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (data && data.user && Array.isArray(data.user.followers)) {
      const isUserFollowing = data.user.followers.includes(mongoDBId);
      setIsFollowing(isUserFollowing);
    }
  }, [data, mongoDBId]);

  const handleFollowToggle = useCallback(async () => {
    if (!supabaseId) {
      console.error('supabaseId is null');
      return;
    }

    setIsFollowing((prevIsFollowing) => !prevIsFollowing);

    try {
      await followMutation.mutateAsync({ id: supabaseId, followUserId: id });
    } catch (error) {
      console.error('Error toggling follow status:', error);
      setIsFollowing((prevIsFollowing) => !prevIsFollowing);
    }
  }, [followMutation, id, supabaseId]);

  if (isLoading) {
    return <HeaderSkeleton />;
  }

  if (isError) {
    return (
      <View className="flex flex-col w-full p-4">
        <Text className="text-red-500 text-sm sm:text-base md:text-lg">
          Failed to load user data.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col w-full">
      <View className="flex flex-row w-full">
        <Profile image={data?.user.profilePicture || PROFILE_PHOTO} />
        <View className="flex flex-row ml-[5%] justify-around w-3/4">
          <TouchableOpacity className="flex-col justify-center items-center flex-1">
            <Text className="font-bold text-darkblue text-md sm:text-lg md:text-xl">
              {formatNumber(data?.user.followers.length)}
            </Text>
            <Text className="text-darkblue text-xs sm:text-base">
              Followers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-col justify-center items-center flex-1">
            <Text className="font-bold text-darkblue text-md sm:text-lg md:text-xl">
              {formatNumber(data?.user.following.length)}
            </Text>
            <Text className="text-darkblue text-xs sm:text-md">Following</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex flex-row justify-between py-[5%]">
        <View>
          <Text className="font-bold text-lg sm:text-xl md:text-2xl text-darkblue">
            {data?.user.name || 'First Last'}
          </Text>
          <Text className="text-ocean text-sm sm:text-base">{`@${data?.user.username}`}</Text>
        </View>
        {id !== supabaseId && (
          <Button
            onPress={handleFollowToggle}
            text={
              followMutation.isPending
                ? 'Loading...'
                : isFollowing
                  ? 'Unfollow'
                  : 'Follow'
            }
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

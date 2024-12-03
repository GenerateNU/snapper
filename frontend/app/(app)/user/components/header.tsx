import { View, Text, TouchableOpacity } from 'react-native';
import Profile from '../../../../components/profile';
import Divider from '../../../../components/divider';
import { useAuthStore } from '../../../../auth/authStore';
import { useUserById } from '../../../../hooks/user';
import HeaderSkeleton from './skeleton/header-skeleton';
import { PROFILE_PHOTO } from '../../../../consts/profile';
import { formatNumber } from '../../../../utils/profile';
import FollowButton from './follow-button';
import useFollow from '../../../../hooks/following';
import { router } from 'expo-router';

const Header = ({ id }: { id: string }) => {
  const { mongoDBId } = useAuthStore();
  const { data, isError, isLoading } = useUserById(id);
  const { handleFollowToggle, isFollowing, isPending } = useFollow(id);

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
        <Profile
          size="lg"
          outline
          image={data?.user.profilePicture || PROFILE_PHOTO}
        />
        <View className="flex flex-row ml-[5%] justify-around w-3/4">
          <TouchableOpacity
            className="flex-col justify-center items-center flex-1"
            onPress={() => {
              router.push({
                pathname: '/user/follower_following',
                params: { id: id, option: 'followers' },
              });
            }}
          >
            <Text className="font-bold text-darkblue text-md sm:text-lg md:text-xl">
              {formatNumber(data?.user.followers.length)}
            </Text>
            <Text className="text-darkblue text-xs sm:text-base">
              Followers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-col justify-center items-center flex-1"
            onPress={() => {
              router.push({
                pathname: '/user/follower_following',
                params: { id: id, option: 'following' },
              });
            }}
          >
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
            {data?.user.firstName && data?.user.lastName
              ? `${data.user.firstName} ${data.user.lastName}`
              : data?.user.firstName
                ? data.user.firstName
                : data?.user.lastName
                  ? data.user.lastName
                  : ''}
          </Text>
          <Text className="text-ocean text-sm sm:text-base">{`@${data?.user.username}`}</Text>
        </View>
        {id !== mongoDBId && (
          <FollowButton
            onPress={handleFollowToggle}
            isPending={isPending!}
            isFollowing={isFollowing}
          />
        )}
      </View>
      <Divider />
    </View>
  );
};

export default Header;

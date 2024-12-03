import { View, Text, TouchableOpacity } from 'react-native';
import Profile from './profile';
import { router } from 'expo-router';
import { PROFILE_PHOTO } from '../consts/profile';
import FollowButton from '../app/(app)/user/components/follow-button';
import useFollow from '../hooks/following';
import { useUserById } from '../hooks/user';
import { useAuthStore } from '../auth/authStore';
import FollowSkeleton from './follow-skeleton';

interface ProfileTagProps {
  id: string;
}
const ProfileTags: React.FC<ProfileTagProps> = ({ id }) => {
  const { data } = useUserById(id);
  const { handleFollowToggle, isFollowing, isPending } = useFollow(
    data?.user._id,
  );
  const uri = data?.user.profilePicture
    ? data?.user.profilePicture
    : PROFILE_PHOTO;
  const { mongoDBId } = useAuthStore();
  const isViewingOwnProfile = mongoDBId === id;
  return (
    <TouchableOpacity
      onPress={() => {
        router.push(`/user/${data?.user._id}`);
      }}
      className="flex justify-between w-full flex-row items-center h-[8vh] bg-white shadow-sm rounded-lg px-2"
    >
      <View className="flex flex-row items-center">
        <Profile image={uri} size="md" />
        <View className="flex flex-col pl-3">
          <Text>{data?.user.username}</Text>
        </View>
      </View>

      {isViewingOwnProfile ? (
        <></>
      ) : (
        <FollowButton
          onPress={handleFollowToggle}
          isPending={isPending!}
          isFollowing={isFollowing}
        />
      )}
    </TouchableOpacity>
  );
};

export default ProfileTags;

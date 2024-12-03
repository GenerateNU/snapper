import { View, Text, TouchableOpacity } from 'react-native';
import Profile from './profile';
import { router } from 'expo-router';
import { PROFILE_PHOTO } from '../consts/profile';
import FollowButton from '../app/(app)/user/components/follow-button';
import useFollow from '../hooks/following';
import { UserType } from '../types/userProfile';
import { useUserById } from '../hooks/user';
import { useAuthStore } from '../auth/authStore';

interface ProfileTagProps {
  id: string;
}
const ProfileTags: React.FC<ProfileTagProps> = ({ id }) => {
  const { data, isLoading, isError } = useUserById(id);
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
      className="flex w-full flex-row items-center h-[8vh] bg-white shadow-sm rounded-lg pl-2"
    >
      <Profile image={uri} size="md" />
      <View className="flex flex-col pl-2">
        <Text>{data?.user.username}</Text>
      </View>

      {isViewingOwnProfile ? (
        <></>
      ) : (
        <View className="absolute left-[58vw] w-[60vw]">
          <FollowButton
            onPress={handleFollowToggle}
            isPending={isPending!}
            isFollowing={isFollowing}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ProfileTags;

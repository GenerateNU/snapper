import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import Profile from '../profile';
import FollowButton from '../../app/(app)/user/components/follow-button';
import { timeAgo } from '../../utils/profile';
import { router } from 'expo-router';
import useFollow from '../../hooks/following';
import { PROFILE_PHOTO } from '../../consts/profile';

const { width } = Dimensions.get('window');

const getFontSize = (baseSize: number) => {
  const scale = width / 375;
  return Math.round(baseSize * scale);
};

interface NotificationProps {
  type: 'FOLLOW' | 'LIKE' | 'POST';
  time: string;
  profilePicture: string;
  message: string;
  username: string;
  actorId: string;
  targetId: string;
  postImage?: string;
}

const NotificationEntry: React.FC<NotificationProps> = ({
  postImage,
  time,
  profilePicture,
  message,
  username,
  type,
  actorId,
  targetId,
}) => {
  const messageParts = message.split(username);

  const navigateToProfile = () => router.push(`/user/${actorId}`);

  const navigateToPost = () => router.push(`/divelog/${targetId}`);

  const renderProfileImage = type !== 'POST' && (
    <Pressable onPress={navigateToProfile}>
      <Profile size="md" image={profilePicture || PROFILE_PHOTO} />
    </Pressable>
  );

  const renderFollowButton = type === 'FOLLOW' && (
    <FollowButtonWrapper actorId={actorId} />
  );

  const renderPostImage = (type === 'LIKE' || type === 'POST') && postImage && (
    <Pressable onPress={navigateToPost}>
      <Image source={{ uri: postImage }} className="w-12 h-12 rounded-xl" />
    </Pressable>
  );

  return (
    <View
      style={{ gap: 12 }}
      className="flex-row justify-between items-center w-full"
    >
      {renderProfileImage}
      <Pressable
        onPress={type !== 'POST' ? navigateToProfile : navigateToPost}
        className="flex flex-col flex-1 mr-2"
      >
        <Text className="text-md" style={{ fontSize: getFontSize(12) }}>
          {messageParts[0]}
          <Text style={{ fontWeight: 'bold', fontSize: getFontSize(12) }}>
            {username}
          </Text>
          {messageParts[1]}
        </Text>
        <Text
          className="pt-1 text-xs text-slate-500"
          style={{ fontSize: getFontSize(10) }}
        >
          {timeAgo(new Date(time))}
        </Text>
      </Pressable>
      {renderFollowButton}
      {renderPostImage}
    </View>
  );
};

const FollowButtonWrapper = ({ actorId }: { actorId: string }) => {
  const { handleFollowToggle, isFollowing, isPending } = useFollow(actorId);

  return (
    <FollowButton
      onPress={handleFollowToggle}
      isFollowing={isFollowing}
      isPending={isPending}
    />
  );
};

export default NotificationEntry;

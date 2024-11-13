import Button from '../../../../components/button';

interface FollowButtonProps {
  isPending: boolean;
  isFollowing: boolean;
  onPress: () => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  isPending,
  isFollowing,
  onPress,
}) => {
  return (
    <Button
      onPress={onPress}
      text={isPending ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
      small
      disabled={isPending}
    />
  );
};

export default FollowButton;

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
      text={isFollowing ? 'Following' : 'Follow'}
      small
    />
  );
};

export default FollowButton;

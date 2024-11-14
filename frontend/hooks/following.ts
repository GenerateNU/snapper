import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../auth/authStore';
import { useFollowUser, useUserById } from './user';

const useFollow = (followUser: string) => {
  const { mongoDBId } = useAuthStore();
  const { data } = useUserById(followUser);

  const followMutation = useFollowUser();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (data && data.user && Array.isArray(data.user.followers)) {
      const isUserFollowing = data.user.followers.includes(mongoDBId);
      setIsFollowing(isUserFollowing);
    }
  }, [data, mongoDBId]);

  const handleFollowToggle = useCallback(async () => {
    if (!mongoDBId) {
      console.error('ID is null');
      return null;
    }

    setIsFollowing((prevIsFollowing) => !prevIsFollowing);

    try {
      await followMutation.mutateAsync({
        id: mongoDBId,
        followUserId: followUser,
      });
    } catch (error) {
      console.error('Error toggling follow status:', error);
      setIsFollowing((prevIsFollowing) => !prevIsFollowing);
    }
  }, [followMutation, followUser, mongoDBId]);

  return {
    isFollowing,
    handleFollowToggle,
    isPending: followMutation.isPending,
  };
};

export default useFollow;

import { useAuthStore } from '../auth/authStore';
import { useFollowUser, useUserById } from './user';
import { useToggleBase } from './base';

interface User {
  followers: string[];
}

interface FollowMutationParams {
  id: string;
  followUserId: string;
}

const useFollow = (followUserId: string) => {
  const { mongoDBId } = useAuthStore();

  if (!mongoDBId) {
    return {
      isFollowing: false,
      handleFollowToggle: () => {
        console.error('User ID is required');
      },
      isPending: false,
      isReady: false,
    } as const;
  }

  const { data } = useUserById(followUserId);
  const followMutation = useFollowUser();

  const toggleBase = useToggleBase<{ user: User }, FollowMutationParams>({
    initialState: false,
    data: data,
    checkIsActive: (data) => {
      return (
        Array.isArray(data.user.followers) &&
        data.user.followers.includes(mongoDBId)
      );
    },
    mutation: followMutation,
    mutationParams: {
      id: mongoDBId,
      followUserId: followUserId,
    },
  });

  return {
    ...toggleBase,
    isFollowing: toggleBase.isActive,
    handleFollowToggle: toggleBase.handleToggle,
    isPending: toggleBase.isPending,
  };
};

export default useFollow;

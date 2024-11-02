import {
  getMe,
  getUserDiveLogs,
  getUserFish,
  getUserById,
  getUserFishById,
  getUserBadges,
  getUserDiveLogsById,
  followUser,
} from '../api/user';
import { API_BASE_URL } from '../consts/onboarding';
import { useQueryBase } from './base';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUserData = () => {
  return useQueryBase(['user'], getMe);
};

export const useUserDiveLogs = () => {
  return useQueryBase(['divelogs'], getUserDiveLogs);
};

export const useUserFish = () => {
  return useQueryBase(['fish'], getUserFish);
};

export const useUserBadges = () => {
  return useQueryBase(['badges'], getUserBadges);
};

export const useUserById = (id: string) => {
  return useQueryBase(['user', id], () => getUserById(id));
};

export const useUserDivelogById = (id: string) => {
  return useQueryBase(['user', id], () => getUserDiveLogsById(id));
};

export const useUserFishById = (id: string) => {
  return useQueryBase(['user', id], () => getUserFishById(id));
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => followUser(id),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['user'] });

      queryClient.setQueryData(['user', userId], (oldData: any) => {
        if (!oldData) return oldData;

        const currentUser = queryClient.getQueryData(['user']) as any;
        const currentUserId = currentUser?.user?.id;

        const isCurrentlyFollowing = oldData.user.followers.some(
          (follower: { id: string }) => follower.id === currentUserId,
        );

        return {
          ...oldData,
          user: {
            ...oldData.user,
            followers: isCurrentlyFollowing
              ? oldData.user.followers.filter(
                  (follower: { id: string }) => follower.id !== currentUserId,
                )
              : [...oldData.user.followers, { id: currentUserId }],
          },
        };
      });
    },
    onError: (error) => {
      console.error('Error toggling follow status:', error);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

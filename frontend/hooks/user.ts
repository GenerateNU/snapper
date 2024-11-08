import {
  getMe,
  getUserDiveLogs,
  getUserSpecies,
  getUserById,
  getUserSpeciesById,
  getUserDiveLogsById,
  followUser,
} from '../api/user';
import { useQueryBase } from './base';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUserData = () => {
  return useQueryBase(['user'], getMe);
};

export const useUserDiveLogs = () => {
  return useQueryBase(['divelogs'], getUserDiveLogs);
};

export const useUserSpecies = () => {
  return useQueryBase(['species'], getUserSpecies);
};

export const useUserById = (id: string) => {
  return useQueryBase(['user', id], () => getUserById(id));
};

export const useUserDivelogById = (id: string) => {
  return useQueryBase(['divelogs', id], () => getUserDiveLogsById(id));
};

export const useUserSpeciesById = (id: string) => {
  return useQueryBase(['species', id], () => getUserSpeciesById(id));
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, followUserId }: { id: string; followUserId: string }) =>
      followUser(id, followUserId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['user'] });

      queryClient.setQueryData(['user', id], (oldData: any) => {
        if (
          !oldData ||
          !oldData.user ||
          !Array.isArray(oldData.user.followers)
        ) {
          return oldData;
        }

        const currentUser = queryClient.getQueryData(['user']) as any;
        const currentUserId = currentUser?.user?.id;

        if (!currentUserId) return oldData;

        const isCurrentlyFollowing = oldData.user.followers.some(
          (follower: { id: string }) => follower.id === currentUserId,
        );

        const updatedFollowers = isCurrentlyFollowing
          ? oldData.user.followers.filter(
              (follower: { id: string }) => follower.id !== currentUserId,
            )
          : [...oldData.user.followers, { id: currentUserId }];

        return {
          ...oldData,
          user: {
            ...oldData.user,
            followers: updatedFollowers,
          },
        };
      });
    },
    onError: (error: any) => {
      console.error('Error toggling follow status:', error);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

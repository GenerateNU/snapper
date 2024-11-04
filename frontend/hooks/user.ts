import {
  getMe,
  getUserDiveLogs,
  getUserFish,
  getUserById,
  getUserFishById,
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

export const useUserFish = () => {
  return useQueryBase(['fish'], getUserFish);
};

export const useUserById = (id: string) => {
  return useQueryBase(['user', id], () => getUserById(id));
};

export const useUserDivelogById = (id: string) => {
  return useQueryBase(['divelogs', id], () => getUserDiveLogsById(id));
};

export const useUserFishById = (id: string) => {
  return useQueryBase(['fish', id], () => getUserFishById(id));
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, followUserId }: { id: string; followUserId: string }) =>
      followUser(id, followUserId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Error toggling follow status:', error);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

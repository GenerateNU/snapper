import {
  getMe,
  getUserById,
  getUserSpeciesById,
  getUserDiveLogsById,
  followUser,
  getUserNotifications,
  toggleLikeDivelog,
  getUserFollowingPosts,
} from '../api/user';
import {
  useInfiniteScrollQuery,
  useQueryBase,
  useQueryPagination,
} from './base';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUserData = () => {
  return useQueryBase(['user'], getMe);
};

export const useUserById = (id: string) => {
  return useQueryBase(['user', id], () => getUserById(id));
};

export const useUserDiveLogs = (id: string) => {
  return useQueryPagination(
    id,
    'divelogs',
    async (id, page): Promise<any[]> => {
      const response = await getUserDiveLogsById(id, page);
      return response;
    },
  );
};

export const useUserSpecies = (id: string) => {
  return useQueryPagination(id, 'species', async (id, page): Promise<any[]> => {
    const response = await getUserSpeciesById(id, page);
    return response;
  });
};

export const useUserNotification = (id: string) => {
  return useQueryPagination(
    id,
    'notifications',
    async (id, page): Promise<any[]> => {
      const response = await getUserNotifications(id, page);
      return response;
    },
  );
};

export const useUserFollowingPosts = (id: string) => {
  return useInfiniteScrollQuery(
    id,
    'following',
    async (id, page): Promise<any[]> => {
      const response = await getUserFollowingPosts(id, page);
      return response;
    },
  );
};

export const useLikeDivelog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, divelogId }: { id: string; divelogId: string }) =>
      toggleLikeDivelog(id, divelogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divelog'] });
    },
    onError: (error: any) => {
      console.error('Error toggling like status:', error);
      queryClient.invalidateQueries({ queryKey: ['divelog'] });
    },
  });
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
    onError: (error: any) => {
      console.error('Error toggling follow status:', error);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

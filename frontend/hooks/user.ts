import {
  getMe,
  getUserById,
  getUserSpeciesById,
  getUserDiveLogsById,
  followUser,
  getUserNotifications,
  toggleLikeDivelog,
} from '../api/user';
import { useQueryBase } from './base';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

export const useUserData = () => {
  return useQueryBase(['user'], getMe);
};

export const useUserById = (id: string) => {
  return useQueryBase(['user', id], () => getUserById(id));
};

export const usePaginatedDiveLogs = (id: string) => {
  return useInfiniteQuery({
    queryKey: ['divelogs', id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getUserDiveLogsById(id, pageParam);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};

export const usePaginatedSpecies = (id: string) => {
  return useInfiniteQuery({
    queryKey: ['species', id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getUserSpeciesById(id, pageParam);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};

export const usePaginatedNotifications = (id: string) => {
  return useInfiniteQuery({
    queryKey: ['notifications', id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getUserNotifications(id, pageParam);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};

export const useLikeDivelog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, divelogId }: { id: string; divelogId: string }) =>
      toggleLikeDivelog(id, divelogId),
    onSuccess: (_, { divelogId }) => {
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

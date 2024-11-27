import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '../auth/authStore';

export const useQueryBase = (key: string[], queryFn: () => Promise<any>) => {
  const { refreshSession } = useAuthStore();

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      await refreshSession();
      return queryFn();
    },
    refetchOnWindowFocus: true,
    staleTime: 15000,
    refetchInterval: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
};

export const useInfiniteScrollQuery = (
  id: string,
  model: string,
  queryFunction: (id: string, page: number) => Promise<any[]>,
) => {
  const { refreshSession } = useAuthStore();

  return useInfiniteQuery({
    queryKey: [model, id],
    queryFn: async ({ pageParam = 1 }) => {
      await refreshSession();
      const response = await queryFunction(id, pageParam);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < allPages[0].length) {
        return 1;
      }

      const pageSignatures = allPages.map((page) => JSON.stringify(page));

      const currentSignature = JSON.stringify(lastPage);
      const firstOccurrence = pageSignatures.indexOf(currentSignature);
      const hasRepeatedPattern = firstOccurrence < pageSignatures.length - 1;

      if (hasRepeatedPattern) {
        const cycleLength = pageSignatures.length - firstOccurrence - 1;

        const currentPosition = allPages.length - firstOccurrence;
        return currentPosition >= cycleLength
          ? firstOccurrence + 1
          : allPages.length + 1;
      }

      return allPages.length + 1;
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: 10000,
  });
};

export const useQueryPagination = (
  id: string,
  model: string,
  queryFunction: (id: string, page: number) => Promise<any[]>,
) => {
  const { refreshSession } = useAuthStore();

  return useInfiniteQuery({
    queryKey: [model, id],
    queryFn: async ({ pageParam = 1 }) => {
      await refreshSession();
      const response = await queryFunction(id, pageParam);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.length ? allPages.length + 1 : undefined;
    },
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
};

interface ToggleBaseOptions<T, P> {
  initialState: boolean;
  data: T | undefined;
  checkIsActive: (data: T) => boolean;
  mutation: {
    mutateAsync: (params: P) => Promise<any>;
    isPending?: boolean;
  };
  mutationParams: P;
}

export const useToggleBase = <T, P>({
  initialState,
  data,
  checkIsActive,
  mutation,
  mutationParams,
}: ToggleBaseOptions<T, P>) => {
  const [isActive, setIsActive] = useState(initialState);
  const { refreshSession } = useAuthStore();

  useEffect(() => {
    if (data) {
      const isCurrentlyActive = checkIsActive(data);
      setIsActive(isCurrentlyActive);
    }
  }, [data, checkIsActive]);

  const handleToggle = useCallback(async () => {
    setIsActive((prev) => !prev);
    await refreshSession();

    try {
      await mutation.mutateAsync(mutationParams);
    } catch (error) {
      setIsActive((prev) => !prev);
    }
  }, [mutation, mutationParams]);

  return {
    isActive,
    handleToggle,
    isPending: mutation.isPending,
  };
};

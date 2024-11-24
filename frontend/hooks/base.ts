import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

export const useQueryBase = (key: string[], queryFn: () => Promise<any>) => {
  return useQuery({
    queryKey: key,
    queryFn,
    refetchOnWindowFocus: true,
    staleTime: 30000,
    refetchInterval: false,
  });
};

export const useQueryPagination = (
  id: string,
  model: string,
  queryFunction: (id: string, page: number) => Promise<any[]>,
  infiniteScroll?: boolean,
) => {
  return useInfiniteQuery({
    queryKey: [model, id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await queryFunction(id, pageParam);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < allPages[0].length) {
        return infiniteScroll ? 1 : undefined;
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
    staleTime: 30000,
    refetchInterval: false,
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

  useEffect(() => {
    if (data) {
      const isCurrentlyActive = checkIsActive(data);
      setIsActive(isCurrentlyActive);
    }
  }, [data, checkIsActive]);

  const handleToggle = useCallback(async () => {
    setIsActive((prev) => !prev);

    try {
      await mutation.mutateAsync(mutationParams);
    } catch (error) {
      console.error('Error toggling status:', error);
      setIsActive((prev) => !prev);
    }
  }, [mutation, mutationParams]);

  return {
    isActive,
    handleToggle,
    isPending: mutation.isPending,
  };
};

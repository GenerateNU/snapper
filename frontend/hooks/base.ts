import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { getUserDiveLogsById } from '../api/user';

export const useQueryBase = (key: string[], queryFn: () => Promise<any>) => {
  return useQuery({
    queryKey: key,
    queryFn,
  });
};

export const useQueryPagination = (
  id: string,
  model: string,
  queryFunction: (id: string, page: number) => Promise<any[]>,
) => {
  return useInfiniteQuery({
    queryKey: [model, id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await queryFunction(id, pageParam);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};

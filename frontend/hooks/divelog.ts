import { getDiveLogById, getNearbyDivelogs } from '../api/divelog';
import {
  useInfiniteScrollQuery,
  useQueryBase,
  useQueryPagination,
} from './base';

export const useDiveLog = (id: string) => {
  return useQueryBase(['divelog', id], () => getDiveLogById(id));
};

export const useNearbyDiveLogs = (lat: number, lng: number) => {
  return useInfiniteScrollQuery(
    '',
    'divelogs',
    async (_, page): Promise<any[]> => {
      const response = await getNearbyDivelogs(lat, lng, page);
      return response;
    },
  );
};

import { getDiveLogById, getNearbyDivelogs } from '../api/divelog';
import { Filter } from '../consts/home-menu';
import { useInfiniteScrollQuery, useQueryBase } from './base';

export const useDiveLog = (id: string) => {
  return useQueryBase(['divelog', id], () => getDiveLogById(id));
};

export const useNearbyDiveLogs = (
  lat: number,
  lng: number,
  filters: Filter[],
) => {
  return useInfiniteScrollQuery(
    '',
    'divelogs',
    async (_, page): Promise<any[]> => {
      const response = await getNearbyDivelogs(lat, lng, page, filters);
      return response;
    },
  );
};

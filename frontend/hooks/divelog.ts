import { getDiveLogById, getNearbyDivelogs } from '../api/divelog';
import { useQueryBase, useQueryPagination } from './base';

export const useDiveLog = (id: string) => {
  return useQueryBase(['divelog', id], () => getDiveLogById(id));
};

export const useNearbyDiveLogs = (lat: number, lng: number) => {
  return useQueryPagination(
    '',
    'divelogs',
    async (_, page): Promise<any[]> => {
      const response = await getNearbyDivelogs(lat, lng, page);
      return response;
    },
    true,
  );
};

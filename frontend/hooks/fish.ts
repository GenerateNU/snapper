import { getFishById } from '../api/fish';
import { useQueryBase } from './base';

export const useFish = (id: string) => {
  return useQueryBase(['fish', id], () => getFishById(id));
};

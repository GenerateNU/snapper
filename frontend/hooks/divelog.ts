import { getDiveLogById } from '../api/divelog';
import { useQueryBase } from './base';

export const useDiveLog = (id: string) => {
  return useQueryBase(['divelog', id], () => getDiveLogById(id));
};

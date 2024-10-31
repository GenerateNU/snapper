import {
  getMe,
  getUserDiveLogs,
  getUserFish,
  getUserBadges,
  getUserById,
} from '../api/user';
import { useQueryBase } from './base';

export const useUserData = () => {
  return useQueryBase(['user'], getMe);
};

export const useUserDiveLogs = () => {
  return useQueryBase(['divelogs'], getUserDiveLogs);
};

export const useUserFish = () => {
  return useQueryBase(['fish'], getUserFish);
};

export const useUserBadges = () => {
  return useQueryBase(['badges'], getUserBadges);
};

export const useUserById = (id: string) => {
  return useQueryBase(['user', id], () => getUserById(id));
};

import { useQuery } from '@tanstack/react-query';
import {
  getMe,
  getUserDiveLogs,
  getUserFish,
  getUserBadges,
  getUserById,
} from '../api/user';

export const useUserData = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getMe,
  });
};

export const useUserDiveLogs = () => {
  return useQuery({
    queryKey: ['diveLogs'],
    queryFn: getUserDiveLogs,
  });
};

export const useUserFish = () => {
  return useQuery({
    queryKey: ['fish'],
    queryFn: getUserFish,
  });
};

export const useUserBadges = () => {
  return useQuery({
    queryKey: ['badges'],
    queryFn: getUserBadges,
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoginRequestBody, RegisterRequestBody } from '../types/auth';
import { login, register } from '../api/auth';
import { router } from 'expo-router';

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RegisterRequestBody>({
    mutationFn: (userData: RegisterRequestBody) => register(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, LoginRequestBody>({
    mutationFn: (userData: LoginRequestBody) => login(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
